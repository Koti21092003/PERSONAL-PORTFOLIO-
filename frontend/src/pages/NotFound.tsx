import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCcw, ShieldAlert, Cpu, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NotFound = () => {
  const [glitch, setGlitch] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const errorMessages = [
    "ERROR: SEGMENTATION_FAULT",
    "WARNING: CORE_DUMP_DETECTED",
    "CRITICAL: MEMORY_LEAK_AT_0x0040404",
    "SECURITY_BREACH: UNKNOWN_PATH_ACCESS",
    "SYS_FAIL: KERNEL_PANIC",
    "RECOVERY_MODE: ACTIVE",
    "SCANNING_FOR_CORRUPTED_SECTORS...",
    "ATTEMPTING_TO_RECOVER_UI_CONTEXT...",
    "FATAL_ERROR: RESOURCE_NOT_FOUND",
  ];

  useEffect(() => {
    // Adding logs one by one
    let i = 0;
    const interval = setInterval(() => {
      if (i < errorMessages.length) {
        setLogs(prev => [...prev.slice(-8), errorMessages[i]]);
        i++;
      }
    }, 800);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + Math.random() * 5 : 100));
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 overflow-hidden font-mono">
      {/* Background Noise/Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Screen Glitch Overlay */}
      {glitch && (
        <div className="absolute inset-0 z-50 mix-blend-difference bg-red-500/20 pointer-events-none" />
      )}

      {/* Main UI Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full border-2 border-red-600/50 bg-red-950/10 backdrop-blur-xl rounded-sm p-8 relative"
      >
        {/* Top Diagnostic Bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-red-600 flex items-center justify-between px-4 text-black text-[10px] font-black uppercase">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            CRITICAL SYSTEM FAILURE
          </div>
          <div>ERROR_CODE: 404_NOT_FOUND</div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          
          {/* Left: Graphic Indicator */}
          <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
              animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative w-48 h-48 flex items-center justify-center"
            >
              <div className="absolute inset-0 border-4 border-dashed border-red-600 rounded-full opacity-20" />
              <ShieldAlert size={80} className="text-red-500 animate-pulse" />
              
              {/* Radar Sweeper */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 via-transparent to-transparent rounded-full animate-spin-slow" />
            </motion.div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] text-red-500 font-bold uppercase tracking-widest">
                <span>Memory Integrity Scan</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-red-950 rounded-full overflow-hidden border border-red-600/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-red-600"
                />
              </div>
            </div>
          </div>

          {/* Right: Terminal Logs */}
          <div className="bg-black/50 border border-red-600/20 p-6 rounded-lg min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-red-600/20 pb-2">
              <Terminal size={14} className="text-red-500" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Diagnostic Output</span>
            </div>
            
            <div className="flex-1 space-y-1 overflow-hidden">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] text-red-400 flex items-start gap-2"
                  >
                    <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                    <span className="font-bold">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Scanning Line Animation */}
            <motion.div
              animate={{ y: [0, 250, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-red-500/30 shadow-[0_0_15px_red] pointer-events-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-red-600/20">
          <div className="text-red-500/50 text-[10px] uppercase leading-relaxed max-w-sm">
            THE REQUESTED RESOURCE HAS BEEN MOVED, DELETED, OR NEVER EXISTED WITHIN THIS SECTOR. 
            CONTINUED ACCESS ATTEMPTS MAY RESULT IN SESSION TERMINATION.
          </div>
          
          <Link
            to="/"
            className="group flex items-center gap-4 bg-red-600 hover:bg-white text-black transition-all duration-300 px-8 py-4 rounded-sm font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          >
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Initialize Reboot
          </Link>
        </div>

        {/* HUD Elements Overlay */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-30 select-none">
          {["AX-1", "AX-2", "AX-3"].map(t => (
            <div key={t} className="text-[8px] text-red-500 rotate-90">{t}</div>
          ))}
        </div>
      </motion.div>

      {/* Extreme Borders */}
      <div className="fixed top-2 bottom-2 left-2 w-0.5 bg-red-600/20 shadow-[0_0_10px_red]" />
      <div className="fixed top-2 bottom-2 right-2 w-0.5 bg-red-600/20 shadow-[0_0_10px_red]" />
    </div>
  );
};

export default NotFound;
