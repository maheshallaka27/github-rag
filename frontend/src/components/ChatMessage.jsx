import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SourceCard from "./SourceCard";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] ${
          isUser ? "bg-white text-black px-4 py-3" : "text-[#ccc]"
        }`}
      >
        {isUser ? (
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div className="text-sm leading-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const code = String(children).replace(/\n$/, "");

                  if (inline) {
                    return (
                      <code
                        className="bg-[#181818] px-1.5 py-0.5 text-xs font-mono text-white"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="my-3 border border-[#222] bg-[#080808]">
                      <div className="flex items-center justify-between border-b border-[#222] px-3 py-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#555]">
                          Code
                        </span>

                        <button
                          onClick={() => copyCode(code)}
                          className="text-[10px] text-[#555] hover:text-white"
                        >
                          Copy
                        </button>
                      </div>

                      <pre className="overflow-x-auto p-3 text-xs">
                        <code
                          className={`font-mono ${className || ""}`}
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },

                p({ children }) {
                  return <p className="mb-3 last:mb-0">{children}</p>;
                },

                ul({ children }) {
                  return <ul className="mb-3 ml-5 list-disc">{children}</ul>;
                },

                ol({ children }) {
                  return <ol className="mb-3 ml-5 list-decimal">{children}</ol>;
                },

                h1({ children }) {
                  return (
                    <h1 className="mb-3 text-lg font-semibold text-white">
                      {children}
                    </h1>
                  );
                },

                h2({ children }) {
                  return (
                    <h2 className="mb-3 text-base font-semibold text-white">
                      {children}
                    </h2>
                  );
                },

                h3({ children }) {
                  return (
                    <h3 className="mb-2 text-sm font-semibold text-white">
                      {children}
                    </h3>
                  );
                },

                blockquote({ children }) {
                  return (
                    <blockquote className="my-3 border-l border-[#444] pl-3 text-[#888]">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.sources?.length > 0 && (
              <div className="mt-4">
                {message.sources.map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
