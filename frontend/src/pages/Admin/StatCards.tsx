import React from 'react';

interface StatCardsProps {
  visitorCount: number;
  projectsCount: number;
  messagesCount: number;
}

const StatCards: React.FC<StatCardsProps> = ({ visitorCount, projectsCount, messagesCount }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-xl font-bold text-white mb-8">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 block">Website Visitors</span>
          <div className="text-4xl font-bold text-white">{visitorCount.toLocaleString()}</div>
          <p className="text-zinc-500 text-xs mt-2 font-medium">Total unique visitors</p>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4 block">Total Projects</span>
          <div className="text-4xl font-bold text-white">{projectsCount}</div>
          <p className="text-zinc-500 text-xs mt-2 font-medium">Projects in your portfolio</p>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-purple-500/10 border border-purple-500/20">
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-4 block">Messages</span>
          <div className="text-4xl font-bold text-white">{messagesCount}</div>
          <p className="text-zinc-500 text-xs mt-2 font-medium">New contact form submissions</p>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4 block">System Status</span>
          <div className="text-4xl font-bold text-white">Online</div>
          <p className="text-zinc-500 text-xs mt-2 font-medium">All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
