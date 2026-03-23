import { ExternalLink, Github, Layers } from "lucide-react";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    techStack: string[];
    githubLink: string;
    liveLink: string;
    image: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
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
            {/* Advanced Coder Brackets */}
            <div className="absolute inset-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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

            {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center gap-4">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-90"
              aria-label="GitHub Repository"
            >
              <Github size={24} />
            </a>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-xl active:scale-90"
              aria-label="Live Preview"
            >
              <ExternalLink size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Narrative Container */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} className="text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Featured Project</span>
        </div>
        
        <h3 className="text-2xl font-black text-white mb-4 font-display group-hover:text-indigo-400 transition-colors">{project.title}</h3>
        
        <p className="text-zinc-500 text-sm mb-8 line-clamp-3 flex-1 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
          {project.description}
        </p>
        
        {/* Tech Badges */}
        <div className="pt-6 border-t border-white/5 font-mono">
          <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-3">Technical Specs</div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 glass bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg border-white/5 group-hover:text-white transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] text-zinc-600 font-black self-center ml-2">+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
