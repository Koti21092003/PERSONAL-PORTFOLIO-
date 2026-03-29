import React from 'react';
import { Plus, Edit2, Trash2, Calendar, Briefcase, MapPin } from 'lucide-react';

interface ExperiencePanelProps {
  experiences: any[];
  onAdd: () => void;
  onEdit: (exp: any) => void;
  onDelete: (id: string, title: string) => void;
}

const ExperiencePanel: React.FC<ExperiencePanelProps> = ({ experiences, onAdd, onEdit, onDelete }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          Work Experience
        </h3>
        <button
          onClick={onAdd}
          className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="space-y-8">
        {experiences.length === 0 ? (
          <div className="py-24 text-center glass rounded-[3rem] border-white/5 mx-auto">
            <p className="text-zinc-600">No experience records found yet.</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="group relative p-10 rounded-[3rem] bg-zinc-950 border border-white/5 transition-all duration-700 hover:border-purple-500/20 hover:shadow-2xl">
              <div className="absolute top-8 right-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => onEdit(exp)}
                  className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white transition-all active:scale-90"
                  title="Edit Experience"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(exp.id, exp.title)}
                  className="p-3.5 rounded-2xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-90"
                  title="Delete Experience"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-purple-600 group-hover:text-white transition-all duration-700">
                  <Briefcase className="text-purple-400 group-hover:text-white" size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col mb-4">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                      {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                    <h4 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{exp.title}</h4>
                  </div>
                  <p className="text-zinc-400 font-bold mb-4">{exp.company}</p>
                  <p className="text-zinc-500 leading-relaxed max-w-4xl text-sm font-medium">{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {(Array.isArray(exp.tags) ? exp.tags : (exp.tags || "").split(",")).filter(Boolean).map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold text-purple-400 bg-purple-500/5 px-4 py-1.5 rounded-full border border-purple-500/10 uppercase tracking-widest">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperiencePanel;
