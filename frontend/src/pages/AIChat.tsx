import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Send, Sparkles, Trash2, User, Wifi } from "lucide-react";

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/.netlify/functions/chat";
const STORAGE_KEY = "nexus_general_chat_v1";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: number;
}

const STARTERS = [
  "Explain quantum computing in simple terms",
  "Write a Python script that renames files in a folder",
  "Help me draft a polite follow-up email",
  "Give me a 3-day travel plan for Japan",
];

const loadMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
      .slice(-40);
  } catch {
    return [];
  }
};

const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // Storage may be unavailable in private mode.
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || isTyping) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-u`,
      role: "user",
      text: message,
      at: Date.now(),
    };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setError("");
    setIsTyping(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: "general",
          message,
          history: history
            .filter((m) => m.role !== "assistant" || !m.text.startsWith("⚠"))
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 429) {
          const wait = Number(data?.retryAfter) || 45;
          throw new Error(`The assistant is taking a short break — try again in ${Math.ceil(wait)}s.`);
        }
        throw new Error(data?.error || "The assistant is unavailable right now.");
      }

      const reply = typeof data?.reply === "string" ? data.reply.trim().slice(0, 5000) : "";
      if (!reply) throw new Error("The assistant returned an empty answer. Please try again.");

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", text: reply, at: Date.now() },
      ]);
    } catch (err: any) {
      const detail = err?.name === "AbortError" ? "The request timed out. Please try again." : err?.message || "Something went wrong.";
      setError(detail);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-e`, role: "assistant", text: `⚠ ${detail}`, at: Date.now() },
      ]);
    } finally {
      window.clearTimeout(timeout);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen pt-28 pb-10 px-4 sm:px-6 bg-black relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter font-display">
                NEXUS<span className="text-indigo-500">.AI</span>
              </h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <Wifi size={10} className="text-emerald-500" /> General-purpose assistant · ask me anything
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              title="Clear conversation"
              aria-label="Clear conversation"
              className="p-3 rounded-xl glass text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <Trash2 size={16} />
            </button>
            <Link
              to="/"
              className="p-3 rounded-xl glass text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
              title="Back to portfolio"
              aria-label="Back to portfolio"
            >
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>

        {/* Chat window */}
        <div className="glass rounded-[2rem] border border-white/10 flex-1 min-h-[55vh] max-h-[70vh] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 no-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-10">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="text-indigo-400" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">How can I help?</h2>
                  <p className="text-zinc-500 text-xs mt-2 max-w-sm leading-relaxed">
                    Ask questions, write and debug code, draft text, brainstorm ideas — this assistant is not limited to the portfolio.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {STARTERS.map((starter) => (
                    <button
                      key={starter}
                      onClick={() => send(starter)}
                      className="text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-bold hover:bg-indigo-600/10 hover:border-indigo-500/30 hover:text-white transition-all"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={15} className="text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : message.text.startsWith("⚠")
                        ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md"
                        : "bg-white/5 border border-white/10 text-zinc-300 rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                    <User size={15} className="text-zinc-400" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Bot size={15} className="text-indigo-400" />
                </div>
                <div className="flex gap-1.5 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask anything… (Enter to send, Shift+Enter for a new line)"
                aria-label="Message"
                className="flex-1 resize-none max-h-32 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 transition-colors no-scrollbar"
              />
              <button
                onClick={() => void send(input)}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-indigo-600"
              >
                <Send size={18} />
              </button>
            </div>
            {error && <p className="text-[10px] text-red-400 mt-2 px-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
