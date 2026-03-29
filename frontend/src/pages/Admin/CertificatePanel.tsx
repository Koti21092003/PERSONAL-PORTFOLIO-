import React from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Search, MapPin } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          Manage Certificates
        </h3>
        <button
          onClick={onAdd}
          className="px-6 py-2.5 rounded-full bg-white text-black font-bold flex items-center hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Add Certificate
        </button>
      </div>

      <div className="mb-8 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by title or issuer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
            <p className="text-gray-500">No certificates found matching your search.</p>
          </div>
        ) : (
          filteredCerts.map((cert) => (
             <div key={cert.id} className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 group hover:border-emerald-500/30 transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center">
               <div className="aspect-square w-full sm:w-32 bg-black rounded-3xl overflow-hidden border border-white/5 scale-95 group-hover:scale-100 transition-transform duration-700">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
               </div>
               
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">Verified</span>
                     <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{cert.title}</h4>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium mb-4">{cert.issuer}</p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-2 text-zinc-600 text-[11px] font-medium">
                        <Calendar size={14} className="text-emerald-600" /> {cert.date}
                     </div>
                     <div className="flex-1" />
                     <div className="flex gap-2">
                        <button onClick={() => onEdit(cert)} className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-90" title="Edit Certificate">
                           <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(cert.id, cert.title)} className="p-2.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-90" title="Delete Certificate">
                           <Trash2 size={16} />
                        </button>
                        {cert.verifyLink && (
                           <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 transition-all" title="View Source">
                              <ExternalLink size={16} />
                           </a>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificatePanel;
