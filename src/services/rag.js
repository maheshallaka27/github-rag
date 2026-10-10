import { searchRepository } from "./retrieval.js";
import { generateAnswer } from "./llm/llm.js";
import { chooseModel } from "./llm/llmRouter.js";
import { shouldEscalate } from "./llm/verifyAnswer.js";
export async function answerQuestion(
  question,
  repoId,
  language = null,
  history = [],
  filePath = null,
) {
  // 1. Retrieve relevant code
  const results = await searchRepository(
    question,
    repoId,
    5,
    language,
    filePath,
  );
  const bestRelevance = results.length > 0 ? results[0].relevance : 0;

  const averageRelevance =
    results.length > 0
      ? results.reduce((sum, result) => sum + result.relevance, 0) /
        results.length
      : 0;

  // 2. Build context
  const context = results
    .map((result, index) => {
      return `
SOURCE ${index + 1}
FILE: ${result.filePath}
LANGUAGE: ${result.language}
CHUNK: ${result.chunkIndex}

${result.document}
`;
    })
    .join("\n");
  const conversationHistory = history
    .slice(-6)
    .map((message) => {
      return `${message.role.toUpperCase()}: ${message.content}`;
    })
    .join("\n");
  // 3. Build prompt
  const prompt = `
You are an AI assistant that understands GitHub repositories.

Answer the user's question using ONLY the provided repository context.

If the context does not contain enough information,
say that you could not find enough relevant code.

Do not invent files, functions, classes, or behavior.

Always mention the relevant file paths in your answer.

USER QUESTION:
${question}

CONVERSATION HISTORY:
${conversationHistory}

REPOSITORY:
${repoId}

REPOSITORY CONTEXT:
${context}

ANSWER:
`;

  let modelType = chooseModel(question, results);

  console.log("Selected model:", modelType);

  let answer = await generateAnswer(prompt, modelType);

  // If local model gives a weak answer, escalate to cloud
  if (modelType === "local") {
    const escalate = shouldEscalate(answer, results);

    console.log("Escalate:", escalate);

    if (escalate) {
      console.log("Escalating from Ollama → Gemini");

      modelType = "cloud";
      answer = await generateAnswer(prompt, modelType);
    }
  }
  return {
    answer,
    modelType,
    sources: results.map((result) => ({
      filePath: result.filePath,
      language: result.language,
      chunkIndex: result.chunkIndex,
    })),
  };
}
