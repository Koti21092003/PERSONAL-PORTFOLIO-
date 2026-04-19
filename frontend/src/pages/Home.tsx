import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, Download, Code2, Cpu, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import LogicStream from "../components/LogicStream";
import Magnetic from "../components/Magnetic";

const Home = () => {
  const [profile, setProfile] = useState({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    profileImageUrl: "/assets/profile.jpg",
    github: "#",
    linkedin: "#",
    email: "koteswararaobotchu007@gmail.com",
    resumeUrl: null as string | null,
    isAvailableForHire: true,
    skills: [] as { name: string, icon: string }[],
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          name: data.name || "Botchu Koteswara Rao",
          role: data.role || "Full Stack Developer",
          heroBio: data.heroBio || "A passionate Full Stack Developer specializing in React.js and Angular 18",
          profileImageUrl: data.profileImageUrl || "/assets/profile.jpg",
          github: data.github || "#",
          linkedin: data.linkedin || "#",
          email: data.email || "koteswararaobotchu007@gmail.com",
          resumeUrl: data.resumeUrl || null,
          isAvailableForHire: data.isAvailableForHire !== undefined ? data.isAvailableForHire : true,
          skills: data.skills || [],
        });
      }
    });
    return () => unsub();
  }, []);

  const floatingSymbols = useMemo(() => {
    const symbols = ["{ }", "=>", "</>", "const", "[ ]", "map()", "&&", "git clone", "npm install"];
    return symbols.map((sym, i) => ({
      id: i,
      sym,
      y: [Math.random() * 1000, Math.random() * -500],
      x: [Math.random() * 1000, Math.random() * 500],
      duration: 25 + Math.random() * 25,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
  }, []);

  return (
    <div className="min-h-screen pt-28 lg:pt-24 pb-12 flex items-center bg-black relative overflow-hidden">
      <LogicStream />
      {/* Advanced HUD Background - Multi-layered Data Streams */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="hud-line" style={{ left: '10%', animationDuration: '15s' }} />
        <div className="hud-line" style={{ left: '50%', animationDuration: '8s' }} />
        <div className="hud-line" style={{ left: '90%', animationDuration: '20s' }} />
      </div>

      {/* Deep Obsidian Ambient Orbs (Subtle) */}
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[180px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[0%] w-[30%] h-[30%] bg-purple-500/10 blur-[180px] rounded-full -z-10" />

      {/* Logic Constellation - Drifting Code Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5 opacity-20">
        {floatingSymbols.map(({ id, sym, y, x, duration, left, top }) => (
          <motion.div
            key={id}
            animate={{
              y,
              x,
              rotate: [0, 360],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-indigo-500/30 font-mono text-xl font-black whitespace-nowrap"
            style={{ left, top }}
          >
            {sym}
          </motion.div>
        ))}
      </div>

      {/* Side HUD - Technical Indicators */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-12 hidden xl:flex opacity-30 pointer-events-none">
        <div className="flex flex-col gap-2">
          <Code2 size={16} className="text-indigo-400" />
          <div className="h-20 w-px bg-gradient-to-b from-indigo-500/50 to-transparent" />
        </div>
        <div className="flex flex-col gap-2">
          <Cpu size={16} className="text-purple-400" />
          <div className="h-20 w-px bg-gradient-to-b from-purple-500/50 to-transparent" />
        </div>
        <div className="flex flex-col gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 py-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* User Info & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left order-last lg:order-first"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center gap-4 mb-6 lg:mb-10 h-10"
            >
              <div className="h-0.5 w-12 bg-indigo-500/50 rounded-full" />
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] font-display">👋 Welcome to my portfolio</span>
              <div className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ready to Work</span>
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter font-display mb-8 lg:mb-10 uppercase relative">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="block"
              >
                Hi, I'm <br />
              </motion.span>
              <div className="relative inline-block mt-4 group">
                <span className="bg-gradient-to-r from-white via-white to-indigo-500 bg-clip-text text-transparent block relative z-10 transition-all duration-700 group-hover:tracking-wider">
                  {profile.name}
                </span>

                {/* Clean Underline Accent */}
                <div className="h-1 w-24 bg-indigo-600 rounded-full mt-4 transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(79,70,229,0.3)]" />
              </div>
            </h1>

            <div className="text-lg md:text-2xl text-zinc-400 mb-8 lg:mb-12 max-w-xl leading-relaxed font-medium">
              <span className="text-indigo-400 font-bold uppercase text-xs mr-4 tracking-widest opacity-70 underline decoration-indigo-500/20">Brief Intro</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                {profile.heroBio || "Full Stack Developer ready to work and build impactful solutions."}
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-6 bg-indigo-500 ml-2 align-middle"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 lg:mb-16">
              <Magnetic>
                <Link
                  to="/projects"
                  className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group"
                >
                  View Projects
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl glass border-white/5 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-white/5 transition-all active:scale-95"
                >
                  Get In Touch
                </Link>
              </Magnetic>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  download="KoteswaraRao_Resume.pdf"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                >
                  <Download size={14} className="mr-2" />
                  Download CV
                </a>
              )}
            </div>

            {/* Social Proof */}
              <div className="flex items-center gap-8">
                <div className="flex gap-5">
                  {[
                    { icon: <Github size={22} />, link: profile.github },
                    { icon: <Linkedin size={22} />, link: profile.linkedin },
                    { icon: <Mail size={22} />, link: `mailto:${profile.email}` }
                  ].map((s, i) => (
                    <Magnetic key={i} strength={0.3}>
                      <a href={s.link} target="_blank" className="text-zinc-500 hover:text-white transition-all transform hover:-translate-y-1 block">
                        {s.icon}
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </motion.div>

          {/* Global Aesthetic Profile Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex justify-center relative order-first lg:order-last mb-12 lg:mb-0"
          >
            <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full scale-110 -z-10 animate-pulse" />

            <div className="relative w-full max-w-[320px] sm:max-w-none sm:w-[420px] sm:h-[580px] lg:w-[500px] lg:h-[680px] aspect-[4/5] sm:aspect-auto group perspective-1000">
              {/* Elegant Glass Card with 3D Tilt Effect */}
              <motion.div
                whileHover={{ rotateY: 10, rotateX: -5 }}
                className="w-full h-full glass-premium rounded-[3.5rem] p-4 shadow-2xl overflow-hidden relative border-white/20 transition-all duration-700"
              >
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative group">
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Attractive Hover Info */}
                  <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 lg:translate-y-4 opacity-100 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500">
                    <div className="glass p-4 lg:p-6 rounded-2xl border-white/10 shadow-2xl backdrop-blur-3xl">
                      <div className="text-[10px] lg:text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Architecture</div>
                      <div className="text-sm lg:text-lg font-bold text-white tracking-tight">Full Stack Engineering</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Performance Marquee (Subtle) */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 hidden 2xl:block pointer-events-none opacity-20">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[1em] whitespace-nowrap">DEVELOPER</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Persistent One-Click Resume Access */}
      {profile.resumeUrl && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden lg:block"
        >
          <a
            href={profile.resumeUrl}
            download="KoteswaraRao_Resume.pdf"
            className="group flex items-center bg-indigo-600 hover:bg-white text-white hover:text-black transition-all duration-500 rounded-l-2xl py-6 px-4 shadow-[0_0_30px_rgba(79,70,229,0.3)] border-y border-l border-indigo-500/50"
          >
            <div className="flex flex-col items-center gap-4">
              <Download size={20} className="animate-bounce" />
              <div className="flex flex-col [writing-mode:vertical-lr] items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Download Resume</span>
                <div className="h-4 w-px bg-current opacity-20" />
                <span className="text-[8px] font-mono opacity-50">RESUME.PDF</span>
              </div>
            </div>
          </a>
        </motion.div>
      )}

      {/* High-Fidelity Technical Identity Marquee */}
      <div className="absolute bottom-0 w-full bg-white/5 border-t border-white/5 py-6 overflow-hidden pointer-events-none backdrop-blur-sm">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-24 text-[10px] font-bold text-white/5 uppercase tracking-[0.5em]"
        >
          {Array(10).fill("DESIGN . DEVELOPMENT . ARCHITECTURE . PROBLEM SOLVING . CREATIVITY . INNOVATION").map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
