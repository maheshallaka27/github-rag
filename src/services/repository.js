import client from "../config/chroma.js";

export async function deleteRepository(repoId) {
  const collection = await client.getOrCreateCollection({
    name: "github_code",
    embeddingFunction: null,
  });

  const results = await collection.get({
    where: {
      repoId: repoId,
    },
  });

  const ids = results.ids || [];

  if (ids.length === 0) {
    return 0;
  }

  await collection.delete({
    ids,
  });

  return ids.length;
}
