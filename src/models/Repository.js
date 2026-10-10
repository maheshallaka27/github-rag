import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    repoId: {
      type: String,
      required: true,
      unique: true,
    },

    repoUrl: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "ingesting", "ready", "failed"],
      default: "pending",
    },

    filesProcessed: {
      type: Number,
      default: 0,
    },

    totalChunks: {
      type: Number,
      default: 0,
    },
    currentFile: {
      type: String,
      default: null,
    },

    progress: {
      type: Number,
      default: 0,
    },
    lastIngestedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Repository", repositorySchema);
