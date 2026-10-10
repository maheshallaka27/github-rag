import express from "express";
import { answerQuestion } from "../services/rag.js";
import Repository from "../models/Repository.js";
import rateLimiter from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/", rateLimiter(10, 60 * 1000), async (req, res) => {
  try {
    const { repoId, question, language, history, filePath } = req.body;

    if (!repoId) {
      return res.status(400).json({
        error: "repoId is required",
      });
    }

    if (!question) {
      return res.status(400).json({
        error: "question is required",
      });
    }
    const repository = await Repository.findOne({
      repoId,
    });

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    if (repository.status !== "ready") {
      return res.status(400).json({
        error: `Repository is not ready. Current status: ${repository.status}`,
      });
    }
    const result = await answerQuestion(
      question,
      repoId,
      language,
      history || [],
      filePath || null,
    );

    res.json(result);
  } catch (error) {
    console.error("CHAT ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
