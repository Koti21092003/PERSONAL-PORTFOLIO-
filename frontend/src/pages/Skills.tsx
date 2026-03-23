import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

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
    { name: "Express", level: "Intermediate", icon: "🚂", info: "Middleware, Auth" },
    { name: "Firebase", level: "Intermediate", icon: "🔥", info: "Firestore, Auth" },
    { name: "Git", level: "Advanced", icon: "🌿", info: "Workflows, Rebase" },
    { name: "Docker", level: "Intermediate", icon: "🐳", info: "Containers, Images" },
    { name: "AWS", level: "Beginner", icon: "☁️", info: "S3, EC2, Lambda" },
  ]);

  const [stats, setStats] = useState([
    { label: "Architecture", value: 92, color: "bg-indigo-500", detail: "SYSTEM_READY" },
    { label: "Frontend Dev", value: 98, color: "bg-blue-500", detail: "UI_STABLE" },
    { label: "Cloud Systems", value: 85, color: "bg-purple-500", detail: "LOGIC_SYNCED" }
  ]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
        if (data.stats && Array.isArray(data.stats)) {
          setStats(data.stats);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-grid">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block glass px-4 py-2 rounded-full mb-6 text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
            Tech Suite
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 font-display uppercase tracking-tight">
            Mastering the <span className="text-indigo-500">Stacks</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Continuously learning and evolving my skillset with the latest industry standards to build production-grade web applications.
          </p>
        </motion.div>

        {/* Technical Capabilities Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {[
            { label: "Architecture", value: 92, color: "bg-indigo-500" },
            { label: "Frontend Dev", value: 98, color: "bg-blue-500" },
            { label: "Cloud Systems", value: 85, color: "bg-purple-500" }
          ].map(stat => (
            <div key={stat.label} className="glass p-6 rounded-2xl border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-xs font-mono text-white">{stat.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.value}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${stat.color} shadow-[0_0_15px_rgba(79,70,229,0.5)]`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group glass glass-hover p-6 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8" />

              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                {skill.icon}
              </div>

              <h3 className="text-base font-bold text-white mb-2 font-display uppercase tracking-wider">{skill.name}</h3>

              <div className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest mb-3 ${levelColors[skill.level] || levelColors.Intermediate}`}>
                {skill.level}
              </div>

              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {skill.info || "Core Competency"}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Learning */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-10 rounded-[3rem] glass border-white/5 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center animate-bounce">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
          <div className="text-sm font-bold text-zinc-600 uppercase tracking-[0.3em]">
            Continuous Iteration & Skill Refinement
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Skills;
