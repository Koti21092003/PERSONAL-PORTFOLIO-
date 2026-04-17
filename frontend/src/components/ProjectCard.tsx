import React, { useState, useEffect } from "react";
import { ExternalLink, Github, Star, SearchCode, RotateCcw, Globe, Zap, Code, Layout } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useHUDSound } from "../hooks/useHUDSound";

interface ProjectCardProps {
  project: {
    id?: string;
    title: string;
    description: string;
    techStack: string[];
    githubLink: string;
    liveLink: string;
    image: string;
    type?: string;
    isFeatured?: boolean;
    isStarred?: boolean;
    challenges?: string;
    architecture?: string;
  };
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = "" }) => {
  const { playHover, playClick } = useHUDSound();
  const [isFlipped, setIsFlipped] = useState(false);
  
  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const ensureProtocol = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
      return url;
    }
    return `https://${url}`;
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-[680px] w-full perspective-2000 group ${className} flex flex-col glass rounded-[3.5rem] overflow-hidden border border-white/10 transition-all duration-700 hover:shadow-[0_60px_100px_rgba(0,0,0,0.9)] bg-black/40`}
    >
      {/* 
        BODY SECTION (The flipping part)
      */}
      <div className="flex-1 relative overflow-hidden p-2">
        <motion.div
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
           style={{ transformStyle: "preserve-3d" }}
           className="relative w-full h-full"
        >
          {/* FRONT BODY */}
          <div 
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 rounded-[2.8rem] overflow-hidden flex flex-col bg-[#050508]"
          >
            <div className="relative aspect-[16/10] overflow-hidden p-3 pb-0">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-zinc-900/50 relative shadow-2xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-95" />
                    
                    {project.isStarred && (
                      <div className="absolute top-6 right-6 z-30 transform hover:scale-110 transition-transform">
                        <div className="bg-amber-400 text-black p-2 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.5)] border border-amber-300">
                          <Star size={16} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Attractive Overlay Accent */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                       <div className="px-4 py-1.5 glass-premium bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                          {project.type || "Full Stack"}
                       </div>
                    </div>
                </div>
            </div>

            <div className="p-10 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Project Record #00{Math.floor(Math.random()*90)+10}</span>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 leading-none uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-500 transition-all duration-700">{project.title}</h3>
              
              <p className="text-zinc-400 text-sm leading-relaxed font-bold uppercase tracking-widest opacity-80 border-l-2 border-white/5 pl-6 mb-8 line-clamp-4">
                {project.description}
              </p>

              <div className="mt-auto flex justify-between items-center group/flip">
                <div className="flex items-center gap-4 opacity-50">
                    <Zap size={14} className="text-blue-500" />
                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Verified Outcome</span>
                </div>
                <button 
                  onClick={handleFlip}
                  onMouseEnter={playHover}
                  className="flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all transform hover:translate-x-3 bg-blue-600/10 px-6 py-3 rounded-2xl border border-blue-500/20 hover:bg-blue-600 hover:text-white group-hover:border-blue-500/50"
                >
                  Discover More <SearchCode size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* BACK BODY (Technical Analysis) */}
          <div 
             style={{ 
               backfaceVisibility: "hidden",
               transform: "rotateY(180deg)" 
             }}
             className="absolute inset-0 rounded-[2.8rem] bg-[#020204] p-10 flex flex-col overflow-y-auto no-scrollbar border border-white/5"
          >
              {/* Vibrant Ambient Glows */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

              <div className="flex justify-between items-start mb-12 relative z-20">
                  <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <Code size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block underline decoration-blue-500/20 underline-offset-4">Technical Details</span>
                      </div>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h4>
                  </div>
                  <button 
                      onClick={handleFlip}
                      className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-all transform hover:rotate-180 active:scale-90 relative z-30 cursor-pointer border border-white/10 hover:border-white/30"
                      title="Back to Preview"
                  >
                      <RotateCcw size={20} />
                  </button>
              </div>

              <div className="space-y-10 flex-1 text-left relative z-10">
                  <section>
                       <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-4">
                          Project Overview
                          <div className="h-[1.5px] flex-1 bg-white/5" />
                       </h5>
                       <p className="text-zinc-400 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-90 border-l-2 border-blue-500 pl-8 mb-8 italic">
                          {project.description}
                       </p>
                  </section>

                  <section>
                       <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6 flex items-center gap-4">
                          Tools & Technologies
                          <div className="h-[1.5px] flex-1 bg-white/5" />
                       </h5>
                       <div className="flex flex-wrap gap-3 text-left">
                          {project.techStack.map(tech => (
                              <span key={tech} className="px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white hover:border-blue-500">
                                  {tech}
                              </span>
                          ))}
                       </div>
                  </section>

                  {project.architecture && (
                     <section className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 group/arch transition-all hover:border-blue-500/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                          <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                             <Layout size={14} /> Engineering Logic
                          </h5>
                          <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:text-zinc-300 transition-colors uppercase">{project.architecture}</p>
                     </section>
                  )}

                  {project.challenges && (
                     <section className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 group/challenges transition-all hover:border-emerald-500/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                          <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                             <Zap size={14} /> Problem & Resolution
                          </h5>
                          <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:text-zinc-300 transition-colors uppercase">{project.challenges}</p>
                     </section>
                  )}

                  <div className="h-8 shrink-0" />
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 text-center shrink-0">
                  <span className="text-[9px] font-black text-zinc-900 uppercase tracking-[0.5em]">The Journey Behind the Code • {project.title}</span>
              </div>
          </div>
        </motion.div>
      </div>

      {/* 
        FIXED FOOTER (Shared Links)
      */}
      <div className="p-8 bg-black/40 backdrop-blur-3xl border-t border-white/10 relative z-[50]">
          <div className="grid grid-cols-2 gap-6">
              <a
                  href={ensureProtocol(project.githubLink)}
                  target="_blank"
                  className="w-full py-5 bg-white text-black rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group/link"
              >
                  Source <Github size={18} className="group-hover/link:rotate-12 transition-transform" />
              </a>
              <a
                  href={ensureProtocol(project.liveLink)}
                  target="_blank"
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.3)] group/link"
              >
                  Live <ExternalLink size={18} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
          </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
