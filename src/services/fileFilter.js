const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".h",
  ".cs",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".html",
  ".css",
  ".scss",
  ".md",
  ".json",
]);

const ignoredDirectories = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  "vendor",
];

export function shouldIncludeFile(filePath) {
  const lowerPath = filePath.toLowerCase();

  for (const directory of ignoredDirectories) {
    if (
      lowerPath.includes(`/${directory}/`) ||
      lowerPath.startsWith(`${directory}/`)
    ) {
      return false;
    }
  }

  const extension = filePath.substring(filePath.lastIndexOf("."));

  return allowedExtensions.has(extension);
}

export function shouldIncludeContent(content) {
  const MAX_FILE_SIZE = 100_000;

  if (!content || content.length === 0) {
    return false;
  }

  if (content.length > MAX_FILE_SIZE) {
    return false;
  }

  return true;
}
