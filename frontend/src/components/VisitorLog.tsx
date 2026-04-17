import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Wifi, Globe } from "lucide-react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const VisitorLog = () => {
  const [logs, setLogs] = useState<{ id: string, city: string, timestamp: string }[]>([]);

  useEffect(() => {
    const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(3));
    const unsub = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col gap-3 font-mono">
      <div className="flex items-center gap-2 mb-2">
        <Wifi size={12} className="text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Uplink Logs</span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 text-[9px]"
            >
              <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
              <span className="text-emerald-500/80">SIGNAL_DETECTED:</span>
              <span className="text-zinc-400 font-bold uppercase tracking-tighter">[{log.city || "ANONYMOUS_REGION"}]</span>
              <span className="text-zinc-700 text-[7px]">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="flex items-center gap-3 text-[9px] text-zinc-800 italic">
               Waiting for incoming uplink...
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative Matrix Bitstream */}
      <div className="flex gap-1 mt-2">
         {[1,0,1,1,0].map((b, i) => (
           <motion.span 
             key={i}
             animate={{ opacity: [0.2, 1, 0.2] }}
             transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
             className="text-[8px] text-emerald-950 font-black"
           >{b}</motion.span>
         ))}
      </div>
    </div>
  );
};

export default VisitorLog;
