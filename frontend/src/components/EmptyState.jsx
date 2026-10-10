function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#050505]">
      <div className="w-full max-w-3xl px-8">
        <div className="mb-12">
          <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[#555]">
            CODELENS
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Understand any codebase.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#666]">
            An AI-powered GitHub codebase assistant for exploring,
            understanding, and debugging repositories using natural language.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-[#222]">
          <div className="border-r border-[#222] p-5">
            <div className="mb-3 text-[10px] uppercase tracking-wider text-[#555]">
              Retrieval
            </div>

            <div className="text-sm text-white">Repository-aware search</div>

            <p className="mt-2 text-xs leading-5 text-[#555]">
              Finds relevant code using semantic retrieval.
            </p>
          </div>

          <div className="border-r border-[#222] p-5">
            <div className="mb-3 text-[10px] uppercase tracking-wider text-[#555]">
              Local AI
            </div>

            <div className="text-sm text-white">Ollama</div>

            <p className="mt-2 text-xs leading-5 text-[#555]">
              Uses a local model for suitable queries.
            </p>
          </div>

          <div className="p-5">
            <div className="mb-3 text-[10px] uppercase tracking-wider text-[#555]">
              Cloud AI
            </div>

            <div className="text-sm text-white">Gemini</div>

            <p className="mt-2 text-xs leading-5 text-[#555]">
              Escalates complex questions when needed.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#444]">
          <span className="h-px w-8 bg-[#333]" />
          Add a repository from the sidebar to begin
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
