import axios from "axios";

export async function generateWithOllama(prompt) {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3.1:8b",
    prompt,
    stream: false,
  });

  return response.data.response;
}
