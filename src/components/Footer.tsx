import { Github, Linkedin, Mail, Twitter, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Footer = () => {
  const [links, setLinks] = useState({
    github: "#",
    linkedin: "#",
    email: "mailto:koteswararaobotchu007@gmail.com",
  });
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLinks({
          github: data.github || "#",
          linkedin: data.linkedin || "#",
          email: data.email ? `mailto:${data.email}` : "mailto:koteswararaobotchu007@gmail.com",
        });
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className={`${isHome ? "bg-white border-t border-zinc-100" : "bg-black border-t border-white/10"} py-12`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h3 className={`text-2xl font-bold ${isHome ? "text-indigo-600" : "bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"} mb-2`}>
            Koteswararao Botchu
          </h3>
          <p className={`${isHome ? "text-zinc-500" : "text-gray-400"} text-sm`}>
            BTech Student | Aspiring Frontend Developer
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-6">
          <div className="flex space-x-6">
            <a href={links.github} target="_blank" rel="noopener noreferrer" className={`${isHome ? "text-zinc-400 hover:text-indigo-600" : "text-gray-400 hover:text-white"} transition-colors`}>
              <Github size={24} />
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={`${isHome ? "text-zinc-400 hover:text-indigo-600" : "text-gray-400 hover:text-white"} transition-colors`}>
              <Linkedin size={24} />
            </a>
            <a href={links.email} className={`${isHome ? "text-zinc-400 hover:text-indigo-600" : "text-gray-400 hover:text-white"} transition-colors`}>
              <Mail size={24} />
            </a>
            <a href="#" className={`${isHome ? "text-zinc-400 hover:text-indigo-600" : "text-gray-400 hover:text-white"} transition-colors`}>
              <Twitter size={24} />
            </a>
          </div>
          <Link to="/admin" className={`flex items-center text-xs ${isHome ? "text-zinc-400 hover:text-zinc-600" : "text-gray-600 hover:text-gray-400"} transition-colors`}>
            <ShieldCheck size={14} className="mr-1" /> Admin Panel
          </Link>
        </div>
      </div>
      <div className={`mt-12 text-center ${isHome ? "text-zinc-400" : "text-gray-500"} text-xs`}>
        &copy; {new Date().getFullYear()} Koteswararao Botchu. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
