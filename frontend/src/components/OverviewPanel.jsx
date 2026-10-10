function OverviewPanel({ selectedRepo, askRepositoryOverview, loading }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl p-8">
        {/* Repository information */}
        <div className="mb-8">
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#555]">
            Repository Overview
          </div>

          <h2 className="text-2xl font-semibold text-white">
            {selectedRepo?.name || selectedRepo?.repoId}
          </h2>

          <p className="mt-2 font-mono text-xs text-[#555]">
            {selectedRepo?.repoId}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 border border-[#222]">
          <div className="border-r border-[#222] p-5">
            <div className="text-[10px] uppercase tracking-wider text-[#555]">
              Files
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {selectedRepo?.filesProcessed ?? 0}
            </div>
          </div>

          <div className="border-r border-[#222] p-5">
            <div className="text-[10px] uppercase tracking-wider text-[#555]">
              Chunks
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {selectedRepo?.totalChunks ?? 0}
            </div>
          </div>

          <div className="p-5">
            <div className="text-[10px] uppercase tracking-wider text-[#555]">
              Status
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white">
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedRepo?.status === "ready" ? "bg-white" : "bg-[#555]"
                }`}
              />
              {selectedRepo?.status || "unknown"}
            </div>
          </div>
        </div>

        {/* AI overview */}
        <div className="border border-[#222] bg-[#080808]">
          <div className="flex items-center justify-between border-b border-[#222] px-5 py-4">
            <div>
              <div className="text-xs font-medium text-white">
                AI Repository Analysis
              </div>

              <div className="mt-1 text-[10px] text-[#555]">
                Generate an architectural overview using CodeLens.
              </div>
            </div>

            <button
              onClick={askRepositoryOverview}
              disabled={loading || selectedRepo?.status !== "ready"}
              className="bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-[#ddd] disabled:cursor-not-allowed disabled:bg-[#222] disabled:text-[#555]"
            >
              {loading ? "Analyzing..." : "Analyze Repository"}
            </button>
          </div>

          <div className="p-5 text-sm leading-6 text-[#666]">
            Switch to the Chat tab after running the analysis to view the
            generated repository overview.
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPanel;
