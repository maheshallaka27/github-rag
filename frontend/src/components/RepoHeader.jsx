function RepoHeader({ selectedRepo }) {
  return (
    <div className="h-14 shrink-0 border-b border-[#222] bg-[#050505] px-6">
      <div className="flex h-full items-center justify-between">
        {/* Repository identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-2 w-2 shrink-0 rounded-full bg-white" />

          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">
              {selectedRepo?.name || selectedRepo?.repoId}
            </div>

            <div className="truncate font-mono text-[10px] text-[#555]">
              {selectedRepo?.repoId}
            </div>
          </div>
        </div>

        {/* Repository stats */}
        <div className="flex shrink-0 items-center gap-6 text-[10px] uppercase tracking-wider">
          <div className="text-[#555]">
            <span className="text-[#888]">
              {selectedRepo?.filesProcessed ?? 0}
            </span>{" "}
            files
          </div>

          <div className="text-[#555]">
            <span className="text-[#888]">
              {selectedRepo?.totalChunks ?? 0}
            </span>{" "}
            chunks
          </div>

          <div className="flex items-center gap-2 text-[#555]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {selectedRepo?.status || "unknown"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoHeader;
