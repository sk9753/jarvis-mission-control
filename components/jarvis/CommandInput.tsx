"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "jarvis";
  text: string;
  timestamp: Date;
}

interface CommandInputProps {
  onCommand: (command: string) => void;
  messages: Message[];
  isProcessing: boolean;
}

export default function CommandInput({ onCommand, messages, isProcessing }: CommandInputProps) {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onCommand(input.trim());
    setInput("");
    setExpanded(true);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto">
      {/* Message history */}
      <AnimatePresence>
        {expanded && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mb-2 max-h-60 overflow-y-auto rounded-xl bg-black/60 backdrop-blur-xl border border-cyan-900/30"
          >
            <div className="p-3 space-y-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs ${
                      msg.role === "user"
                        ? "bg-cyan-900/30 text-cyan-300"
                        : "bg-[#111] text-[#ccc]"
                    }`}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-left"
                >
                  <span className="inline-block px-3 py-1.5 rounded-lg text-xs bg-[#111] text-cyan-600">
                    <span className="inline-flex gap-1">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                      <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                    </span>
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="px-4 pb-4">
        <div
          className="flex items-center gap-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-cyan-900/30 px-4 py-3 transition-all focus-within:border-cyan-500/50"
          style={{ boxShadow: "0 0 20px rgba(0,212,255,0.05)" }}
        >
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isProcessing ? "bg-amber-400 animate-pulse" : "bg-cyan-500"
            }`}
            style={{ boxShadow: `0 0 6px ${isProcessing ? "#ffaa00" : "#00d4ff"}` }}
          />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Jarvis..."
            disabled={isProcessing}
            className="flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder-[#444] outline-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="text-[10px] tracking-[2px] uppercase font-semibold text-cyan-600 hover:text-cyan-400 disabled:text-[#333] transition-colors"
          >
            Execute
          </button>
        </div>
      </form>

      {/* Toggle chat history */}
      {messages.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -top-8 right-6 text-[10px] text-[#444] hover:text-cyan-600 transition-colors pointer-events-auto"
        >
          {expanded ? "Hide" : "Show"} history ({messages.length})
        </button>
      )}
    </div>
  );
}
