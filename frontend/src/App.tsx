import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Certificates from "./pages/Certificates";
import Admin from "./pages/Admin";

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [brand, setBrand] = useState({ name: "Koteswara Rao", photo: "/favicon.png" });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const brandData = {
          name: data.name || "Koteswara Rao",
          photo: data.profileImageUrl || "/favicon.png"
        };
        setBrand(brandData);
        
        // Dynamic SEO & Branding
        document.title = `${brandData.name} | Portfolio`;
        
        // Dynamic Favicon
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = brandData.photo;
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Router>
      <div className="bg-black min-h-screen text-white relative overflow-hidden group/cursor selection:bg-indigo-500/30">
        
        {/* Global Tech Scanline */}
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          <div className="scanline" />
        </div>

        {/* Custom Coding Cursor */}
        <motion.div 
          animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
          transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
          className="fixed w-6 h-6 border border-indigo-500/50 rounded-full z-[999] pointer-events-none hidden lg:block"
        />
        <motion.div 
          animate={{ x: mousePos.x - 2, y: mousePos.y - 2 }}
          transition={{ type: "spring", damping: 40, stiffness: 400, mass: 0.2 }}
          className="fixed w-1 h-1 bg-white rounded-full z-[999] pointer-events-none hidden lg:block shadow-[0_0_10px_white]"
        />

        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Noise Grain Effect */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[99] bg-noise" />
      </div>
    </Router>
  );
}

export default App;
