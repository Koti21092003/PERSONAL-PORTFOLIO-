import { ExternalLink, Github, Terminal, Star } from "lucide-react";
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
  };
  className?: string;
}

const ProjectCard = ({ project, className = "" }: ProjectCardProps) => {
  const { playHover, playClick } = useHUDSound();
  
  const ensureProtocol = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass glass-hover rounded-[2.5rem] overflow-hidden group flex flex-col h-full border-white/5 shadow-2xl relative z-10 ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden p-3 pb-0">
        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-zinc-900/50 relative group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-700">
            {/* Visual elements */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
               <div className="p-2 glass bg-black/40 backdrop-blur-md rounded-lg text-blue-400">
                  <Terminal size={16} />
               </div>
            </div>

            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

            {/* Scan Line effect */}
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
            />

            {/* Star badge */}
            {project.isStarred && (
              <div className="absolute top-4 right-4 z-30 transform hover:rotate-12 transition-transform">
                <div className="bg-yellow-500 text-black p-1.5 rounded-lg shadow-lg border border-yellow-400">
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
            )}
          </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active System</span>
          </div>
          <span className="px-3 py-1 glass bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-full border-none">
            {project.type || "Neural Protocol"}
          </span>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-display group-hover:text-blue-400 transition-colors leading-tight">{project.title}</h3>
        
        <p className="text-zinc-500 text-xs sm:text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
          {project.description}
        </p>

        {/* Unified Project Actions */}
        <div className="flex gap-4 mb-8">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playClick();
                const url = ensureProtocol(project.githubLink);
                if (url && url !== "#") {
                  window.open(url, "_blank");
                }
              }}
              onMouseEnter={playHover}
              aria-label={`View ${project.title} source code on GitHub`}
              className="flex-1 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-white/5 hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl group/btn cursor-pointer"
            >
              Code <Github size={16} className="group-hover/btn:rotate-12 transition-transform" />
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playClick();
                const url = ensureProtocol(project.liveLink);
                if (url && url !== "#") {
                  window.open(url, "_blank");
                }
              }}
              onMouseEnter={playHover}
              aria-label={`View ${project.title} live demo`}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-indigo-500 hover:shadow-indigo-500/20 group/btn cursor-pointer"
            >
              Live <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
        </div>
        
        {/* Tech Badges */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {(project.techStack || []).slice(0, 4).map((tech: string) => (
              <span 
                key={tech} 
                className="text-[10px] font-bold text-zinc-500 border border-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all"
              >
                {tech}
              </span>
            ))}
            {project.techStack && project.techStack.length > 4 && (
              <span className="text-[10px] text-zinc-600 font-black self-center ml-2">+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
