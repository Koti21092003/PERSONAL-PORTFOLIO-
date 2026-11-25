import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useHUDSound } from "../hooks/useHUDSound";
import {
  DEFAULT_KNOWLEDGE,
  QUICK_PROMPTS,
  WELCOME_TEXT,
  answerLocally,
  buildAIContext,
  buildKnowledge,
  type ChatAction,
  type PortfolioKnowledge,
} from "../utils/portfolioChat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
  source?: "local" | "ai";
};

const HISTORY_KEY = "portfolio_chat_history_v2";
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/.netlify/functions/chat";
const AI_ENABLED = import.meta.env.PROD || Boolean(import.meta.env.VITE_CHAT_ENDPOINT);
const KNOWLEDGE_TTL = 5 * 60 * 1000;

let knowledgeCache: { data: PortfolioKnowledge; at: number } | null = null;
let knowledgeRequest: Promise<PortfolioKnowledge> | null = null;

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const welcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  text: WELCOME_TEXT,
});

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    (record.role === "user" || record.role === "assistant") &&
    typeof record.text === "string"
  );
};

const readStoredHistory = (): ChatMessage[] => {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [welcomeMessage()];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [welcomeMessage()];
    const messages = parsed.filter(isChatMessage).slice(-24);
    return messages.length ? messages : [welcomeMessage()];
  } catch {
    return [welcomeMessage()];
  }
};

