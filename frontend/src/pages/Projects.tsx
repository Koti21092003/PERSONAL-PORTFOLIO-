import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Layers, Terminal } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ProjectCard from "../components/ProjectCard";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.1, y: -20, filter: "blur(10px)" }}
    transition={{ 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      scale: { type: "spring", damping: 25, stiffness: 120 }
    }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("");

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const sortedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => {
        // Prioritize starred projects
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        // Then sort by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setProjects(sortedData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !selectedTech || (project.techStack || []).includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  const allTech = Array.from(new Set(projects.flatMap(p => p.techStack || [])));

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block glass px-6 py-2 rounded-full mb-8 text-[11px] font-black uppercase tracking-widest text-indigo-400">
               A look into my work
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Projects</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium mb-12 uppercase tracking-widest">
              A selection of my best work, created with focus on design, speed, and user experience.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-16">
            <div className="relative flex-1 group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
               <input 
                 type="text"
                 placeholder="Search my projects..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-white font-mono text-xs tracking-widest focus:border-indigo-500/50 focus:bg-indigo-500/5 outline-none transition-all placeholder:text-zinc-700 uppercase"
               />
            </div>
            <div className="relative min-w-[240px] group">
               <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
               <select 
                 value={selectedTech}
                 onChange={(e) => setSelectedTech(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-10 text-white font-mono text-xs tracking-widest focus:border-indigo-500/50 outline-none transition-all appearance-none cursor-pointer uppercase"
               >
                 <option value="" className="bg-zinc-950 font-sans">ALL STACKS</option>
                 {allTech.map(tech => (
                   <option key={tech} value={tech} className="bg-zinc-950 font-sans">{tech}</option>
                 ))}
               </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.5em]">Loading projects...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-full py-40 glass rounded-[3rem] border-white/5 flex flex-col items-center gap-6">
                   <Terminal size={48} className="text-zinc-800" />
                   <div className="text-center">
                      <p className="text-zinc-500 font-black uppercase tracking-widest mb-2">No matching deployments found.</p>
                      <button onClick={() => {setSearchQuery(""); setSelectedTech("");}} className="text-indigo-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Reset Filters</button>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Projects;
