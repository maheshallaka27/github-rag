import path from "path";
import fs from "fs";
import Repository from "../models/Repository.js";
import client from "../config/chroma.js";
import { getLanguage } from "./language.js";
import { downloadRepository } from "./githubArchive.js";
import { getRepositoryFiles } from "./localFiles.js";
import crypto from "crypto";
import { shouldIncludeFile, shouldIncludeContent } from "./fileFilter.js";

import { chunkCode } from "./chunker.js";
import { createEmbeddings } from "./embedding.js";
import { deleteRepository } from "./repository.js";
function generateChunkId(repoId, filePath, chunkIndex) {
  const input = `${repoId}:${filePath}:${chunkIndex}`;

  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 16);
}
export async function ingestRepository(repoUrl) {
  console.log("Starting repository ingestion...");

  // 1. Download repository
  const repo = await downloadRepository(repoUrl);

  const { repoId, extractPath } = repo;
  const repository = await Repository.findOneAndUpdate(
    { repoId },
    {
      repoId,
      repoUrl,
      owner: repo.owner,
      name: repo.repo,
      status: "ingesting",
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );
  console.log("Repository:", repoId);
  try {
    // 2. Remove previous repository data
    const deletedChunks = await deleteRepository(repoId);

    console.log("Old chunks deleted:", deletedChunks);

    // 3. Get all local files
    const allFiles = getRepositoryFiles(extractPath);

    // 4. Convert absolute paths into relative paths
    const files = allFiles
      .map((filePath) => ({
        absolutePath: filePath,
        relativePath: path.relative(extractPath, filePath),
      }))
      .filter((file) => shouldIncludeFile(file.relativePath));

    console.log("Useful files:", files.length);

    // 5. Get Chroma collection
    const collection = await client.getOrCreateCollection({
      name: "github_code",
      embeddingFunction: null,
    });

    let filesProcessed = 0;
    let totalChunks = 0;
    const totalFiles = files.length;
    // 6. Process files
    for (const file of files) {
      console.log(
        `\nProcessing ${filesProcessed + 1}/${totalFiles}: ${file.relativePath}`,
      );
      let content;

      try {
        content = fs.readFileSync(file.absolutePath, "utf-8");
      } catch (error) {
        console.log("Could not read:", file.relativePath);
        filesProcessed++;

        const progress = Math.round((filesProcessed / totalFiles) * 100);

        await Repository.findOneAndUpdate(
          { repoId },
          {
            filesProcessed,
            progress,
            currentFile: file.relativePath,
          },
        );
        continue;
      }

      // 7. Content filtering
      if (!shouldIncludeContent(content)) {
        console.log("Skipping large/empty file");

        filesProcessed++;

        const progress = Math.round((filesProcessed / totalFiles) * 100);

        await Repository.findOneAndUpdate(
          { repoId },
          {
            filesProcessed,
            progress,
            currentFile: file.relativePath,
          },
        );

        continue;
      }

      // 8. Chunk file
      const chunks = chunkCode(content, 80, 10);

      // 9. Embed chunks
      const BATCH_SIZE = 50;

      for (let start = 0; start < chunks.length; start += BATCH_SIZE) {
        const batch = chunks.slice(start, start + BATCH_SIZE);

        console.log(`Embedding chunks ${start + 1} - ${start + batch.length}`);

        const embeddings = await createEmbeddings(batch);

        const ids = [];
        const documents = [];
        const metadatas = [];

        for (let i = 0; i < batch.length; i++) {
          const chunkIndex = start + i;

          ids.push(generateChunkId(repoId, file.relativePath, chunkIndex));
          documents.push(batch[i]);

          metadatas.push({
            repoId,
            filePath: file.relativePath,
            language: getLanguage(file.relativePath),
            chunkIndex,
          });
        }

        await collection.add({
          ids,
          documents,
          embeddings,
          metadatas,
        });

        totalChunks += batch.length;
      }

      filesProcessed++;
      const progress = Math.round((filesProcessed / totalFiles) * 100);
      await Repository.findOneAndUpdate(
        { repoId },
        {
          filesProcessed,
          progress,
          currentFile: file.relativePath,
        },
      );
    }

    // 10. Cleanup extracted repository

    console.log("\n==============================");

    console.log("INGESTION LOOP COMPLETE");

    console.log("Repository:", repoId);

    console.log("Files processed:", filesProcessed);

    console.log("Total chunks:", totalChunks);

    console.log("==============================");
    console.log("Updating repository status to READY...");

    await Repository.findOneAndUpdate(
      { repoId },
      {
        status: "ready",
        filesProcessed,
        totalChunks,
        lastIngestedAt: new Date(),
        progress: 100,
        currentFile: null,
      },
    );
    console.log("Repository status updated to READY");
    return {
      repoId,
      filesProcessed,
      totalChunks,
    };
  } catch (error) {
    console.error("INGESTION FAILED:");
    console.error(error);

    await Repository.findOneAndUpdate(
      { repoId },
      {
        status: "failed",
      },
    );

    throw error;
  } finally {
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, {
        recursive: true,
        force: true,
      });
    }

    console.log("Temporary repository files cleaned up.");
  }
}
