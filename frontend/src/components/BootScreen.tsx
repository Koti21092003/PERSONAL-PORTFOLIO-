import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "BIOS v2.1.0-PREMIUM ... OK",
  "Initializing KOTI.AI kernel...",
  "Loading modules: react, vite, tailwind, firebase",
  "Mounting routes: /, /about, /projects, /skills",
  "Establishing neural link ... 99.9%",
  "Compiling assets ... done",
  "Starting portfolio services ... OK",
  "Welcome, visitor.",
];

const BootScreen: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio_booted") !== "true";
    } catch {
      return true;
    }
  });
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const timers: number[] = [];

    BOOT_LINES.forEach((line, index) => {
      const t = window.setTimeout(() => {
        if (cancelled) return;
        setLines((prev) => [...prev, line]);
      }, 220 * (index + 1));
      timers.push(t);
    });

    const finish = window.setTimeout(() => {
      if (cancelled) return;
      setDone(true);
      try {
        sessionStorage.setItem("portfolio_booted", "true");
      } catch {
        // Ignore storage failures.
      }
      const hide = window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 600);
      timers.push(hide);
    }, 220 * (BOOT_LINES.length + 1.5));
    timers.push(finish);

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!done || true ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black font-mono text-sm text-emerald-400 print:hidden"
        >
          <div className="w-full max-w-2xl px-8">
            <div className="mb-4 flex items-center gap-2 text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em]">portfolio boot sequence</span>
            </div>
            <div className="space-y-1.5">
              {lines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-zinc-600">[{String(index + 1).padStart(2, "0")}]</span>
                  <span>{line}</span>
                </motion.div>
              ))}
              {!done && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600">[..]</span>
                  <span className="inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default BootScreen;
