import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic resume URL
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists() && doc.data().resumeUrl) {
        setResumeUrl(doc.data().resumeUrl);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsub();
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const textColor = isHome && !scrolled ? "text-zinc-600 hover:text-indigo-600" : "text-gray-300 hover:text-white";
  const logoColor = isHome && !scrolled ? "text-indigo-600" : "bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent";
  const bgColor = scrolled 
    ? (isHome ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-black/80 backdrop-blur-md shadow-lg") 
    : "bg-transparent";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgColor} ${scrolled ? "py-4" : "py-6"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${logoColor}`}>
          KB.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${textColor} transition-colors text-sm font-medium`}
            >
              {link.name}
            </Link>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
            >
              Resume
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${isHome && !scrolled ? "text-zinc-900" : "text-white"}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-full left-0 w-full ${isHome ? "bg-white shadow-xl" : "bg-black/95"} backdrop-blur-xl py-8 flex flex-col items-center space-y-6 md:hidden border-t ${isHome ? "border-zinc-100" : "border-white/10"}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${isHome ? "text-zinc-600 hover:text-indigo-600" : "text-gray-300 hover:text-white"} text-lg font-medium`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold"
            >
              Download Resume
            </a>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
