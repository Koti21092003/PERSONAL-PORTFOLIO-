import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Github, Terminal, Volume2, VolumeX, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHUDSound } from '../hooks/useHUDSound';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { playClick, playHover } = useHUDSound();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        setResumeUrl(doc.data().resumeUrl || null);
      }
    });
    return () => unsub();
  }, []);

  const actions = [
    { id: 'home', title: 'Navigate: Home', icon: <Terminal size={18} />, action: () => navigate('/') },
    { id: 'projects', title: 'Navigate: Projects', icon: <Globe size={18} />, action: () => navigate('/projects') },
    { id: 'skills', title: 'Navigate: Technical Matrix', icon: <Terminal size={18} />, action: () => navigate('/skills') },
    { id: 'contact', title: 'Navigate: Signal Transmission', icon: < Globe size={18} />, action: () => navigate('/contact') },
    { id: 'github', title: 'Open Source: GitHub Repository', icon: <Github size={18} />, action: () => window.open('https://github.com', '_blank') },
    { id: 'sound', title: 'System: Toggle HUD Audio', icon: <Volume2 size={18} />, action: () => {
      const current = localStorage.getItem('portfolio_sound_enabled') === 'true';
      localStorage.setItem('portfolio_sound_enabled', String(!current));
      window.location.reload(); // Quick sync
    }},
    { id: 'resume', title: 'Download: Security Clearance (Resume)', icon: <FileText size={18} />, action: () => {
      if (resumeUrl) {
        window.open(resumeUrl, '_blank');
      } else {
        alert('Resume not found in system core.');
      }
    }},
  ];

  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if(!isOpen) playClick();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    playClick();
    action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden"
          ref={containerRef}
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/5">
            <Search size={20} className="text-zinc-500" />
            <input 
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="SEARCH SYSTEM COMMANDS..."
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm tracking-widest placeholder:text-zinc-700 uppercase"
            />
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <X size={18} className="text-zinc-500" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 px-4">System Directives</div>
            <div className="space-y-1">
              {filteredActions.map((action, i) => (
                <button
                  key={action.id}
                  onMouseEnter={() => {
                    setSelectedIndex(i);
                    playHover();
                  }}
                  onClick={() => handleAction(action.action)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                    selectedIndex === i ? 'bg-indigo-600/20 text-white border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${selectedIndex === i ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-600'}`}>
                      {action.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{action.title}</span>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-700 opacity-0 group-hover:opacity-100 uppercase tracking-tighter">EXECUTE_DIRECTIVE</div>
                </button>
              ))}
              {filteredActions.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <Terminal size={40} className="mx-auto text-zinc-800 mb-4" />
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No matching directives found in core.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <span className="px-1.5 py-1 rounded bg-zinc-800 text-[8px] font-mono text-zinc-400">ESC</span>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Close</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="px-1.5 py-1 rounded bg-zinc-800 text-[8px] font-mono text-zinc-400">↵</span>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Select</span>
                </div>
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Core Stable</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
