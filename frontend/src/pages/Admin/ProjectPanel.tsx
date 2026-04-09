import React from 'react';
import { Plus, Search, Filter, ChevronDown, Edit2, Trash2, ExternalLink, Github, Star } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          Manage Projects
        </h3>
        <button
          onClick={onAddProject}
          className="px-6 py-2.5 rounded-full bg-white text-black font-bold flex items-center hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Add Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="relative w-full md:w-64 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <select
            value={selectedTechStack}
            onChange={(e) => setSelectedTechStack(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900">All Technologies</option>
            {allTechStacks.map(tech => (
              <option key={tech} value={tech} className="bg-zinc-900">{tech}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="p-6 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5 relative bg-black">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                {project.isStarred && (
                  <div className="absolute top-3 right-3 p-1.5 bg-yellow-500 rounded-lg text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h4>
              <p className="text-zinc-500 text-xs mb-6 line-clamp-3 font-medium flex-1">{project.description}</p>
              
              <div className="flex gap-2 mb-6 flex-wrap">
                {(project.techStack || []).map((tech: string) => (
                   <span key={tech} className="text-[10px] font-bold text-blue-400/70 border border-blue-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">{tech}</span>
                ))}
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => onEditProject(project)}
                  className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                  title="Edit Project"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDeleteProject(project.id, project.title)}
                  className="p-3 rounded-2xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-90"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex-1" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.githubLink && project.githubLink !== "#") {
                      window.open(project.githubLink, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="p-3 text-zinc-600 hover:text-white transition-colors relative z-10 cursor-pointer" 
                  title="GitHub Repository"
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
                  className="p-3 text-zinc-600 hover:text-white transition-colors relative z-10 cursor-pointer" 
                  title="Live Preview"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;
