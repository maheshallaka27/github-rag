import axios from "axios";

export async function createEmbedding(text) {
  const response = await axios.post("http://localhost:11434/api/embed", {
    model: "nomic-embed-text",
    input: text,
  });

  return response.data.embeddings[0];
}

export async function createEmbeddings(texts) {
  const response = await axios.post("http://localhost:11434/api/embed", {
    model: "nomic-embed-text",
    input: texts,
  });

  return response.data.embeddings;
}
