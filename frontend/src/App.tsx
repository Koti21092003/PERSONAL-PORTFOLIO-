import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domMax, motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { db } from "./firebase";
import { doc, onSnapshot, updateDoc, increment, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import UiverseLoader from "./components/UiverseLoader";
import BootScreen from "./components/BootScreen";
import { useHUDSound } from "./hooks/useHUDSound";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Skills = React.lazy(() => import("./pages/Skills"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Resume = React.lazy(() => import("./pages/Resume"));
const AIChat = React.lazy(() => import("./pages/AIChat"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Certificates = React.lazy(() => import("./pages/Certificates"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const CommandPalette = React.lazy(() => import("./components/CommandPalette"));
const PortfolioChat = React.lazy(() => import("./components/PortfolioChat"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <React.Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><UiverseLoader label="Loading..." /></div>}>
      <AnimatePresence mode="wait">
        {/* @ts-ignore */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </React.Suspense>
  );
}

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [brand, setBrand] = useState({ name: "Koteswara Rao", photo: "/favicon.png" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { playClick } = useHUDSound();

  // Global HUD audio: any button/link click gives subtle feedback (mobile included).
  // Component-level playClick calls are de-duplicated inside useHUDSound.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('button, a, [role="button"], input[type="submit"]')) {
        playClick();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [playClick]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Branding Synchronization Logic
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const brandData = {
          name: data.name || "Koteswara Rao",
          photo: data.profileImageUrl || "/favicon.png"
        };
        setBrand(brandData);
        document.title = `${brandData.name} | Full Stack Engineer`;

        // Inject SEO Meta Tags
        if (data.metaDescription) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', data.metaDescription);
        }

        if (data.metaKeywords) {
          let metaKey = document.querySelector('meta[name="keywords"]');
          if (!metaKey) {
            metaKey = document.createElement('meta');
            metaKey.setAttribute('name', 'keywords');
            document.head.appendChild(metaKey);
          }
          metaKey.setAttribute('content', data.metaKeywords);
        }

        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'icon');
          document.head.appendChild(link);
        }
        link.href = brandData.photo;
      }
    });

    const trackVisitor = async () => {
      const visitorDoc = doc(db, "analytics", "visitors");
      try {
        // Increment visitor count
        const docSnap = await getDoc(visitorDoc);
        if (docSnap.exists()) {
          await updateDoc(visitorDoc, { count: increment(1) });
        } else {
          await setDoc(visitorDoc, { count: 1 });
        }

        // Add to real-time logs
        let city = "Anonymous Region";
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.city) city = data.city;
        } catch (e) {
          console.log("Location detection bypassed.");
        }

        await addDoc(collection(db, "visitor_logs"), {
          city,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error("Analytics failure", e);
      }
    };
    trackVisitor();
  }, []);

  // High-Frequency Spring for 144Hz Logic
  const cursorSpring: any = { type: "spring", damping: 35, stiffness: 400, mass: 0.5 };

  return (
    <LazyMotion features={domMax}>
      <Router>
        <ScrollToTop />
        <div className="bg-black min-h-screen text-white relative overflow-x-hidden selection:bg-indigo-500/30">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:font-bold focus:text-sm"
          >
            Skip to content
          </a>
          <BootScreen />
          <div className="fixed inset-0 bg-mesh opacity-10 pointer-events-none" />
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
        <main id="main-content" className="relative z-10" tabIndex={-1}>
          <AnimatedRoutes />
        </main>
        <Footer />
        <React.Suspense fallback={null}>
          <PortfolioChat />
        </React.Suspense>

        {/* Offline Warning Overlay */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 bg-red-600/90 backdrop-blur-xl border border-red-500/50 rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <div className="flex flex-col">
                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Connection Interrupted</span>
                <span className="text-white/60 font-medium text-[8px] uppercase tracking-widest mt-0.5">Please check your network status. Attempting to reconnect...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </Router>
    </LazyMotion>
  );
}

export default App;
