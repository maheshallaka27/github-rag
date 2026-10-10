export function chunkCode(code, maxLines = 80, overlapLines = 10) {
  const lines = code.split("\n");

  const chunks = [];

  let start = 0;

  while (start < lines.length) {
    const end = Math.min(start + maxLines, lines.length);

    const chunk = lines.slice(start, end).join("\n");

    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }

    if (end === lines.length) {
      break;
    }

    start = end - overlapLines;
  }

  return chunks;
}
