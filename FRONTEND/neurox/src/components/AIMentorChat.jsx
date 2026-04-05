import React, { useState, useRef, useEffect } from "react";
import { chatAPI } from "../services/testService";

export default function AIMentorChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Mentor. Ask me anything about your learning path 🚀" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await chatAPI.sendMessage(input);
      setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "I'm having trouble connecting right now. Try again shortly!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600
                   rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center text-white text-xl
                   hover:scale-110 hover:shadow-blue-500/60 transition-all duration-300 z-50 border border-white/10"
        title="AI Mentor"
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-[#0F172A]/95 backdrop-blur-xl rounded-2xl
                        shadow-2xl shadow-blue-500/20 border border-white/10 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 px-4 py-3 flex items-center gap-3 border-b border-white/10">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-semibold text-sm">AI Mentor</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-blue-200 text-xs">Online · Always here</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                    : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-400 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  AI is thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-3 flex gap-2">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white
                         placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              placeholder="Ask your mentor..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm
                         hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
