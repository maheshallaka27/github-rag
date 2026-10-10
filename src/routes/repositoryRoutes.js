import express from "express";
import { ingestRepository } from "../services/ingestion.js";
import Repository from "../models/Repository.js";
import { deleteRepository } from "../services/repository.js";
import rateLimiter from "../middleware/rateLimiter.js";
const router = express.Router();
import client from "../config/chroma.js";
router.post("/ingest", rateLimiter(3, 60 * 1000), async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        error: "repoUrl is required",
      });
    }

    // Start ingestion without waiting for completion
    ingestRepository(repoUrl).catch((error) => {
      console.error("BACKGROUND INGESTION ERROR:");
      console.error(error);
    });

    res.status(202).json({
      message: "Repository ingestion started",
    });
  } catch (error) {
    console.error("INGEST ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const repositories = await Repository.find().sort({ createdAt: -1 });

    res.json(repositories);
  } catch (error) {
    console.error("GET REPOSITORIES ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/:repoId/files", async (req, res) => {
  try {
    const repoId = req.params.repoId;

    const repository = await Repository.findOne({
      repoId,
    });

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    const collection = await client.getOrCreateCollection({
      name: "github_code",
      embeddingFunction: null,
    });

    const results = await collection.get({
      where: {
        repoId: repoId,
      },
      include: ["metadatas"],
    });

    const files = [
      ...new Set(
        (results.metadatas || [])
          .map((metadata) => metadata.filePath)
          .filter(Boolean),
      ),
    ].sort();

    res.json(files);
  } catch (error) {
    console.error("GET REPOSITORY FILES ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/:repoId", async (req, res) => {
  try {
    const repoId = req.params.repoId;

    const repository = await Repository.findOne({
      repoId,
    });

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    res.json(repository);
  } catch (error) {
    console.error("GET REPOSITORY ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
router.delete("/:repoId", async (req, res) => {
  try {
    const repoId = req.params.repoId;

    const repository = await Repository.findOne({
      repoId,
    });

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    const deletedChunks = await deleteRepository(repoId);

    await Repository.deleteOne({
      repoId,
    });

    res.json({
      message: "Repository deleted successfully",
      repoId,
      deletedChunks,
    });
  } catch (error) {
    console.error("DELETE REPOSITORY ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
