import { motion } from "motion/react";
import { GraduationCap, Code, Briefcase, User, Calendar, ExternalLink, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const About = () => {
  const [profile, setProfile] = useState({
    aboutBio: "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    journey: "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development.",
    education: "B.Tech in CSE at Centurion University",
    role: "Full Stack Developer",
    goal: "Seeking Internships & Job Opportunities",
    passion: "Building modern, user-centric web apps",
    profileImageUrl: "/assets/profile.jpg",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          aboutBio: data.aboutBio || profile.aboutBio,
          journey: data.journey || profile.journey,
          education: data.education || "B.Tech in CSE at Centurion University",
          role: data.role || "Full Stack Developer",
          goal: data.goal || "Seeking Internships & Job Opportunities",
          passion: data.passion || "Building modern, user-centric web apps",
          profileImageUrl: data.profileImageUrl || "/assets/profile.jpg",
        });
      }
    });
    return () => unsub();
  }, []);

  const details = [
    { icon: <GraduationCap className="text-indigo-400" size={24} />, title: "Education", description: profile.education, color: "from-indigo-500/20 to-transparent" },
    { icon: <Code className="text-purple-400" size={24} />, title: "Role", description: profile.role, color: "from-purple-500/20 to-transparent" },
    { icon: <Briefcase className="text-emerald-400" size={24} />, title: "Goal", description: profile.goal, color: "from-emerald-500/20 to-transparent" },
    { icon: <User className="text-orange-400" size={24} />, title: "Passion", description: profile.passion, color: "from-orange-500/20 to-transparent" },
  ];

  const experiences = [
    {
      title: "Dean's Dashboard Project",
      company: "Centurion University",
      period: "2023 - 2024",
      description: "Developed a comprehensive React.js-based dashboard for college administration, featuring intuitive interfaces and seamless integration with an Android application. Streamlined administrative data flow by 40%.",
      tags: ["React", "Firebase", "Android Integration"]
    },
    {
      title: "Full Stack Development Intern",
      company: "Wayspire",
      period: "June 2024 - Present",
      description: "Developing full-stack web applications using React.js, Angular, Node.js, and modern web technologies. Focus on building scalable, industry-standard architectures.",
      tags: ["Full Stack", "Industry Projects", "API Design"]
    },
  ];

  const coreSkills = [
    { name: "Frontend", skills: ["React", "Angular", "TypeScript", "Tailwind"] },
    { name: "Backend", skills: ["Node.js", "Python", "SQL", "Firebase"] },
    { name: "DevOps", skills: ["Git", "Docker", "AWS", "CI/CD"] }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-grid overflow-hidden">
      {/* Matrix Binary Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -1000] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex flex-wrap gap-12 font-mono text-[10px] text-indigo-500 whitespace-nowrap"
        >
          {Array(30).fill("01011001010111010101010101110010101101010").map((t, i) => (
             <div key={i} className="rotate-90 py-10 opacity-40">{t}</div>
          ))}
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 font-display lg:text-left text-center">
              Engineering <span className="text-indigo-500">Excellence</span> <br /> 
              Through Code
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed lg:text-left text-center">
              {profile.aboutBio}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3 lg:justify-start justify-center">
              {coreSkills.map((cat) => (
                <div key={cat.name} className="glass px-4 py-2 rounded-xl">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                </div>
              ))}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  download="Botchu_Koteswara_Rao_Resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 glass border-indigo-500/30 px-6 py-2 rounded-xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600/10 transition-all group shadow-2xl"
                >
                  Download Resume
                  <Download className="group-hover:translate-y-0.5 transition-transform text-indigo-400" size={14} />
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div className="relative group w-64 h-80 sm:w-80 sm:h-96">
               {/* Decorative border */}
               <div className="absolute inset-[-15px] border border-dashed border-indigo-500/20 rounded-[2rem] animate-spin-slow" />
               
               <div className="w-full h-full glass rounded-[2rem] p-1 bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden">
                 <div className="flex items-center gap-1 px-4 py-3 border-b border-white/5 bg-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
                 </div>
                 <div className="p-3 h-[calc(100%-40px)] relative group">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-950 relative border border-white/5">
                       {/* Ghost Frame */}
                       <div className="absolute inset-0 border border-indigo-500/10 rounded-xl group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                       
                       {/* Focus Brackets */}
                       <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-indigo-500" />
                          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-indigo-500" />
                          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-indigo-500" />
                          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-indigo-500" />
                       </div>

                       <img
                         src={profile.profileImageUrl}
                         alt="Koteswara Rao"
                         className="w-full h-full object-cover transition-all duration-700 relative z-10"
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-15" />
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {details.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-[2rem] glass glass-hover relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${detail.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {detail.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-2 font-display uppercase tracking-wider">{detail.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">{detail.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience & Education */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black text-white font-display uppercase tracking-[0.2em] relative">
              Experience
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-indigo-600 rounded-full" />
            </h3>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-[2.5rem] glass glass-hover border-white/5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-500">
                      <Briefcase className="text-white" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white font-display uppercase tracking-widest">{exp.title}</h4>
                      <p className="text-indigo-400 font-bold mb-3">{exp.company}</p>
                      <p className="text-zinc-400 leading-relaxed max-w-3xl mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 glass rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-xl">
                      <Calendar size={14} /> {exp.period}
                    </div>
                    <button className="text-white/40 hover:text-white transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
