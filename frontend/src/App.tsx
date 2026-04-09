import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { db } from "./firebase";
import { doc, onSnapshot, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Skills = React.lazy(() => import("./pages/Skills"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Certificates = React.lazy(() => import("./pages/Certificates"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-indigo-500/20 rounded-full border-t-indigo-500 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">HUD_LDR</div>
    </div>
  </div>
);
import CommandPalette from "./components/CommandPalette";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.1, y: -20, filter: "blur(10px)" }}
    transition={{
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a more premium 'opening' feel
      scale: { type: "spring", damping: 25, stiffness: 120 }
    }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <React.Suspense fallback={<Loader />}>
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
            <Route path="/certificates" element={<PageWrapper><Certificates /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </React.Suspense>
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

  // Visitor Counter Logic
  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = sessionStorage.getItem("portfolio_v4_visited");
      if (!hasVisited) {
        try {
          const visitorRef = doc(db, "analytics", "visitors");
          const snap = await getDoc(visitorRef);
          if (!snap.exists()) {
            await setDoc(visitorRef, { count: 1 });
          } else {
            await updateDoc(visitorRef, { count: increment(1) });
          }
          sessionStorage.setItem("portfolio_v4_visited", "true");
        } catch (e) {
          console.error("Tracking Error:", e);
        }
      }
    };
    trackVisitor();
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
        <CommandPalette />
        <ScrollToTop />
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