const readProfile = async (): Promise<Record<string, unknown> | null> => {
  try {
    const snapshot = await getDoc(doc(db, "settings", "profile"));
    return snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const readCollection = async (name: string): Promise<Record<string, unknown>[]> => {
  try {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map((entry) => ({
      id: entry.id,
      ...(entry.data() as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
};

const loadKnowledge = async (): Promise<PortfolioKnowledge> => {
  if (knowledgeCache && Date.now() - knowledgeCache.at < KNOWLEDGE_TTL) {
    return knowledgeCache.data;
  }
  if (knowledgeRequest) return knowledgeRequest;

  knowledgeRequest = (async () => {
    try {
      const [profile, projects, experiences, certificates] = await Promise.all([
        readProfile(),
        readCollection("projects"),
        readCollection("experiences"),
        readCollection("certificates"),
      ]);
      const knowledge = buildKnowledge({ profile, projects, experiences, certificates });
      knowledgeCache = { data: knowledge, at: Date.now() };
      return knowledge;
    } catch {
      return DEFAULT_KNOWLEDGE;
    } finally {
      knowledgeRequest = null;
    }
  })();

  return knowledgeRequest;
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const MessageText = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        const bullet = line.match(/^\s*[-•]\s+(.*)$/);
        if (bullet) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-[2px] text-indigo-400">•</span>
              <span className="flex-1">{renderInline(bullet[1])}</span>
            </div>
          );
        }

        const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/);
        if (numbered) {
          return (
            <div key={index} className="flex gap-2">
              <span className="font-bold text-indigo-400">{numbered[1]}.</span>
              <span className="flex-1">{renderInline(numbered[2])}</span>
            </div>
          );
        }

        if (!line.trim()) return <div key={index} className="h-1" />;
        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
};

let aiRetryAt = 0;

const AI_CACHE_KEY = "portfolio_chat_ai_cache_v1";
const AI_CACHE_LIMIT = 40;

const readAICache = (): Record<string, string> => {
  try {
    const raw = sessionStorage.getItem(AI_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const writeAICache = (cache: Record<string, string>) => {
  try {
    const entries = Object.entries(cache);
    const trimmed = entries.length > AI_CACHE_LIMIT ? entries.slice(-AI_CACHE_LIMIT) : entries;
    sessionStorage.setItem(AI_CACHE_KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch {
    // Ignore storage failures.
  }
};

const normalizeAIKey = (message: string) => message.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 240);

const askAI = async (
  message: string,
  history: ChatMessage[],
  knowledge: PortfolioKnowledge
): Promise<string | null> => {
  if (!AI_ENABLED) return null;

  const cacheKey = normalizeAIKey(message);
  const cache = readAICache();
  if (cache[cacheKey]) return cache[cacheKey];

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 28000);

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        history: history
          .filter((entry) => entry.id !== "welcome")
          .slice(-8)
          .map((entry) => ({ role: entry.role, content: entry.text })),
        context: buildAIContext(knowledge),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        const retryAfter = Number(data?.retryAfter);
        aiRetryAt = Date.now() + (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 45) * 1000;
      }
      return null;
    }

    const data = await response.json();
    const reply = typeof data?.reply === "string" ? data.reply.trim() : "";
    if (!reply) return null;
    const finalReply = reply.slice(0, 4000);

    const nextCache = readAICache();
    nextCache[cacheKey] = finalReply;
    writeAICache(nextCache);

    return finalReply;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};

const aiCooldownSeconds = () => Math.max(0, Math.ceil((aiRetryAt - Date.now()) / 1000));

const PortfolioChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredHistory);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [deepeningId, setDeepeningId] = useState<string | null>(null);
  const { playClick, playHover } = useHUDSound();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef(0);

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    try {
      setHasOpened(localStorage.getItem("portfolio_chat_seen") === "true");
    } catch {
      setHasOpened(true);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-24)));
    } catch {
      // Storage can be unavailable in private mode; chat still works in memory.
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const openChat = () => {
      setIsOpen(true);
      setHasOpened(true);
      try {
        localStorage.setItem("portfolio_chat_seen", "true");
      } catch {
        // Ignore storage failures.
      }
    };
    window.addEventListener("portfolio:open-chat", openChat);
    return () => window.removeEventListener("portfolio:open-chat", openChat);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("chat") === "1") {
        setIsOpen(true);
        setHasOpened(true);
        localStorage.setItem("portfolio_chat_seen", "true");
        void loadKnowledge();
      }
    } catch {
      // Ignore URL/storage failures.
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const node = scrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const open = useCallback(() => {
    playClick();
    setIsOpen(true);
    setHasOpened(true);
    try {
      localStorage.setItem("portfolio_chat_seen", "true");
    } catch {
      // Ignore storage failures.
    }
    void loadKnowledge();
  }, [playClick]);

  const send = useCallback(
    async (raw?: string) => {
      const value = (raw ?? input).trim();
      if (!value || isTyping) return;

      playClick();
      const userMessage: ChatMessage = { id: makeId(), role: "user", text: value.slice(0, 2000) };
      const previous = messages;
      const session = sessionRef.current;
      setMessages((current) => [...current, userMessage]);
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setIsTyping(true);

      try {
        const knowledge = await loadKnowledge();
        if (sessionRef.current !== session) return;
        const local = answerLocally(value, knowledge);

        if (local.matched) {
          await wait(380);
          if (sessionRef.current !== session) return;
          setMessages((current) => [
            ...current,
            { id: makeId(), role: "assistant", text: local.text, actions: local.actions, source: "local" },
          ]);
          return;
        }

        const aiReply = await askAI(value, previous, knowledge);
        if (sessionRef.current !== session) return;
        if (aiReply) {
          setMessages((current) => [
            ...current,
            { id: makeId(), role: "assistant", text: aiReply, source: "ai" },
          ]);
          return;
        }

        await wait(320);
        if (sessionRef.current !== session) return;
        setMessages((current) => [
          ...current,
          { id: makeId(), role: "assistant", text: local.text, actions: local.actions, source: "local" },
        ]);
      } catch {
        if (sessionRef.current !== session) return;
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            text: "Something went wrong on my side. You can still reach Koteswara through the contact form.",
            actions: [{ label: "Open contact form", to: "/contact" }],
          },
        ]);
      } finally {
        if (sessionRef.current === session) setIsTyping(false);
      }
    },
    [input, isTyping, messages, playClick]
  );

  const deepen = useCallback(
    async (message: ChatMessage) => {
      if (isTyping || deepeningId) return;

      const index = messages.findIndex((entry) => entry.id === message.id);
      if (index < 0) return;

      const question = [...messages.slice(0, index)]
        .reverse()
        .find((entry) => entry.role === "user")?.text;
      if (!question) return;

      playClick();
      const session = sessionRef.current;
      setDeepeningId(message.id);
      setIsTyping(true);

      try {
        const cooldown = aiCooldownSeconds();
        if (cooldown > 0) {
          setMessages((current) => [
            ...current,
            {
              id: makeId(),
              role: "assistant",
              text: `The free AI tier is cooling down for about ${cooldown} more second${cooldown === 1 ? "" : "s"}. The quick answer above already uses the live portfolio data — or you can contact Koteswara directly.`,
              actions: [{ label: "Open contact form", to: "/contact" }],
            },
          ]);
          return;
        }

        const knowledge = await loadKnowledge();
        if (sessionRef.current !== session) return;

        const aiReply = await askAI(
          "Give a deeper, more specific answer to my previous question. Use only the portfolio data and add useful detail beyond the quick answer already shown.",
          messages.slice(0, index + 1),
          knowledge
        );
        if (sessionRef.current !== session) return;

        if (aiReply) {
          setMessages((current) => [
            ...current,
            { id: makeId(), role: "assistant", text: aiReply, source: "ai" },
          ]);
          return;
        }

        const retryIn = aiCooldownSeconds();
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            text: retryIn
              ? `The free AI tier is cooling down for about ${retryIn} more second${retryIn === 1 ? "" : "s"}. The quick answer above already uses the live portfolio data — try again shortly or contact Koteswara directly.`
              : "The advanced AI is unavailable right now. The quick answer above already uses the live portfolio data — you can also contact Koteswara directly.",
            actions: [{ label: "Open contact form", to: "/contact" }],
          },
        ]);
      } finally {
        if (sessionRef.current === session) {
          setDeepeningId(null);
          setIsTyping(false);
        }
      }
    },
    [deepeningId, isTyping, messages, playClick]
  );

  const runAction = (action: ChatAction) => {
    playClick();
    if (action.to) {
      navigate(action.to);
      setIsOpen(false);
      return;
    }
    if (!action.href) return;
    if (/^(mailto:|tel:)/i.test(action.href)) {
      window.location.href = action.href;
      return;
    }
    window.open(action.href, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    playClick();
    sessionRef.current += 1;
    setMessages([welcomeMessage()]);
    setInput("");
    setIsTyping(false);
    if (inputRef.current) inputRef.current.style.height = "auto";
    try {
      sessionStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const node = event.target;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 112)}px`;
  };

  if (isAdmin) return null;

  const showQuickPrompts = messages.length <= 1;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-launcher"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={open}
            onMouseEnter={playHover}
            aria-label="Open portfolio assistant"
            className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[800] group flex items-center gap-0 sm:gap-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_18px_50px_rgba(79,70,229,0.45)] border border-indigo-400/30 transition-colors print:hidden"
          >
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full">
              <MessageSquare size={22} />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                {!hasOpened && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-indigo-600" />
              </span>
            </span>
            <span className="hidden sm:flex flex-col items-start pr-5 leading-tight">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-100/80">
                KOTI.AI
              </span>
              <span className="text-xs font-bold">Ask about my work</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[890] bg-black/60 backdrop-blur-sm sm:hidden print:hidden"
            />
            <motion.section
              key="chat-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio assistant"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="fixed z-[900] inset-x-3 bottom-3 h-[min(82dvh,660px)] sm:inset-auto sm:bottom-7 sm:right-7 sm:w-[400px] sm:h-[min(78dvh,640px)] flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07070c]/95 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.85)] print:hidden"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/15 via-indigo-500/5 to-transparent" />

              <header className="relative flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
                  <Bot size={22} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#07070c]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">KOTI.AI</h2>
                    <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-indigo-300">
                      AI Assistant
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] font-medium text-zinc-500">
                    AI answers from Koteswara&apos;s live portfolio
                  </p>
                </div>
                <button
                  onClick={reset}
                  aria-label="Reset conversation"
                  title="Reset conversation"
                  className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setIsOpen(false);
                  }}
                  aria-label="Close assistant"
                  className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </header>

              <div
                ref={scrollRef}
                aria-live="polite"
                className="no-scrollbar relative flex-1 space-y-4 overflow-y-auto px-4 py-5"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2.5 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-400/20">
                        <Bot size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                        message.role === "user"
                          ? "rounded-br-md bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                          : "rounded-bl-md border border-white/8 bg-white/[0.045] text-zinc-200"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        <MessageText text={message.text} />
                      </div>

                      {message.source === "ai" && (
                        <span className="mt-2 flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.18em] text-indigo-400/70">
                          <Sparkles size={9} /> AI answer
                        </span>
                      )}

                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {message.actions.map((action) => (
                            <button
                              key={`${message.id}-${action.label}`}
                              onClick={() => runAction(action)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold text-indigo-200 transition-colors hover:bg-indigo-500/25 hover:text-white"
                            >
                              {action.label}
                              <ArrowUpRight size={11} />
                            </button>
                          ))}
                        </div>
                      )}

                      {AI_ENABLED &&
                        message.role === "assistant" &&
                        message.source === "local" &&
                        message.id !== "welcome" && (
                          <button
                            onClick={() => void deepen(message)}
                            disabled={Boolean(deepeningId) || isTyping}
                            className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-400/70 transition-colors hover:text-indigo-200 disabled:cursor-wait disabled:opacity-50"
                          >
                            <Sparkles size={10} />
                            {deepeningId === message.id ? "Asking AI…" : "Ask AI to go deeper"}
                          </button>
                        )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2.5">
                    <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-400/20">
                      <Bot size={14} />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.045] px-4 py-3.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                    </div>
                  </div>
                )}

                {showQuickPrompts && (
                  <div className="pt-1">
                    <p className="mb-2 px-1 text-[8px] font-black uppercase tracking-[0.24em] text-zinc-600">
                      Try asking
                    </p>
                    <div className="grid gap-1.5">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => void send(prompt)}
                          onMouseEnter={playHover}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-left text-[11px] font-semibold text-zinc-400 transition-colors hover:border-indigo-500/25 hover:bg-indigo-500/10 hover:text-white"
                        >
                          {prompt}
                          <ArrowUpRight
                            size={13}
                            className="shrink-0 text-zinc-700 transition-colors group-hover:text-indigo-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void send();
                }}
                className="relative border-t border-white/5 p-3"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition-colors focus-within:border-indigo-500/40 focus-within:bg-white/[0.06]">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void send();
                      }
                    }}
                    placeholder="Ask about skills, projects, or hiring…"
                    aria-label="Message"
                    maxLength={2000}
                    className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] text-white outline-none placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-zinc-600"
                  >
                    <Send size={15} />
                  </button>
                </div>
                <p className="mt-2 text-center text-[8px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  AI-assisted answers · verify important details
                </p>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioChat;
