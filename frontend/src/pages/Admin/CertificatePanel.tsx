import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Search, ShieldCheck, Award } from 'lucide-react';

interface CertificatePanelProps {
  certificates: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onAdd: () => void;
  onEdit: (cert: any) => void;
  onDelete: (id: string, name: string) => void;
}

const CertificatePanel: React.FC<CertificatePanelProps> = ({
  certificates,
  searchQuery,
  setSearchQuery,
  onAdd,
  onEdit,
  onDelete
}) => {
  const filteredCerts = certificates.filter(c => 
    (c?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c?.issuer || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">My Certificates</h3>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{certificates.length} Total Certificates</p>
        </div>
        
        <button
          onClick={onAdd}
          className="group relative px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-indigo-600/30 active:scale-95 flex items-center gap-3"
        >
          <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Plus size={14} />
          </div>
          Add New Certificate
        </button>
      </div>

      {/* Search Section */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-indigo-500 text-zinc-600 transition-colors">
          <Search size={18} />
        </div>
        <input
          id="certificate-search-input"
          type="text"
          placeholder="Search by name or issuer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700 font-medium text-sm"
        />
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-24 text-center glass rounded-[3rem] border border-white/5 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-zinc-600">
              <Award size={32} />
            </div>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No certificates found</p>
          </motion.div>
        ) : (
          filteredCerts.map((cert, index) => (
             <motion.div 
                key={cert.id} 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 rounded-[3rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 group hover:border-indigo-500/30 transition-all duration-500 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden"
             >
                {/* Background Flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-all" />

                <div className="aspect-square w-full lg:w-40 bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-700 p-2 shrink-0">
                   <img src={cert.image} alt={cert.title} className="w-full h-full object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-1 w-full">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                         <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-black text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                               <ShieldCheck size={10} /> Verified
                            </span>
                            {cert.isStarred && (
                              <span className="text-[10px] font-black text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                <Award size={10} /> Featured
                              </span>
                            )}
                         </div>
                         <h4 className="text-xl font-black text-white tracking-tighter uppercase group-hover:text-indigo-400 transition-colors leading-none">{cert.title}</h4>
                      </div>
                   </div>

                   <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mb-6 opacity-60">{cert.issuer}</p>
                   
                   <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2.5 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                         <Calendar size={14} className="text-indigo-500" /> {cert.date || "No Date"}
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className="flex gap-2">
                           <button id={`edit-cert-${cert.id}`} onClick={() => onEdit(cert)} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center" title="Edit Certificate">
                              <Edit2 size={16} />
                           </button>
                           <button id={`delete-cert-${cert.id}`} onClick={() => onDelete(cert.id, cert.title)} className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center" title="Delete Certificate">
                              <Trash2 size={16} />
                           </button>
                         </div>
                         
                         {cert.link && (
                            <a 
                              href={cert.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center cursor-pointer" 
                              title="Verify Certificate"
                            >
                               <ExternalLink size={16} />
                            </a>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificatePanel;
