import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CertificateCard from "../components/CertificateCard";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "motion/react";
import { Award, ShieldCheck, Database, Search } from "lucide-react";

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

  const filteredCertificates = certificates
    .filter(c => 
      c.title.toLowerCase().includes(filter.toLowerCase()) || 
      c.issuer.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aStarred = a.isStarred || a.isFeatured;
      const bStarred = b.isStarred || b.isFeatured;
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[0%] w-[35%] h-[35%] bg-purple-500/5 blur-[200px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Advanced Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16 perspective-1000"
        >
          <div className="inline-block glass-premium px-8 py-2 rounded-full mb-10 text-[11px] font-bold uppercase tracking-widest text-indigo-400">
             Verified Qualifications & Honors
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            My <span className="text-indigo-500">Certificates</span>
          </h2>
          <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mb-10" />
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium mb-12">
            A showcase of my professional development, training, and academic achievements.
          </p>

          <div className="flex flex-wrap justify-center gap-10 sm:gap-20 mb-20 px-4">
             <div className="flex flex-col items-center group">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Achievement</span>
                <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
                   <Award size={28} />
                </div>
             </div>
             <div className="flex flex-col items-center group">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Verified</span>
                <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                   <ShieldCheck size={28} />
                </div>
             </div>
             <div className="flex flex-col items-center group">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Official</span>
                <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/5">
                   <Database size={28} />
                </div>
             </div>
          </div>

          {/* Logic Filtering Module */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative glass-premium p-2 rounded-[2rem] flex items-center border-indigo-500/10">
               <div className="pl-6 pr-4">
                  <Search className="text-zinc-700 group-hover:text-indigo-500 transition-colors duration-500" size={20} />
               </div>
                <input 
                  type="text" 
                  placeholder="SEARCH BY ISSUER OR TITLE..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-transparent border-none py-5 pr-8 text-xs font-bold text-white focus:outline-none placeholder:text-zinc-800 tracking-widest uppercase"
                />
               <div className="pr-6 text-[9px] font-mono text-indigo-500/30 font-black tracking-widest hidden sm:block">STATUS: ONLINE</div>
            </div>
          </div>
        </motion.div>

         {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
             <Loader />
             <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Certificates...</span>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-40 rounded-[4rem] glass-premium border-zinc-900 border-2">
            <h3 className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No results found</h3>
            <button onClick={() => setFilter("")} className="mt-8 px-10 py-3 rounded-full glass-premium text-indigo-500 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Reset Filter</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((cert: any, index) => (
                <motion.div 
                  layout
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <CertificateCard certificate={cert} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
