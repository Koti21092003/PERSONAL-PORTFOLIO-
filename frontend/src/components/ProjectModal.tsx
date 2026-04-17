import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Terminal, Cpu, Database, Layout, Shield } from "lucide-react";

interface ProjectModalProps {
   isOpen: boolean;
   onClose: () => void;
   project: {
      title: string;
      description: string;
      techStack: string[];
      githubLink: string;
      liveLink: string;
      image: string;
      challenges?: string;
      architecture?: string;
   };
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-black/80 backdrop-blur-xl"
               />

               <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 50 }}
                  className="relative w-full max-w-5xl h-[85vh] glass-premium rounded-[3rem] overflow-hidden border border-white/10 flex flex-col sm:flex-row shadow-[0_50px_100px_rgba(0,0,0,1)]"
               >
                  {/* Left Side: Visuals */}
                  <div className="w-full sm:w-2/5 h-1/3 sm:h-full relative overflow-hidden bg-zinc-950 border-b sm:border-b-0 sm:border-r border-white/5">
                     <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                     <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 mb-2 px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 w-fit">
                           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-glow">Secure Connection Established</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h2>
                     </div>
                  </div>

                  {/* Right Side: Data */}
                  <div className="flex-1 h-2/3 sm:h-full overflow-y-auto p-8 sm:p-12 space-y-12 bg-black/40 no-scrollbar">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Mission Briefing</span>
                           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Technical Analysis</h3>
                        </div>
                        <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-all active:scale-95">
                           <X size={24} />
                        </button>
                     </div>

                     {/* Description Node */}
                     <section className="space-y-4">
                        <div className="flex items-center gap-4 text-zinc-500">
                           <Terminal size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-glow">System Overview</span>
                        </div>
                        <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-light italic border-l-2 border-indigo-500/30 pl-8">
                           {project.description}
                        </p>
                     </section>

                     {/* Tech Matrix */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-4 text-zinc-500">
                           <Cpu size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Resource Allocation</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                           {project.techStack.map(tech => (
                              <div key={tech} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2 group hover:border-indigo-500/30 transition-all">
                                 <span className="text-white font-bold text-xs">{tech}</span>
                                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-3/4 group-hover:w-full transition-all duration-1000" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Architecture & Challenges */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 space-y-4">
                           <div className="flex items-center gap-3 text-indigo-400">
                              <Database size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Architecture</h4>
                           </div>
                           <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                              {project.architecture || "Highly scalable distributed architecture with real-time state synchronization via custom hooks and high-intensity performance hooks."}
                           </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-purple-600/5 border border-purple-500/10 space-y-4">
                           <div className="flex items-center gap-3 text-purple-400">
                              <Shield size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Challenges</h4>
                           </div>
                           <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                              {project.challenges || "Optimizing layout shifts during high-frequency neural transmissions and ensuring stable 144Hz animation logic across mobile viewports."}
                           </p>
                        </div>
                     </div>

                     {/* External Redirects */}
                     <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                        <a
                           href={project.liveLink}
                           target="_blank"
                           className="flex-1 py-5 bg-white text-black rounded-3xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                           Access Deployment <ExternalLink size={18} />
                        </a>
                        <a
                           href={project.githubLink}
                           target="_blank"
                           className="flex-1 py-5 bg-zinc-900 border border-white/5 text-white rounded-3xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all active:scale-95"
                        >
                           Source Encryption <Github size={18} />
                        </a>
                     </div>

                     {/* Footer HUD */}
                     <div className="pt-12 text-center">
                        <div className="inline-flex items-center gap-4 text-zinc-800 text-[8px] font-black uppercase tracking-[0.5em]">
                           <div className="w-1 h-1 rounded-full bg-zinc-900" />
                           Encrypted Node Connection
                           <div className="w-1 h-1 rounded-full bg-zinc-900" />
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
};

export default ProjectModal;
