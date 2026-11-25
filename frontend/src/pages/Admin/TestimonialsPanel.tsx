import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Star, Quote, User } from 'lucide-react';

interface TestimonialsPanelProps {
  testimonials: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onAdd: () => void;
  onEdit: (t: any) => void;
  onDelete: (id: string, name: string) => void;
}

const TestimonialsPanel: React.FC<TestimonialsPanelProps> = ({
  testimonials,
  searchQuery,
  setSearchQuery,
  onAdd,
  onEdit,
  onDelete
}) => {
  const filteredTestimonials = testimonials.filter(t =>
    (t?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t?.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t?.company || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Testimonials</h3>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{testimonials.length} Total Testimonials</p>
        </div>

        <button
          onClick={onAdd}
          className="group relative px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-indigo-600/30 active:scale-95 flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={14} />
          </div>
          Add New Testimonial
        </button>
      </div>

      {/* Search Section */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-indigo-500 text-zinc-600 transition-colors">
          <Search size={18} />
        </div>
        <input
          id="testimonial-search-input"
          type="text"
          placeholder="Search by name, role or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 font-medium text-sm"
        />
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredTestimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-24 text-center glass rounded-[3rem] border border-white/5 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-zinc-600">
              <Quote size={32} />
            </div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No testimonials found</p>
          </motion.div>
        ) : (
          filteredTestimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-[3rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 group hover:border-indigo-500/30 transition-all duration-500 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden"
            >
              {/* Background Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-all" />

              <div className="w-full lg:w-24 aspect-square bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-700 p-2 shrink-0 flex items-center justify-center">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover rounded-[2rem]" referrerPolicy="no-referrer" />
                ) : (
                  <User size={40} className="text-zinc-600" />
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tighter uppercase group-hover:text-indigo-400 transition-colors leading-none">{t.name}</h4>
                  </div>
                </div>

                {(t.role || t.company) && (
                  <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6 opacity-70">
                    {[t.role, t.company].filter(Boolean).join(" • ")}
                  </p>
                )}

                <Quote className="text-indigo-500/20 mb-4" size={32} />

                <p className="text-zinc-400 text-sm leading-relaxed font-medium mb-8">
                  “{t.text}”
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <button id={`edit-testimonial-${t.id}`} onClick={() => onEdit(t)} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center" title="Edit Testimonial">
                      <Edit2 size={16} />
                    </button>
                    <button id={`delete-testimonial-${t.id}`} onClick={() => onDelete(t.id, t.name)} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center" title="Delete Testimonial">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsPanel;
