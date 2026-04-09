import { ExternalLink, Award, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

interface CertificateCardProps {
  certificate: {
    title: string;
    issuer: string;
    date: string;
    link: string;
    image: string;
    category?: string;
    description?: string;
    isStarred?: boolean;
    isFeatured?: boolean;
  };
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const ensureProtocol = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass glass-hover rounded-[2rem] overflow-hidden group flex flex-col h-full border-white/5 shadow-2xl relative z-10"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] overflow-hidden p-3 pb-0">
        <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-zinc-900/50 relative group-hover:shadow-[0_0_40px_rgba(79,70,229,0.2)] transition-all duration-700">
            {/* Design accents */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
               <div className="p-2 glass bg-black/40 backdrop-blur-md rounded-lg text-indigo-400">
                  <Award size={16} />
               </div>
            </div>

            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

            {/* Scan Line */}
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
            />

            {/* Star Badge */}
            {(certificate.isStarred || certificate.isFeatured) && (
              <div className="absolute top-4 right-4 z-30 transform hover:rotate-12 transition-transform">
                <div className="bg-yellow-500 text-black p-1.5 rounded-lg shadow-lg border border-yellow-400">
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
            )}
          </div>
      </div>

      {/* Info Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-indigo-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{certificate.date}</span>
          </div>
          {certificate.category && (
            <span className="px-3 py-1 glass bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-full border-none">
              {certificate.category}
            </span>
          )}
        </div>
        
        <h3 className="text-lg sm:text-xl font-black text-white mb-2 font-display group-hover:text-indigo-400 transition-colors leading-tight">{certificate.title}</h3>
        
        {certificate.description && (
          <p className="text-zinc-500 text-[11px] sm:text-xs mb-4 line-clamp-2 leading-relaxed">{certificate.description}</p>
        )}

        {/* Unified Certificate Action */}
        <div className="mt-4 mb-6">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = ensureProtocol(certificate.link);
                if (url && url !== "#") {
                  window.open(url, "_blank");
                }
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-white hover:text-black border border-indigo-500/0 hover:border-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group/btn cursor-pointer"
            >
              Verify Credential <ExternalLink size={16} className="group-hover/btn:rotate-12 transition-transform" />
            </button>
        </div>

        <div className="mt-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{certificate.issuer}</span>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/5 group-hover:border-indigo-500/20 transition-colors">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Verified Secure Artifact</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
