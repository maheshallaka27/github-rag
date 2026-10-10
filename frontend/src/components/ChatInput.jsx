function ChatInput({
  question,
  setQuestion,
  askQuestion,
  askRepositoryOverview,
  clearChat,
  loading,
  selectedRepo,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (question.trim() && !loading) {
        askQuestion();
      }
    }
  };

  return (
    <div className="border-t border-[#222] px-8 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="border border-[#222] bg-[#080808]">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedRepo
                ? "Ask about this repository..."
                : "Select a repository first..."
            }
            disabled={!selectedRepo || loading}
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#444] disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between border-t border-[#222] px-3 py-2">
            <div className="flex gap-2">
              <button
                onClick={askRepositoryOverview}
                disabled={!selectedRepo || loading}
                className="border border-[#222] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#777] transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Overview
              </button>

              <button
                onClick={clearChat}
                disabled={!selectedRepo || loading}
                className="border border-[#222] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#777] transition hover:border-[#444] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Clear
              </button>
            </div>

            <button
              onClick={askQuestion}
              disabled={!selectedRepo || !question.trim() || loading}
              className="bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-[#ddd] disabled:cursor-not-allowed disabled:bg-[#222] disabled:text-[#555]"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>

        <div className="mt-2 text-center text-[10px] text-[#444]">
          Enter to send · Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
