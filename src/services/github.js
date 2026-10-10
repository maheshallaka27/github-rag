import axios from "axios";
import "dotenv/config";
const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

export async function getRepositoryFiles(repoUrl) {
  const url = new URL(repoUrl);

  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = parts[0];
  const repo = parts[1];

  const response = await githubApi.get(
    `/repos/${owner}/${repo}/git/trees/HEAD`,
    {
      params: {
        recursive: 1,
      },
    },
  );

  return {
    owner,
    repo,
    files: response.data.tree,
  };
}

export async function getFileContent(owner, repo, filePath) {
  const response = await githubApi.get(
    `/repos/${owner}/${repo}/contents/${filePath}`,
  );

  if (response.data.type !== "file") {
    throw new Error(`${filePath} is not a file`);
  }

  const content = Buffer.from(response.data.content, "base64").toString(
    "utf-8",
  );

  return content;
}
