import { Github, Linkedin, Mail, Twitter, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Footer = () => {
  const [links, setLinks] = useState({
    github: "#",
    linkedin: "#",
    email: "mailto:koteswararaobotchu007@gmail.com",
    name: "Botchu Koteswararao"
  });
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLinks({
          github: data.github || "#",
          linkedin: data.linkedin || "#",
          email: data.email ? `mailto:${data.email}` : "mailto:koteswararaobotchu007@gmail.com",
          name: data.name || "Botchu Koteswararao"
        });
      }
    });

    const unsubVisitors = onSnapshot(doc(db, "analytics", "visitors"), (doc) => {
      if (doc.exists()) {
        setVisitorCount(doc.data().count || 0);
      }
    });

    return () => {
      unsub();
      unsubVisitors();
    };
  }, []);

  return (
    <footer className="bg-black py-20 relative overflow-hidden bg-grid border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-20 mb-20">
          
          {/* Brand Visual */}
          <div className="max-w-xs">
            <Link to="/" className="text-3xl font-black text-white uppercase tracking-tighter font-display mb-6 block">
              Portfolio<span className="text-indigo-500">.</span>
            </Link>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
              Pushing the boundaries of digital interfaces with high-performance code and professional-grade layouts. Available for collaborative projects.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Github size={20}/>, link: links.github },
                { icon: <Linkedin size={20}/>, link: links.linkedin },
                { icon: <Mail size={20}/>, link: links.email }
              ].map((social, i) => (
                <a key={i} href={social.link} target="_blank" className="p-3 glass rounded-xl text-zinc-600 hover:text-white hover:bg-indigo-600 transition-all">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Connect */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">Navigation</h4>
              <nav className="flex flex-col gap-4">
                 {["About", "Skills", "Projects", "Contact"].map(item => (
                   <Link key={item} to={`/${item.toLowerCase()}`} className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">{item}</Link>
                 ))}
              </nav>
            </div>
            
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">Status</h4>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active</span>
                 </div>
                 <div className="flex items-center gap-2 opacity-30">
                   <div className="w-2 h-2 rounded-full bg-indigo-500" />
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deployed</span>
                 </div>
               </div>
            </div>

            <div className="space-y-6 col-span-2 sm:col-span-1">
               <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">Auth</h4>
               <Link to="/admin" className="glass px-4 py-2 rounded-xl inline-flex items-center text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                 <ShieldCheck size={14} className="mr-2" /> Gateway
               </Link>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {links.name.toUpperCase()}. DATA SECURE.
            </p>
            <div className="flex items-center gap-4 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">
               <span>RUNTIME: {Math.floor(Date.now()/1000/3600/24)}D:{Math.floor(Date.now()/1000/3600)%24}H</span>
               <div className="w-1 h-1 rounded-full bg-zinc-800" />
               <span>BUILD: 2.1.0-PREMIUM</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
               <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest animate-pulse">
                System Origin: Centurion University
               </span>
               <span className="text-[8px] font-mono text-zinc-900 uppercase tracking-widest mt-1">ACCESS_NODES: {visitorCount.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-zinc-900 hidden sm:block" />
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">State</span>
               <span className="text-[9px] text-emerald-900 font-mono">OPERATIONAL_NODE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full" />
    </footer>
  );
};

export default Footer;
