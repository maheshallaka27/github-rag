function AddRepository({ repoUrl, setRepoUrl, ingestRepository, ingesting }) {
  return (
    <div className="p-4 border-b border-[#222]">
      <p className="text-xs font-medium text-[#777] uppercase tracking-wider mb-2">
        Repository
      </p>

      <input
        type="text"
        placeholder="https://github.com/user/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            ingestRepository();
          }
        }}
        className="w-full bg-[#0a0a0a] border border-[#222] rounded-md px-3 py-2.5 text-sm text-white placeholder-[#555] outline-none focus:border-[#555]"
      />

      <button
        onClick={ingestRepository}
        disabled={ingesting || !repoUrl.trim()}
        className="mt-2 w-full bg-white text-black hover:bg-[#ddd] disabled:bg-[#333] disabled:text-[#777] rounded-md py-2.5 text-sm font-medium transition"
      >
        {ingesting ? "Adding..." : "+ Add Repository"}
      </button>
    </div>
  );
}

export default AddRepository;
