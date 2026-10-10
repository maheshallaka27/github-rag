import { useEffect, useRef, useState } from "react";
function RepositoryCard({
  repo,
  selectedRepo,
  setDeleteRepo,
  setSelectedRepo,
  setMessages,
  setFilePath,
  setFileSearch,
  loadFiles,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSelect = () => {
    setSelectedRepo(repo);
    setMessages([]);
    setFilePath("");
    setFileSearch("");
    loadFiles(repo.repoId);
  };

  const isSelected = selectedRepo?.repoId === repo.repoId;

  return (
    <div
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleSelect();
        }
      }}
      className={`group relative w-full border-b border-[#181818] px-5 py-4 text-left transition ${
        selectedRepo?.repoId === repo.repoId
          ? "bg-[#111111]"
          : "bg-[#050505] hover:bg-[#0c0c0c]"
      }`}
    >
      {/* Selected indicator */}
      {selectedRepo?.repoId === repo.repoId && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
      )}

      {/* Repository name + status + menu */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              repo.status === "ready"
                ? "bg-white"
                : repo.status === "failed"
                  ? "bg-[#555]"
                  : "bg-[#333]"
            }`}
          />

          <span className="truncate text-sm font-medium text-white">
            {repo.name || repo.repoId}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[9px] uppercase tracking-wider text-[#555]">
            {repo.status}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="flex h-6 w-6 items-center justify-center text-[#555] transition hover:bg-[#222] hover:text-white"
            title="Repository options"
          >
            ⋮
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-11 z-50 w-40 border border-[#333] bg-[#0a0a0a] py-1 shadow-xl"
        >
          <button
            className="w-full px-3 py-2 text-left text-xs text-[#aaa] hover:bg-[#181818] hover:text-white"
            onClick={() => {
              setMenuOpen(false);
              handleSelect();
            }}
          >
            Open repository
          </button>
          <button
            className="w-full px-3 py-2 text-left text-xs text-[#aaa] hover:bg-[#181818] hover:text-white"
            onClick={() => {
              setMenuOpen(false);
              setDeleteRepo(repo);
            }}
          >
            Delete repository
          </button>
        </div>
      )}
      {/* Repository ID */}
      <div className="mt-2 truncate pl-3.5 font-mono text-[10px] text-[#555]">
        {repo.repoId}
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 pl-3.5 text-[10px] text-[#555]">
        <span>
          <span className="text-[#888]">{repo.filesProcessed ?? 0}</span> files
        </span>

        <span>
          <span className="text-[#888]">{repo.totalChunks ?? 0}</span> chunks
        </span>
      </div>

      {/* Progress */}
      {repo.status === "processing" && (
        <div className="mt-3 pl-3.5">
          <div className="mb-1 flex justify-between text-[9px] text-[#555]">
            <span className="truncate">
              {repo.currentFile || "Processing..."}
            </span>

            <span>{repo.progress ?? 0}%</span>
          </div>

          <div className="h-px w-full bg-[#222]">
            <div
              className="h-px bg-white transition-all"
              style={{
                width: `${repo.progress ?? 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Failed */}
      {repo.status === "failed" && (
        <div className="mt-2 pl-3.5 text-[10px] text-[#666]">
          Ingestion failed
        </div>
      )}
    </div>
  );
}

export default RepositoryCard;
