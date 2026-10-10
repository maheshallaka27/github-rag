import axios from "axios";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";

export async function downloadRepository(repoUrl) {
  const url = new URL(repoUrl);

  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = parts[0];
  const repo = parts[1].replace(".git", "");

  const repoId = `${owner}/${repo}`;

  console.log("Downloading:", repoId);

  const archiveUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

  const response = await axios.get(archiveUrl, {
    responseType: "stream",
    maxRedirects: 5,
  });

  const extractPath = path.join(process.cwd(), "tmp", `${owner}-${repo}`);

  fs.mkdirSync(extractPath, { recursive: true });

  await new Promise((resolve, reject) => {
    response.data
      .pipe(
        unzipper.Extract({
          path: extractPath,
        }),
      )
      .on("close", resolve)
      .on("error", reject);
  });

  console.log("Repository extracted to:", extractPath);

  return {
    owner,
    repo,
    repoId,
    extractPath,
  };
}
