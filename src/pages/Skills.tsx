import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Skills = () => {
  const [skills, setSkills] = useState([
    { name: "React", level: "Advanced", icon: "⚛️" },
    { name: "JavaScript", level: "Advanced", icon: "🟨" },
    { name: "TypeScript", level: "Intermediate", icon: "🟦" },
    { name: "Tailwind CSS", level: "Advanced", icon: "🎨" },
    { name: "Node.js", level: "Intermediate", icon: "🟢" },
    { name: "Express", level: "Intermediate", icon: "🚂" },
    { name: "Firebase", level: "Intermediate", icon: "🔥" },
    { name: "Git", level: "Advanced", icon: "🌿" },
    { name: "Figma", level: "Intermediate", icon: "📐" },
    { name: "Responsive Design", level: "Advanced", icon: "📱" },
  ]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Skills</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I've spent countless hours mastering these technologies to build high-quality web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-800/50 hover:border-white/20 transition-all text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest">
                {skill.level}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
