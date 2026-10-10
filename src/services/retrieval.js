import client from "../config/chroma.js";
import { createEmbedding } from "./embedding.js";

export async function searchRepository(
  question,
  repoId,
  limit = 5,
  language = null,
  filePath = null,
  maxDistance = 1.2,
) {
  // 1. Get collection
  const collection = await client.getOrCreateCollection({
    name: "github_code",
    embeddingFunction: null,
  });

  // 2. Convert question into embedding
  const queryEmbedding = await createEmbedding(question);

  // 3. Build metadata filter

  const filters = [
    {
      repoId: repoId,
    },
  ];

  if (language) {
    filters.push({
      language: language,
    });
  }

  if (filePath) {
    filters.push({
      filePath: filePath,
    });
  }

  let where;

  if (filters.length === 1) {
    where = filters[0];
  } else {
    where = {
      $and: filters,
    };
  }

  // 4. Search Chroma
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit,
    where,
  });
  console.log("Distances:", results.distances?.[0]);
  console.log("Files:", results.metadatas?.[0]);
  if (!results.documents?.[0] || results.documents[0].length === 0) {
    return {
      answer:
        "I could not find enough relevant information in this repository to answer the question.",
      sources: [],
    };
  }
  // 5. Return clean results
  const documents = results.documents?.[0] || [];
  const metadatas = results.metadatas?.[0] || [];
  const distances = results.distances?.[0] || [];
  console.log("RAW DISTANCES:", distances);
  return documents
    .map((document, index) => ({
      document,
      filePath: metadatas[index]?.filePath,
      language: metadatas[index]?.language,
      chunkIndex: metadatas[index]?.chunkIndex,
      distance: distances[index],
      relevance: Math.max(0, 1 - distances[index]),
    }))
    .filter(
      (result) =>
        result.distance !== undefined && result.distance <= maxDistance,
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}
