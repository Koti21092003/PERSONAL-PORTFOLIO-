import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Database, Calendar, ExternalLink } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CertificateCard from "../components/CertificateCard";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.1, y: -20, filter: "blur(10px)" }}
    transition={{ 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      scale: { type: "spring", damping: 25, stiffness: 120 }
    }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Certificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const sortedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => {
        // Prioritize starred certificates
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        // Then sort by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setCertificates(sortedData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
        {/* HUD Background Grid */}
        <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[0%] w-[35%] h-[35%] bg-purple-500/5 blur-[200px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto relative z-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block glass px-8 py-2 rounded-full mb-10 text-[11px] font-black uppercase tracking-widest text-indigo-400">
               Awards & Certificates
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Certificates</span>
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium mb-12 uppercase tracking-widest">
              A list of my verified learning achievements across web development, data science, and professional skills.
            </p>

            <div className="flex flex-wrap justify-center gap-10 sm:gap-20 mb-20 px-4">
               <div className="flex flex-col items-center group">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Achievement</span>
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5 group-hover:bg-amber-500/10 transition-colors">
                     <Award size={28} />
                  </div>
               </div>
               <div className="flex flex-col items-center group">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Verified</span>
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
                     <ShieldCheck size={28} />
                  </div>
               </div>
               <div className="flex flex-col items-center group">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Official</span>
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                     <Database size={28} />
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Grid */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.5em]">Loading certificates...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
              {certificates.map((certificate, index) => (
                <CertificateCard key={certificate.id || index} certificate={certificate} />
              ))}
              {certificates.length === 0 && (
                <div className="col-span-full py-40 glass rounded-[3rem] border-white/5 flex flex-col items-center gap-6">
                   <p className="text-zinc-500 font-black uppercase tracking-widest">No certifications loaded in system.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Certificates;
