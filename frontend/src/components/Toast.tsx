import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    warning: <AlertCircle className="text-amber-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/10',
    error: 'border-red-500/20 bg-red-500/10',
    warning: 'border-amber-500/20 bg-amber-500/10',
    info: 'border-blue-500/20 bg-blue-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`flex items-center gap-4 p-4 pr-6 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[type]}`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-white tracking-widest uppercase text-[10px]">{message}</p>
      <button 
        onClick={onClose}
        className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }: { toasts: any[], removeToast: (id: string) => void }) => (
  <div className="fixed bottom-10 right-10 z-[1000] flex flex-col gap-4">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </AnimatePresence>
  </div>
);
