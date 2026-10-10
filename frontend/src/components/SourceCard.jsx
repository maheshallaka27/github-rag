function SourceCard({ source }) {
  return (
    <div className="mt-3 border border-[#222] bg-[#0a0a0a] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[#555] mb-2">
        Source
      </div>

      <div className="text-xs text-[#ccc] font-mono break-all">
        {source.filePath}
      </div>

      <div className="mt-2 flex gap-4 text-[10px] text-[#555]">
        <span>Chunk: {source.chunkIndex}</span>
        <span>
          Relevance:{" "}
          {source.relevance !== undefined ? source.relevance.toFixed(3) : "N/A"}
        </span>
      </div>
    </div>
  );
}

export default SourceCard;
