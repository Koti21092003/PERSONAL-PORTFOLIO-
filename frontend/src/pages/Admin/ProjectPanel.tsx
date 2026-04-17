import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ChevronDown, Edit2, Trash2, ExternalLink, Github, Star, FolderOpen, Layout } from 'lucide-react';

interface ProjectPanelProps {
  projects: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedTechStack: string;
  setSelectedTechStack: (val: string) => void;
  allTechStacks: string[];
  onAddProject: () => void;
  onEditProject: (project: any) => void;
  onDeleteProject: (id: string, title: string) => void;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  projects,
  searchQuery,
  setSearchQuery,
  selectedTechStack,
  setSelectedTechStack,
  allTechStacks,
  onAddProject,
  onEditProject,
  onDeleteProject
}) => {
  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !selectedTechStack || (project?.techStack || []).includes(selectedTechStack);
    return matchesSearch && matchesTech;
  });

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">My Projects</h3>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{projects.length} Total Projects</p>
        </div>
        
        <button
          onClick={onAddProject}
          className="group relative px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-blue-600/30 active:scale-95 flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={14} />
          </div>
          Add New Project
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-blue-500 text-zinc-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            id="project-search-input"
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-700 font-medium text-sm"
          />
        </div>
        
        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-blue-500 text-zinc-600 transition-colors">
            <Filter size={18} />
          </div>
          <select
            id="project-tech-filter"
            value={selectedTechStack}
            onChange={(e) => setSelectedTechStack(e.target.value)}
            className="w-full pl-14 pr-10 py-5 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-white focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer font-medium text-sm uppercase tracking-widest"
          >
            <option value="" className="bg-zinc-950">Show All Tech</option>
            {allTechStacks.map(tech => (
              <option key={tech} value={tech} className="bg-zinc-950">{tech}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-24 text-center glass rounded-[3rem] border border-white/5 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-zinc-600">
              <FolderOpen size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-white font-black uppercase tracking-[0.2em]">No projects found</p>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest underline decoration-blue-500/30 underline-offset-4">Try searching for something else</p>
            </div>
          </motion.div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[3rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-all" />

              <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/5 relative bg-black group/img">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40" />
                
                {project.isStarred && (
                  <div className="absolute top-4 right-4 p-2 bg-amber-500 rounded-xl text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}

                {/* Scanning line effect on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30 opacity-0 group-hover/img:animate-scan-slow group-hover/img:opacity-100" />
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white tracking-tighter uppercase line-clamp-1">{project.title}</h4>
                </div>
              </div>
              
              <p className="text-zinc-500 text-xs mb-8 line-clamp-3 font-bold uppercase tracking-widest opacity-70 leading-relaxed flex-1">{project.description}</p>
              
              <div className="flex gap-2 mb-10 flex-wrap">
                {(project.techStack || []).map((tech: string) => (
                   <span key={tech} className="text-[8px] font-black text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl uppercase tracking-widest group-hover:border-blue-500/20 group-hover:text-blue-400 transition-colors">{tech}</span>
                ))}
              </div>

              <div className="flex gap-3 pt-8 border-t border-white/5">
                <div className="flex gap-2">
                  <button
                    id={`edit-project-${project.id}`}
                    onClick={() => onEditProject(project)}
                    className="p-4 rounded-2xl bg-white/5 text-zinc-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    title="Edit Project"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    id={`delete-project-${project.id}`}
                    onClick={() => onDeleteProject(project.id, project.title)}
                    className="p-4 rounded-2xl bg-white/5 text-zinc-400 hover:bg-red-600 hover:text-white transition-all active:scale-90"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex-1" />
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.githubLink && project.githubLink !== "#") {
                        window.open(project.githubLink, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-white/20 transition-all cursor-pointer" 
                    title="View GitHub"
                  >
                    <Github size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.liveLink && project.liveLink !== "#") {
                        window.open(project.liveLink, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-blue-500 hover:border-blue-500/40 shadow-inner transition-all cursor-pointer" 
                    title="Live Preview"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;

