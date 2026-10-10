import { generateWithOllama } from "./ollama.js";
import { generateWithCloud } from "./cloud.js";

export async function generateAnswer(prompt, modelType = "local") {
  if (modelType === "local") {
    return await generateWithOllama(prompt);
  }

  if (modelType === "cloud") {
    return await generateWithCloud(prompt);
  }

  throw new Error(`Unknown model type: ${modelType}`);
}
