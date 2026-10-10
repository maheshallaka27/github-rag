import ChatMessage from "./ChatMessage";

function ChatPanel({ messages, loading }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[#444]">
              CODELENS
            </div>

            <p className="text-sm text-[#555]">
              Ask anything about this repository.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              <span>Analyzing codebase...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatPanel;
