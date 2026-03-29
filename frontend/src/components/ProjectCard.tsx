import { ExternalLink, Github, Layers, Star } from "lucide-react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import { useHUDSound } from "../hooks/useHUDSound";

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    techStack: string[];
    githubLink: string;
    liveLink: string;
    image: string;
    isFeatured?: boolean;
    isStarred?: boolean;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { playHover, playClick } = useHUDSound();
  return (
    <TiltCard
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass glass-hover rounded-[2.5rem] overflow-hidden group flex flex-col h-full border-white/5 shadow-2xl"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] overflow-hidden p-4">
        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-zinc-800 relative group-hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all duration-700">
            {/* Advanced Coder Brackets - Desktop Only */}
            <div className="absolute inset-4 z-20 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
               <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
               <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
               <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
               <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
            </div>

            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Scan Line */}
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent pointer-events-none"
            />

            {/* Star Badge - Desktop & Mobile */}
            {(project.isStarred || project.isFeatured) && (
              <div className="absolute top-6 right-6 z-30 transform hover:rotate-12 transition-transform">
                <div className="bg-yellow-500 text-black p-2 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] border border-yellow-400">
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
            )}

            {/* No Hover Overlay for Actions anymore as they are moved to the body for consistency */}
          </div>
      </div>

      {/* Narrative Container */}
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} className="text-indigo-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Featured Project</span>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-black text-white mb-3 font-display group-hover:text-indigo-400 transition-colors leading-tight">{project.title}</h3>
        
        <p className="text-zinc-500 text-xs sm:text-sm mb-6 line-clamp-3 flex-1 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
          {project.description}
        </p>

        {/* Unified Project Actions - Always Visible */}
        <div className="flex gap-4 mb-8">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="flex-1 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-white/5 hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl group/btn"
            >
              Code <Github size={16} className="group-hover/btn:rotate-12 transition-transform" />
            </a>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-indigo-500 hover:shadow-indigo-500/20 group/btn"
            >
              Live <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
        </div>
        
        {/* Tech Badges */}
        <div className="pt-6 border-t border-white/5 font-mono">
          <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-3">Technical Specs</div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.1, color: "#818cf8" }}
                title={`Developed using ${tech} architecture`}
                className="px-3 py-1 glass bg-white/5 text-zinc-500 sm:text-zinc-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border-white/5 cursor-default transition-colors group-hover:text-zinc-300"
              >
                {tech}
              </motion.span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] text-zinc-600 font-black self-center ml-2">+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default ProjectCard;
