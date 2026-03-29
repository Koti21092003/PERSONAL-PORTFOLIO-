import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Code2, Cpu, Globe, Database, Shield } from "lucide-react";

const levelColors: Record<string, string> = {
  Advanced: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  Beginner: "bg-zinc-500/20 text-zinc-400 border-zinc-500/20",
};

const Skills = () => {
  const [skills, setSkills] = useState([
    { name: "React", level: "Advanced", icon: "⚛️", info: "Hooks, SPA, Redux" },
    { name: "JavaScript", level: "Advanced", icon: "🟨", info: "ES6+, Async/Await" },
    { name: "TypeScript", level: "Intermediate", icon: "🟦", info: "Interfaces, Generics" },
    { name: "Tailwind CSS", level: "Advanced", icon: "🎨", info: "JIT, Custom Config" },
    { name: "Node.js", level: "Intermediate", icon: "🟢", info: "Express, REST API" },
  ]);

  const [stats, setStats] = useState([
    { label: "Frontend Architecture", value: 92, icon: <Globe size={18} />, color: "bg-indigo-500" },
    { label: "Backend Systems", value: 85, icon: <Database size={18} />, color: "bg-purple-500" },
    { label: "Security & DevOps", value: 78, icon: <Shield size={18} />, color: "bg-emerald-500" }
  ]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.skills && Array.isArray(data.skills)) {
          const sortedSkills = [...data.skills].sort((a: any, b: any) => {
            const aStarred = a.isStarred || a.isFeatured;
            const bStarred = b.isStarred || b.isFeatured;
            if (aStarred && !bStarred) return -1;
            if (!aStarred && bStarred) return 1;
            return 0;
          });
          setSkills(sortedSkills);
        }
        if (data.stats && Array.isArray(data.stats)) {
          // Map to include icons if possible or default
          setStats(data.stats.map((s: any) => ({ ...s, icon: s.icon ? s.icon : <Code2 size={18} /> })));
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* Advanced Background Grid */}
      <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Technical Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24 perspective-1000"
        >
          <div className="inline-block glass-premium px-6 py-2 rounded-full mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Technical Arsenal
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 font-display uppercase tracking-tighter">
            Core <span className="text-indigo-500">Capabilities</span>
          </h2>
          <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full mb-8" />
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Deploying a sophisticated suite of technologies to architect scalable, resilient, and performant digital solutions.
          </p>
        </motion.div>

        {/* High-Impact Performance Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-premium p-10 rounded-[3rem] border-white/5 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 font-bold glass">
                  {stat.icon}
                </div>
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              
              <div className="flex items-end justify-between mb-4">
                <div className="text-4xl font-black text-white font-mono tracking-tighter">
                  {stat.value}<span className="text-indigo-500 text-xl">%</span>
                </div>
                <div className="text-[10px] font-mono text-indigo-400/50 uppercase">Optimization_Level</div>
              </div>

              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.value}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className={`h-full ${stat.color} rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Sphere Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group glass-premium p-8 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 hover:border-indigo-500/30"
            >
              {/* Data Accents */}
              <div className="absolute top-4 left-4 w-1 h-4 bg-indigo-500/20 rounded-full" />
              <div className="absolute top-4 left-4 w-4 h-1 bg-indigo-500/20 rounded-full" />

              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-700 glow-indigo">
                {skill.icon}
              </div>

              <h3 className="text-lg font-black text-white mb-2 font-display uppercase tracking-widest">{skill.name}</h3>

              <div className={`px-4 py-1 rounded-lg border text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${levelColors[skill.level] || levelColors.Intermediate}`}>
                {skill.level}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 w-full">
                 <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                   {skill.info || "Core Competency"}
                 </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Footer Technical Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-12 rounded-[4rem] glass-premium border-white/5 flex flex-col items-center gap-6 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-faded opacity-10" />
          <div className="w-16 h-16 rounded-full border border-indigo-500/20 flex items-center justify-center animate-pulse relative z-10">
            <Cpu className="text-indigo-400" size={24} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-black text-white uppercase tracking-[0.5em] mb-2">
              Iterative Logic Engine
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Uptime: 99.99% . Version: 4.1.0_PRO
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
