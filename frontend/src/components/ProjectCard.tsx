import React, { useState } from "react";
import { ExternalLink, Github, Star, SearchCode, RotateCcw, Globe, Zap, Code, Layout } from "lucide-react";
import { motion } from "framer-motion";
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
    result?: string;
  };
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = "" }) => {
  const { playHover, playClick } = useHUDSound();
  const [isFlipped, setIsFlipped] = useState(false);

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
    <div
      className={`relative h-[680px] w-full group ${className} flex flex-col glass rounded-[3.5rem] overflow-hidden border border-white/10 transition-all duration-700 hover:shadow-[0_60px_100px_rgba(0,0,0,0.9)] bg-black/40`}
    >
      <div className="flex-1 relative overflow-hidden p-2">
        <div className="relative w-full h-full">
          {/* FRONT BODY */}
          <div
            className={`absolute inset-0 rounded-[2.8rem] overflow-hidden flex flex-col bg-[#050508] ${isFlipped ? "hidden" : ""}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden p-3 pb-0">
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-zinc-900/50 relative shadow-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-95" />

                {project.isStarred && (
                  <div className="absolute top-6 right-6 z-30 transform hover:scale-110 transition-transform">
                    <div className="bg-amber-400 text-black p-2 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.5)] border border-amber-300">
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>
                )}

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
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  Project Record #00{Math.floor(Math.random() * 90) + 10}
                </span>
              </div>

              <h3 className="text-3xl font-black text-white mb-6 leading-none uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-500 transition-all duration-700">
                {project.title}
              </h3>

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
            className={`absolute inset-0 rounded-[2.8rem] bg-[#020204] p-10 flex flex-col overflow-y-auto no-scrollbar border border-white/5 ${isFlipped ? "" : "hidden"}`}
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

            <div className="flex justify-between items-start mb-12 relative z-20">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Code size={12} className="text-blue-400" />
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block underline decoration-blue-500/20 underline-offset-4">
                    Technical Details
                  </span>
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
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white hover:border-blue-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {project.architecture && (
                <section>
                  <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-4">
                    Architecture
                    <div className="h-[1.5px] flex-1 bg-white/5" />
                  </h5>
                  <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:text-zinc-300 transition-colors uppercase">
                    {project.architecture}
                  </p>
                </section>
              )}

              {project.challenges && (
                <section>
                  <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-4">
                    Challenges
                    <div className="h-[1.5px] flex-1 bg-white/5" />
                  </h5>
                  <p className="text-zinc-500 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:text-zinc-300 transition-colors uppercase">
                    {project.challenges}
                  </p>
                </section>
              )}

              {project.result && (
                <section>
                  <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-4">
                    Result
                    <div className="h-[1.5px] flex-1 bg-white/5" />
                  </h5>
                  <p className="text-zinc-400 text-xs leading-relaxed font-bold uppercase tracking-widest opacity-80 group-hover:text-zinc-300 transition-colors uppercase border-l-2 border-emerald-500 pl-6">
                    {project.result}
                  </p>
                </section>
              )}

              <div className="h-8 shrink-0" />
            </div>

            <div className="mt-auto pt-8 border-t border-white/5 text-center shrink-0">
              <span className="text-[9px] font-black text-zinc-900 uppercase tracking-[0.5em]">
                The Journey Behind the Code • {project.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        FIXED FOOTER (Shared Links)
      */}
      <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl relative z-20">
        <div className="flex gap-4">
          {project.githubLink && (
            <a
              href={ensureProtocol(project.githubLink)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 border border-white/5 hover:border-white/20"
            >
              <Github size={20} />
            </a>
          )}
          {project.liveLink && (
            <a
              href={ensureProtocol(project.liveLink)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 border border-white/5 hover:border-white/20"
            >
              <Globe size={20} />
            </a>
          )}
        </div>

        <a
          href={project.liveLink ? ensureProtocol(project.liveLink) : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/btn relative overflow-hidden px-10 py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-blue-600 hover:text-white shadow-2xl shadow-white/5 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            Live Demo <ExternalLink size={16} />
          </span>
          <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
