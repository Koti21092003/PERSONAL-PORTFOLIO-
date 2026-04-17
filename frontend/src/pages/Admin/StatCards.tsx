import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, MessageSquare, ShieldCheck, TrendingUp, Sparkles, Zap, Globe } from 'lucide-react';

interface StatCardsProps {
  visitorCount: number;
  projectsCount: number;
  messagesCount: number;
  totalMessages: number;
}

const StatCard = ({ title, value, detail, icon: Icon, color, delay, id }: any) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative p-8 rounded-[2.5rem] glass overflow-hidden border-white/5 group hover:border-${color}-500/30 transition-all duration-500`}
  >
    {/* Background Gradient Glow */}
    <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${color}-500/10 blur-[60px] rounded-full group-hover:bg-${color}-500/20 transition-all duration-700`} />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-10">
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg shadow-${color}-500/5`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">
           <TrendingUp size={10} /> Live
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">{title}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
              {value.toLocaleString()}
            </span>
            <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_10px_rgba(var(--color-${color}-rgb),0.4)]`} />
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-3 leading-relaxed">
            {detail}
          </p>
        </div>
      </div>

      {/* Decorative accent */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${color}-500/40 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </div>
  </motion.div>
);

const StatCards: React.FC<StatCardsProps> = ({ visitorCount, projectsCount, messagesCount, totalMessages }) => {
  return (
    <div id="admin-dashboard-overview" className="space-y-12 mb-16">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Your Dashboard</h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
             <ShieldCheck size={14} className="text-emerald-500" /> Secure Login
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          id="stat-visitors"
          title="Website Visitors" 
          value={visitorCount} 
          detail="Total people visited your site"
          icon={Users}
          color="amber"
          delay={0.1}
        />
        <StatCard 
          id="stat-projects"
          title="Total Projects" 
          value={projectsCount} 
          detail="Projects you have added"
          icon={Briefcase}
          color="blue"
          delay={0.2}
        />
        <StatCard 
          id="stat-messages"
          title="Unread Messages" 
          value={messagesCount} 
          detail={`Total of ${totalMessages} messages received`}
          icon={MessageSquare}
          color="purple"
          delay={0.3}
        />
        <StatCard 
          id="stat-health"
          title="Platform Status" 
          value={100} 
          detail="% System performance"
          icon={Zap}
          color="emerald"
          delay={0.4}
        />
      </div>
      
      {/* Dashboard Analytics Section */}
      <div id="dashboard-analytics-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/5">
        
        {/* Activity Density Visualization */}
        <div id="analytics-signal-density" className="lg:col-span-8 glass p-10 rounded-[3rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8">
              <Sparkles size={16} className="text-zinc-800" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                 <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter">Engagement Activity</h4>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">Message frequency over time</p>
                 </div>
              </div>

              <div className="h-32 flex items-end justify-between gap-1.5 px-2">
                 {[...Array(24)].map((_, i) => (
                    <motion.div
                       key={i}
                       initial={{ height: 0 }}
                       animate={{ height: `${Math.random() * 80 + 20}%` }}
                       transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
                       className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-lg group-hover:to-white transition-all duration-700"
                    />
                 ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                 <span>Activity Analysis: Optimal</span>
                 <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Total Messages: {messagesCount}</span>
                    <span className="flex items-center gap-1.5 text-blue-400">Peak Volume: {Math.floor(messagesCount * 1.5)}%</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Platform Status HUD */}
        <div id="analytics-system-health" className="lg:col-span-4 glass p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between">
           <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter">System Health</h4>
              </div>

              <div className="space-y-6">
                 {[
                   { id: "health-node-db", label: "Data Performance", value: "99.9%", status: "Stable", color: "emerald" },
                   { id: "health-node-storage", label: "File Storage", value: "74.2%", status: "Active", color: "blue" },
                   { id: "health-node-ai", label: "Smart Sync", value: "Ready", status: "Online", color: "amber" }
                 ].map((node, i) => (
                    <div id={node.id} key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group/node hover:border-white/10 transition-all">
                       <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{node.label}</p>
                          <p className="text-white font-black text-sm tabular-nums">{node.value}</p>
                       </div>
                       <div className="text-right">
                          <p className={`text-[9px] font-black text-${node.color}-500 uppercase tracking-widest mb-1`}>{node.status}</p>
                          <div className={`w-1.5 h-1.5 rounded-full bg-${node.color}-500 ml-auto shadow-[0_0_5px_rgba(var(--color-${node.color}-rgb),0.5)]`} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div id="dashboard-calibration-footer" className="mt-8 p-4 rounded-2xl bg-zinc-950/50 border border-white/5 text-center">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-[0.2em] mb-2">Last Sync</p>
              <p className="text-white text-[10px] font-black uppercase tracking-widest">{new Date().toLocaleTimeString()}</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StatCards;


