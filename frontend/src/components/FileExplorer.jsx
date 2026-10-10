function FileExplorer({
  files,
  fileSearch,
  setFileSearch,
  filePath,
  setFilePath,
  explainFile,
  loading,
}) {
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(fileSearch.toLowerCase()),
  );

  return (
    <div className="flex h-full min-h-0">
      {/* File list */}
      <div className="w-80 shrink-0 border-r border-[#222] bg-[#050505]">
        <div className="border-b border-[#222] p-4">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-[#555]">
            Files
          </div>

          <input
            type="text"
            value={fileSearch}
            onChange={(e) => setFileSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full border border-[#222] bg-[#0a0a0a] px-3 py-2 text-xs text-white outline-none placeholder:text-[#444] focus:border-[#444]"
          />
        </div>

        <div className="h-[calc(100%-89px)] overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="p-4 text-xs text-[#555]">No files found.</div>
          ) : (
            filteredFiles.map((file) => {
              const isSelected = filePath === file;

              return (
                <button
                  key={file}
                  onClick={() => setFilePath(file)}
                  className={`block w-full border-b border-[#151515] px-4 py-3 text-left transition ${
                    isSelected
                      ? "bg-[#151515] text-white"
                      : "text-[#777] hover:bg-[#0d0d0d] hover:text-[#ccc]"
                  }`}
                >
                  <div className="truncate font-mono text-xs">{file}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* File details */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        {!filePath ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-xs uppercase tracking-wider text-[#444]">
                File Explorer
              </div>

              <p className="text-xs text-[#555]">
                Select a file to analyze it.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between border-b border-[#222] pb-4">
              <div className="min-w-0">
                <div className="mb-1 text-[10px] uppercase tracking-wider text-[#555]">
                  Selected File
                </div>

                <div className="truncate font-mono text-sm text-white">
                  {filePath}
                </div>
              </div>

              <button
                onClick={explainFile}
                disabled={loading}
                className="ml-4 shrink-0 bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-[#ddd] disabled:cursor-not-allowed disabled:bg-[#222] disabled:text-[#555]"
              >
                {loading ? "Analyzing..." : "Explain File"}
              </button>
            </div>

            <div className="border border-[#222] bg-[#080808] p-5">
              <div className="mb-3 text-[10px] uppercase tracking-wider text-[#555]">
                Analysis
              </div>

              <p className="text-sm leading-6 text-[#777]">
                Use <span className="text-white">Explain File</span> to analyze
                this file with the repository context.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileExplorer;
