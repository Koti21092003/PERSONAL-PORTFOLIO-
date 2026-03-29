import React from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare, Terminal } from 'lucide-react';

interface MessagePanelProps {
  messages: any[];
  onDelete: (id: string, name: string) => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ messages, onDelete }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
          Recent Messages
        </h3>
        <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider">
           Inbox: {messages.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length === 0 ? (
          <div className="col-span-full py-40 text-center glass rounded-[3rem] border-white/5">
             <MessageSquare size={48} className="mx-auto text-zinc-800 mb-6" />
             <p className="text-zinc-600">Your inbox is currently empty.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/10 group flex flex-col h-full hover:border-indigo-500/30 transition-all duration-700 hover:shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    <User size={24} />
                 </div>
                 <button 
                   onClick={() => onDelete(msg.id, msg.name)}
                   className="p-3 rounded-2xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-lg"
                   title="Delete Message"
                 >
                    <Trash2 size={20} />
                 </button>
              </div>
              
              <div className="flex-1 space-y-6">
                 <div>
                    <span className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase mb-1 block">From</span>
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{msg.name}</h4>
                    <p className="text-zinc-500 font-medium text-xs truncate uppercase tracking-widest">{msg.email}</p>
                 </div>
                 
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 min-h-[120px] relative">
                    <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</div>
                 </div>
              </div>

              <div className="pt-8 mt-auto flex items-center justify-between border-t border-white/5 text-zinc-600 text-[10px] uppercase font-bold">
                 <div className="flex items-center gap-2">
                    <Calendar size={12} /> {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : new Date(msg.createdAt).toLocaleDateString()}
                 </div>
                 <div className="flex items-center gap-1 text-[9px] text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    Verified Receipt
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagePanel;
