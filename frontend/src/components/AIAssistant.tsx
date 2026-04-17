import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Terminal, ChevronDown } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useHUDSound } from "../hooks/useHUDSound";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "AI Assistant online. How can I help you with Koteswara Rao's portfolio today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playClick, playHover, playError } = useHUDSound();

  const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    playClick();

    if (!API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "bot",
          content: "ERROR: Critical Module Missing. (Gemini API Key not configured). Please check system environment variables.",
          timestamp: new Date()
        }]);
        setIsLoading(false);
        playError();
      }, 1000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      });

      const prompt = `
        You are "Portfolio Assistant", an AI representative for Koteswara Rao (Koti), a Full Stack Developer.
        Koteswara Rao's details:
        - Pursuing B.Tech in CSE at Centurion University (Batch 2022-2026).
        - Skills: React, Node.js, Firebase, TypeScript, Tailwind, Three.js, Gemini AI.
        - Experience: Full Stack Developer focused on intuitive, high-performance web apps.
        - Tone: Professional, helpful, and friendly.
        
        Answer user questions about him briefly. Mention projects: Admin Dashboard, Medical App.
        
        User: ${input}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        role: "bot",
        content: text,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      playError();
      const errorMsg = error.message?.includes("API_KEY_INVALID") 
        ? "Connection Error: Invalid API Key. Please verify credentials."
        : "Communication error. Connection unstable. (Error Code: " + (error.status || "UNKNOWN") + ")";
      
      setMessages(prev => [...prev, {
        role: "bot",
        content: errorMsg,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); playClick(); }}
        className="fixed bottom-6 right-6 z-[1000] w-16 h-16 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Sparkles size={24} className="group-hover:animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.8, filter: "blur(10px)" }}
            className="fixed bottom-28 right-6 z-[1000] w-[90vw] sm:w-[400px] h-[600px] rounded-[3rem] glass-premium overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white relative">
                     <div className="absolute inset-0 bg-indigo-500 rounded-2xl animate-ping opacity-20" />
                     <Bot size={20} className="relative z-10" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase tracking-tighter">Portfolio Assistant</h4>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">System Active</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
                  <X size={20} />
               </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide no-scrollbar bg-black/40">
               {messages.map((msg, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-indigo-600'}`}>
                           {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                           msg.role === 'user' 
                           ? 'bg-zinc-800 text-white rounded-tr-none' 
                           : 'glass border-white/5 text-zinc-300 rounded-tl-none'
                        }`}>
                           {msg.content}
                        </div>
                     </div>
                  </motion.div>
               ))}
               {isLoading && (
                  <div className="flex justify-start">
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white animate-pulse">
                           <Bot size={14} />
                        </div>
                        <div className="p-4 rounded-3xl glass border-white/5 rounded-tl-none flex gap-1">
                           <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" />
                           <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                           <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
               <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative group"
               >
                  <input 
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Ask a question..."
                     className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 transition-all font-sans"
                  />
                  <button 
                     type="submit"
                     disabled={!input.trim() || isLoading}
                     className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-600 text-white hover:bg-white hover:text-black transition-all disabled:opacity-50 active:scale-90"
                  >
                     <Send size={16} />
                  </button>
               </form>
               <div className="mt-3 flex items-center justify-center gap-2">
                  <Sparkles size={10} className="text-zinc-800" />
                  <span className="text-[7px] font-black text-zinc-800 uppercase tracking-[0.3em]">AI Powered Experience</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
