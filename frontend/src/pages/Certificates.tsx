import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CertificateCard from "../components/CertificateCard";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "motion/react";
import { Search, Grid, List, Award, BadgeCheck } from "lucide-react";

const Certificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCertificates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching certificates:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredCertificates = certificates.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) || 
    c.issuer.toLowerCase().includes(filter.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* Deep Obsidian Ambient Orbs (Subtle) */}
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[0%] w-[30%] h-[30%] bg-purple-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block glass px-4 py-2 rounded-full mb-6 text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
            Credentials
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 font-display uppercase">
            Professional <span className="text-indigo-500">Certificates</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-12">
            A comprehensive list of professional certifications and educational achievements validating my core engineering competencies.
          </p>
          
          {/* Technical Metadata Bar */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12 px-4 whitespace-nowrap">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Assets</span>
                <span className="text-xl font-mono text-white tracking-widest">{certificates.length.toString().padStart(2, '0')}</span>
             </div>
             <div className="w-px h-8 bg-zinc-800 self-center hidden sm:block" />
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Verification Status</span>
                <span className="text-xl font-mono text-emerald-500 tracking-widest flex items-center gap-2">
                    <BadgeCheck size={18} />
                    VALIDATED
                </span>
             </div>
             <div className="w-px h-8 bg-zinc-800 self-center hidden sm:block" />
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Last Update</span>
                <span className="text-xl font-mono text-indigo-500 tracking-widest">2026-03-24</span>
             </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 glass p-2 rounded-2xl max-w-3xl mx-auto border-white/5 bg-transparent">
            <div className="relative flex-1 w-full sm:w-auto">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
               <input 
                 type="text" 
                 placeholder="QUERY CERTIFICATE DATABASE..."
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
                 className="w-full bg-transparent border-none rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold text-white focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-800 uppercase tracking-widest"
               />
            </div>
            <div className="flex gap-2 p-1 glass bg-white/5 rounded-xl border-none">
               <button className="p-2 text-indigo-400 rounded-lg bg-indigo-500/10"><Grid size={16}/></button>
               <button className="p-2 text-zinc-800 hover:text-white transition-colors"><List size={16}/></button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <Loader />
             <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Credential Repository...</span>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 rounded-[3.5rem] glass border-dashed border-zinc-800 flex flex-col items-center"
          >
            <div className="p-6 bg-zinc-900/50 rounded-full mb-6 text-zinc-700">
                <Award size={48} strokeWidth={1} />
            </div>
            <div className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No matching credentials identified.</div>
            <button onClick={() => setFilter("")} className="mt-4 text-indigo-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors underline decoration-2 underline-offset-4">Reset Query</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((cert: any) => (
                <motion.div 
                  layout
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true }}
                >
                  <CertificateCard certificate={cert} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

       {/* Decorative Gradient Blob */}
       <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full -z-10" />
    </div>
  );
};

export default Certificates;
