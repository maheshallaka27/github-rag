import RepositoryCard from "./RepositoryCard";

function RepositoryList({
  repositories,
  selectedRepo,
  setDeleteRepo,
  setSelectedRepo,
  setMessages,
  setFilePath,
  setFileSearch,
  loadFiles,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-xs font-medium text-[#777] uppercase tracking-wider">
          Repositories
        </h2>

        <span className="text-xs text-[#555]">{repositories.length}</span>
      </div>

      <div className="space-y-1">
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.repoId}
            repo={repo}
            selectedRepo={selectedRepo}
            setSelectedRepo={setSelectedRepo}
            setMessages={setMessages}
            setFilePath={setFilePath}
            setFileSearch={setFileSearch}
            loadFiles={loadFiles}
            setDeleteRepo={setDeleteRepo}
          />
        ))}
      </div>
    </div>
  );
}

export default RepositoryList;
