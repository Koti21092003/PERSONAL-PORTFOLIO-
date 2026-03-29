import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "motion/react";
import { Search, Grid, List, Hexagon } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredProjects = projects
    .filter(p => 
      p.title.toLowerCase().includes(filter.toLowerCase()) || 
      p.techStack.some((t: string) => t.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort((a, b) => {
      const aStarred = a.isStarred || a.isFeatured;
      const bStarred = b.isStarred || b.isFeatured;
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Advanced Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16 perspective-1000"
        >
          <div className="inline-block glass-premium px-6 py-2 rounded-full mb-8 text-[11px] font-bold uppercase tracking-widest text-indigo-400">
             Featured Work & Case Studies
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            My <span className="text-indigo-500">Projects</span>
          </h2>
          <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mb-10" />
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium mb-12">
            A comprehensive index of production-grade applications, experimental prototypes, and architectural research.
          </p>
          
          {/* Real-time Technical Metadata Bar */}
          <div className="flex flex-wrap justify-center gap-10 sm:gap-14 mb-16 px-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Total Projects</span>
                <span className="text-2xl font-bold text-white tracking-widest">{projects.length.toString()}</span>
             </div>
             <div className="w-px h-10 bg-zinc-900 self-center hidden sm:block" />
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Live Status</span>
                <span className="text-2xl font-bold text-emerald-500 tracking-widest">ONLINE</span>
             </div>
             <div className="w-px h-10 bg-zinc-900 self-center hidden sm:block" />
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Last Updated</span>
                <span className="text-2xl font-bold text-indigo-500 tracking-widest">2024</span>
             </div>
          </div>
          
          {/* High-Tech Filtering Matrix */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 glass-premium p-3 rounded-[2.5rem] max-w-4xl mx-auto border-indigo-500/10 group transition-all duration-700 hover:border-indigo-500/30">
            <div className="relative flex-1 w-full sm:w-auto p-1">
               <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400/50 group-hover:scale-110 transition-transform">
                  <Hexagon size={18} className="animate-spin-slow" />
               </div>
                <input 
                  type="text" 
                  placeholder="SEARCH BY TITLE OR TECHNOLOGY..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-transparent border-none rounded-2xl py-4 pl-16 pr-6 text-xs font-bold text-white focus:outline-none transition-all placeholder:text-zinc-800 tracking-widest"
                />
            </div>
            <div className="flex gap-3 p-1 rounded-2xl border-none pr-4">
               <button className="p-3 text-indigo-400 rounded-xl bg-indigo-500/10 shadow-lg"><Grid size={18}/></button>
               <button className="p-3 text-zinc-800 hover:text-white transition-colors"><List size={18}/></button>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader />
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Projects...</span>
             </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 rounded-[4rem] glass-premium border-dashed border-zinc-900"
            >
              <div className="text-zinc-600 text-sm font-bold uppercase tracking-widest mb-4">No projects found for your search.</div>
              <button onClick={() => setFilter("")} className="text-indigo-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-all underline underline-offset-8">Clear Filters</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: any, index) => (
                  <motion.div 
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

       {/* Sub-surface Gradient */}
       <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[200px] rounded-full -z-10" />
    </div>
  );
};

export default Projects;
