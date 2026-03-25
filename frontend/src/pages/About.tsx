import { motion } from "motion/react";
import { GraduationCap, Code, Briefcase, User, Calendar, ExternalLink, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";

const About = () => {
  const [profile, setProfile] = useState({
    aboutBio: "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    journey: "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development.",
    education: "B.Tech in CSE at Centurion University",
    role: "Full Stack Developer",
    goal: "Seeking Internships & Job Opportunities",
    passion: "Building modern, user-centric web apps",
    profileImageUrl: "/assets/profile.jpg",
    resumeUrl: "",
  });
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          aboutBio: data.aboutBio || profile.aboutBio,
          journey: data.journey || profile.journey,
          education: data.education || profile.education,
          role: data.role || profile.role,
          goal: data.goal || profile.goal,
          passion: data.passion || profile.passion,
          profileImageUrl: data.profileImageUrl || profile.profileImageUrl,
          resumeUrl: data.resumeUrl || "",
        });
      }
    });
    const unsubExp = onSnapshot(collection(db, "experiences"), (snapshot) => {
      setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub();
      unsubExp();
    };
  }, []);

  const details = [
    { icon: <GraduationCap className="text-indigo-400" size={24} />, title: "Education", description: profile.education, color: "from-indigo-500/20 to-transparent" },
    { icon: <Code className="text-purple-400" size={24} />, title: "Role", description: profile.role, color: "from-purple-500/20 to-transparent" },
    { icon: <Briefcase className="text-emerald-400" size={24} />, title: "Goal", description: profile.goal, color: "from-emerald-500/20 to-transparent" },
    { icon: <User className="text-orange-400" size={24} />, title: "Passion", description: profile.passion, color: "from-orange-500/20 to-transparent" },
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
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 font-display leading-tight">
              Engineering <span className="text-indigo-500">Excellence</span> <br /> 
              Through Digital Architecture
            </h2>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              {profile.aboutBio}
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              {coreSkills.map((cat) => (
                <div key={cat.name} className="glass px-5 py-2.5 rounded-2xl border-white/5">
                  <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">{cat.name}</span>
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

        {/* My Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 p-8 sm:p-12 rounded-[3rem] glass relative overflow-hidden group border border-white/5"
        >
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
            {/* Original Window Effect Photo */}
            <div className="shrink-0 relative group w-64 h-80 sm:w-80 sm:h-[450px]">
              {/* Decorative border */}
              <div className="absolute inset-[-15px] border border-dashed border-indigo-500/20 rounded-[2rem] animate-spin-slow opacity-50" />
              
              <div className="w-full h-full glass rounded-[2rem] p-1 bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-5 py-4 border-b border-white/5 bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                </div>
                <div className="p-4 h-[calc(100%-52px)] relative group/photo">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-950 relative border border-white/10 shadow-inner">
                    {/* Ghost Frame */}
                    <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl group-hover/photo:translate-x-1 group-hover/photo:translate-y-1 transition-transform duration-500" />
                    
                    {/* Focus Brackets */}
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
                    </div>

                    <img
                      src={profile.profileImageUrl}
                      alt="My Journey"
                      className="w-full h-full object-cover transition-all duration-1000 group-hover/photo:scale-110 relative z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-15" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-3xl font-black text-white font-display uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                My Journey
                <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              </h3>
              <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-light whitespace-pre-wrap italic">
                {profile.journey}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Experience & Education */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black text-white font-display uppercase tracking-[0.2em] relative">
              Experience
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-indigo-600 rounded-full" />
            </h3>
          </div>
          <div className="space-y-6">
            {experiences.length === 0 ? (
              <p className="text-zinc-500 text-center py-10">No experience added yet.</p>
            ) : (
              experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                          {exp.tags?.map((tag: any) => (
                            <span key={tag} className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 glass rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-xl">
                        <Calendar size={14} /> {exp.period}
                      </div>
                      {exp.link && (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
