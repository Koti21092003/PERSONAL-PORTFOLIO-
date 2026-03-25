import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
          <Route path="/certificates" element={<PageWrapper><Certificates /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [brand, setBrand] = useState({ name: "Koteswara Rao", photo: "/favicon.png" });

  // High-Frequency Spring for 144Hz Logic
  const cursorSpring = { type: "spring", damping: 35, stiffness: 400, mass: 0.5 };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const brandData = {
          name: data.name || "Koteswara Rao",
          photo: data.profileImageUrl || "/favicon.png"
        };
        setBrand(brandData);
        document.title = `${brandData.name} | Full Stack Engineer`;
        
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
      // Small optimization for mouse move events
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Router>
      <div className="bg-black min-h-screen text-white relative overflow-x-hidden selection:bg-indigo-500/30">
        <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none" />
        <div className="fixed inset-0 bg-noise pointer-events-none z-[90]" />
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          <div className="scanline" />
        </div>

        {/* Dynamic Cursor Glow - Desktop Only */}
        <div 
          className="cursor-glow hidden lg:block"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            willChange: "left, top" 
          }}
        />

        {/* Interaction Cursor */}
        <motion.div 
          animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
          transition={cursorSpring}
          className="fixed w-6 h-6 border border-indigo-500/50 rounded-full z-[999] pointer-events-none hidden lg:block"
          style={{ willChange: "transform" }}
        />
        <motion.div 
          animate={{ x: mousePos.x - 2, y: mousePos.y - 2 }}
          transition={{ ...cursorSpring, damping: 50, stiffness: 600 }}
          className="fixed w-1 h-1 bg-white rounded-full z-[999] pointer-events-none hidden lg:block shadow-[0_0_10px_white]"
          style={{ willChange: "transform" }}
        />

        <Navbar />
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
