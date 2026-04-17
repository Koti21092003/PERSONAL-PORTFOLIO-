import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Briefcase, MapPin, Terminal } from 'lucide-react';

interface ExperiencePanelProps {
  experiences: any[];
  onAdd: () => void;
  onEdit: (exp: any) => void;
  onDelete: (id: string, title: string) => void;
}

const ExperiencePanel: React.FC<ExperiencePanelProps> = ({ experiences, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Work Experience</h3>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{experiences.length} Experience Records</p>
        </div>
        
        <button
          onClick={onAdd}
          className="group relative px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-purple-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-purple-600/30 active:scale-95 flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={14} />
          </div>
          Add New Experience
        </button>
      </div>

      <div className="space-y-8">
        {experiences.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center glass rounded-[3rem] border border-white/5 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-zinc-600">
              <Briefcase size={32} />
            </div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No experience found</p>
          </motion.div>
        ) : (
          experiences.map((exp, index) => (
            <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-10 rounded-[3rem] bg-zinc-900/30 backdrop-blur-3xl border border-white/5 transition-all duration-700 hover:border-purple-500/30 relative overflow-hidden"
            >
              {/* Timeline Marker */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20 bg-purple-500/20 rounded-full" />
              
              <div className="absolute top-8 right-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <button
                  id={`edit-exp-${exp.id}`}
                  onClick={() => onEdit(exp)}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center"
                  title="Edit Experience"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  id={`delete-exp-${exp.id}`}
                  onClick={() => onDelete(exp.id, exp.title)}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                  title="Delete Experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                <div className="w-24 h-24 rounded-3xl bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-700 shadow-inner">
                  <Briefcase className="text-purple-500 group-hover:text-white" size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg uppercase tracking-widest border border-purple-500/20">
                          {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                       </span>
                    </div>
                    <h4 className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight leading-none mb-2">{exp.title}</h4>
                  </div>
                  <p className="text-zinc-400 font-black uppercase tracking-widest text-[11px] mb-6 flex items-center gap-2">
                     <span className="text-purple-600">@</span> {exp.company}
                  </p>
                  <p className="text-zinc-500 leading-relaxed max-w-4xl text-sm font-bold uppercase tracking-widest opacity-60 flex-1">{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-8">
                    {(Array.isArray(exp.tags) ? exp.tags : (exp.tags || "").split(",")).filter(Boolean).map((tag: string) => (
                      <span key={tag} className="text-[8px] font-black text-zinc-500 bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-[0.2em] group-hover:border-purple-500/20 group-hover:text-purple-300 transition-all">
                        {tag.trim()}
                      </span>
                    ))}
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

export default ExperiencePanel;
