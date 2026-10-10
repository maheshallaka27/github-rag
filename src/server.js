import express from "express";
import "dotenv/config";
import chatRoutes from "./routes/chatRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import { connectMongoDB } from "./config/mongodb.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.use("/api/repositories", repositoryRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "GitHub RAG API is running",
  });
});
await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
