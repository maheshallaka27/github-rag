import RepositoryList from "./RepositoryList";
import AddRepository from "./AddRepository";
function Sidebar({
  repoUrl,
  setRepoUrl,
  repositories,
  setDeleteRepo,
  selectedRepo,
  setSelectedRepo,
  setMessages,
  setFilePath,
  setFileSearch,
  loadFiles,
  ingestRepository,
  ingesting,
}) {
  return (
    <aside className="w-72 shrink-0 border-r border-[#222] bg-[#050505] text-white flex flex-col">
      {/* Logo */}
      <div className="shrink-0 border-b border-[#222] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-white" />

          <span className="text-lg font-semibold tracking-[0.18em] text-white">
            CODELENS
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-[#666]">
          AI-powered codebase assistant
        </p>
      </div>

      {/* Add Repository */}
      <AddRepository
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        ingestRepository={ingestRepository}
        ingesting={ingesting}
      />

      {/* Repository List */}
      <RepositoryList
        repositories={repositories}
        setDeleteRepo={setDeleteRepo}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        setMessages={setMessages}
        setFilePath={setFilePath}
        setFileSearch={setFileSearch}
        loadFiles={loadFiles}
      />
    </aside>
  );
}

export default Sidebar;
