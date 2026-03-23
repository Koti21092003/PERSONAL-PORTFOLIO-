import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Home = () => {
  const [profile, setProfile] = useState({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    profileImageUrl: "https://picsum.photos/seed/koteswararao-v2/800/800",
    github: "#",
    linkedin: "#",
    email: "koteswararaobotchu007@gmail.com",
    resumeUrl: null as string | null,
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          name: data.name || "Botchu Koteswara Rao",
          role: data.role || "Full Stack Developer",
          heroBio: data.heroBio || "A passionate Full Stack Developer specializing in React.js and Angular 18",
          profileImageUrl: data.profileImageUrl || "https://picsum.photos/seed/koteswararao-v2/800/800",
          github: data.github || "#",
          linkedin: data.linkedin || "#",
          email: data.email || "koteswararaobotchu007@gmail.com",
          resumeUrl: data.resumeUrl || null,
        });
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center bg-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-pink-100/40 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-yellow-100/50 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8 shadow-sm">
              <span className="mr-2">👋</span> Welcome to my portfolio
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 mb-6 leading-[1.1] tracking-tight">
              Hi, I'm <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase">
                {profile.name}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-600 mb-10 max-w-xl leading-relaxed font-medium">
              {profile.heroBio}
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link
                to="/projects"
                className="w-full sm:w-auto group px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                View Projects
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 font-bold hover:bg-zinc-50 transition-all shadow-sm"
              >
                Contact Me
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-zinc-400">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <Github size={24} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Blob Shape Background */}
              <div className="absolute inset-0 bg-zinc-100 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] animate-blob overflow-hidden">
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200/50 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          66% { border-radius: 30% 70% 70% 30% / 50% 50% 30% 30%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
        .animate-blob {
          animation: blob 10s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
