import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  text: string;
  avatar?: string;
}

const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => window.clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <section className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="glass-premium px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-indigo-400">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 tracking-tight">
            What people <span className="text-indigo-500">say</span>
          </h2>
        </div>

        <div className="glass rounded-[3rem] p-10 sm:p-14 relative overflow-hidden border border-white/5">
          <Quote className="absolute top-6 left-6 text-indigo-500/20" size={64} />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 text-center"
            >
              <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-medium italic mb-8">
                “{current.text}”
              </p>
              <div className="flex flex-col items-center gap-1">
                {current.avatar && (
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-12 h-12 rounded-full object-cover mb-2 border border-white/10"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                )}
                <span className="text-white font-bold uppercase tracking-widest text-sm">{current.name}</span>
                {(current.role || current.company) && (
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">
                    {[current.role, current.company].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                aria-label="Previous testimonial"
                className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-indigo-500" : "w-1.5 bg-zinc-700"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIndex((i) => (i + 1) % items.length)}
                aria-label="Next testimonial"
                className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
