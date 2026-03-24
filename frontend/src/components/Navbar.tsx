import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Certificates", path: "/certificates" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`relative glass rounded-[2rem] px-6 py-3 flex justify-between items-center transition-all duration-500 ${
          scrolled ? "bg-black/60 shadow-2xl border-white/10" : "bg-transparent border-transparent"
        }`}>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
              <Terminal size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white uppercase tracking-tighter font-display leading-none">
                Portfolio<span className="text-indigo-500">.</span>
              </span>
              <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1 hidden sm:block">v2.0.4-STABLE</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-white ${
                  isActive(link.path) ? "text-white" : "text-zinc-500"
                }`}
              >
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl -z-10"
                  />
                )}
                {link.name}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-zinc-800 mx-4" />
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden glass p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-24 left-4 right-4 md:hidden"
          >
            <div className="bg-zinc-950/98 backdrop-blur-none rounded-[2rem] p-6 space-y-2 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                    isActive(link.path)
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
