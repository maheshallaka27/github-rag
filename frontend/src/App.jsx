import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Sidebar from "./components/Sidebar";
import RepoHeader from "./components/RepoHeader";
import Tabs from "./components/Tabs";
import ChatPanel from "./components/ChatPanel";
import ChatInput from "./components/ChatInput";
import FileExplorer from "./components/FileExplorer";
import OverviewPanel from "./components/OverviewPanel";
import DeleteRepositoryModal from "./components/DeleteRepositoryModal";
import EmptyState from "./components/EmptyState";
const API_URL = "http://localhost:5000";

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [repoUrl, setRepoUrl] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileSearch, setFileSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [deleteRepo, setDeleteRepo] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // -----------------------------
  // Load repositories
  // -----------------------------
  const loadFiles = async (repoId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/repositories/${encodeURIComponent(repoId)}/files`,
      );

      setFiles(response.data);
    } catch (error) {
      console.error("Failed to load repository files:", error);

      setFiles([]);
    }
  };
  const loadRepositories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/repositories`);

      setRepositories(response.data);
    } catch (error) {
      console.error("Failed to load repositories:", error);
    }
  };
  const deleteRepository = async () => {
    if (!deleteRepo) {
      return;
    }

    try {
      setDeleting(true);

      await axios.delete(
        `${API_URL}/api/repositories/${encodeURIComponent(deleteRepo.repoId)}`,
      );

      // Close modal
      setDeleteRepo(null);

      // If the deleted repo was selected, clear the workspace
      if (selectedRepo?.repoId === deleteRepo.repoId) {
        setSelectedRepo(null);
        setMessages([]);
        setFiles([]);
        setFilePath("");
        setFileSearch("");
      }

      // Refresh repository list
      await loadRepositories();
    } catch (error) {
      console.error("Failed to delete repository:", error);

      alert(error.response?.data?.error || "Failed to delete repository.");
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    loadRepositories();
  }, []);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/repositories`);

        const repos = response.data;

        setRepositories(repos);

        // Update selected repository
        if (selectedRepo) {
          const updatedRepo = repos.find(
            (repo) => repo.repoId === selectedRepo.repoId,
          );

          if (updatedRepo) {
            setSelectedRepo(updatedRepo);
          }
        }

        // Check if any repository is still ingesting
        const isIngesting = repos.some((repo) => repo.status === "ingesting");

        setIngesting(isIngesting);
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedRepo]);

  // -----------------------------
  // Add repository
  // -----------------------------
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(fileSearch.toLowerCase()),
  );
  const explainFile = async () => {
    if (!selectedRepo || !filePath.trim() || loading) {
      return;
    }

    const selectedFile = filePath.trim();

    const userQuestion = `Explain the file ${selectedFile} and describe its main logic.`;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/chat`, {
        repoId: selectedRepo.repoId,
        question: userQuestion,
        filePath: selectedFile,
        history: messages,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
        },
      ]);

      setFilePath("");
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: error.response?.data?.error || "Failed to explain the file.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const ingestRepository = async () => {
    if (!repoUrl.trim()) {
      return;
    }

    try {
      setIngesting(true);

      await axios.post(`${API_URL}/api/repositories/ingest`, {
        repoUrl,
      });

      setRepoUrl("");

      // Immediately load the new repository
      await loadRepositories();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.error || "Failed to ingest repository");

      setIngesting(false);
    }
  };
  // -----------------------------
  // Ask question
  // -----------------------------
  const askRepositoryOverview = async () => {
    if (!selectedRepo || loading) {
      return;
    }

    const userQuestion =
      "Give me a concise overview of this repository, including its purpose, main technologies, important files, and architecture.";

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/chat`, {
        repoId: selectedRepo.repoId,
        question: userQuestion,
        history: messages,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: error.response?.data?.error || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const clearChat = () => {
    setMessages([]);
  };
  const askQuestion = async () => {
    if (!question.trim() || !selectedRepo || loading) {
      return;
    }

    const userQuestion = question;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/chat`, {
        repoId: selectedRepo.repoId,
        question: userQuestion,
        history: messages,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: error.response?.data?.error || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#050505] text-white flex">
      {/* ================= SIDEBAR ================= */}

      <Sidebar
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        repositories={repositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        setMessages={setMessages}
        setFilePath={setFilePath}
        setFileSearch={setFileSearch}
        loadFiles={loadFiles}
        ingestRepository={ingestRepository}
        ingesting={ingesting}
        setDeleteRepo={setDeleteRepo}
      />

      {/* ================= MAIN ================= */}

      <main className="flex-1 flex flex-col">
        {!selectedRepo ? (
          /* Welcome */

          <EmptyState />
        ) : (
          /* Chat */

          <>
            {/* Header */}

            <RepoHeader selectedRepo={selectedRepo} />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab Content */}

            {activeTab === "chat" && (
              <>
                <ChatPanel messages={messages} loading={loading} />

                <ChatInput
                  question={question}
                  setQuestion={setQuestion}
                  askQuestion={askQuestion}
                  askRepositoryOverview={askRepositoryOverview}
                  clearChat={clearChat}
                  loading={loading}
                  selectedRepo={selectedRepo}
                />
              </>
            )}

            {activeTab === "files" && (
              <FileExplorer
                files={files}
                fileSearch={fileSearch}
                setFileSearch={setFileSearch}
                filePath={filePath}
                setFilePath={setFilePath}
                explainFile={explainFile}
                loading={loading}
              />
            )}

            {activeTab === "overview" && (
              <OverviewPanel
                selectedRepo={selectedRepo}
                askRepositoryOverview={askRepositoryOverview}
                loading={loading}
              />
            )}
          </>
        )}
      </main>
      {deleteRepo && (
        <DeleteRepositoryModal
          repo={deleteRepo}
          onCancel={() => setDeleteRepo(null)}
          onConfirm={deleteRepository}
          deleting={deleting}
        />
      )}
    </div>
  );
}

export default App;
