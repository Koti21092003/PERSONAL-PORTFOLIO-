import React from 'react';
import { Mail, Trash2, Calendar, User, CheckCircle2, EyeOff, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessagePanelProps {
  messages: any[];
  onDelete: (id: string, name: string) => void;
  onUpdateStatus: (id: string, currentStatus: string) => void;
  onUpdateAllStatus: () => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ messages, onDelete, onUpdateStatus, onUpdateAllStatus }) => {
  
  const formatDate = (dateInput: any) => {
    try {
      const date = dateInput?.toDate ? dateInput.toDate() : new Date(dateInput);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown Date';
    }
  };

  return (
    <div className="space-y-10">
      {/* Simple Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Messages</h3>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your incoming inquiries</p>
        </div>
        {messages.some(m => m.status === 'unread') && (
          <button
            onClick={onUpdateAllStatus}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Simple Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <div className="col-span-full py-20 text-center glass rounded-[2rem] border border-white/5">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={msg.id}
                className={`p-6 rounded-[2rem] glass border transition-all duration-500 flex flex-col h-full ${
                  msg.status === 'unread' ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    msg.status === 'unread' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    <User size={20} />
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${msg.email}`}
                      className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all"
                      title="Reply"
                    >
                      <Mail size={18} />
                    </a>
                    <button
                      onClick={() => onDelete(msg.id, msg.name)}
                      className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{msg.name}</h4>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <p className="text-zinc-500 text-[10px] font-bold truncate uppercase tracking-widest">{msg.email}</p>
                      {msg.phone && (
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{msg.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 min-h-[100px]">
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
                  <button
                    onClick={() => onUpdateStatus(msg.id, msg.status)}
                    className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                      msg.status === 'unread'
                        ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600 hover:text-white'
                        : 'bg-white/5 text-zinc-600 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {msg.status === 'unread' ? <CheckCircle2 size={14} /> : <EyeOff size={14} />}
                    {msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  </button>
                  
                  <div className="flex items-center justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                      <Clock size={10} /> {formatDate(msg.createdAt)}
                    </span>
                    <span className={`${msg.status === 'unread' ? 'text-indigo-500' : 'text-zinc-700'}`}>
                      {msg.status === 'unread' ? 'PENDING' : 'READ'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagePanel;
