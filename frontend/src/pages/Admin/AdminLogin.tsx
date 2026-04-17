import React from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Lock, ArrowRight, Eye, EyeOff, XCircle } from "lucide-react";

interface AdminLoginProps {
  handleLogin: (e: React.FormEvent) => void;
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loginError: string;
  loading: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  handleLogin,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  loginError,
  loading
}) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#020205] flex items-center justify-center p-6 font-sans">
      {/* V2 High-Fidelity Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Advanced Multi-Layered Neural Mesh */}
        <div className="absolute inset-0 opacity-40">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 45, -45, 0],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_40%_30%,_rgba(79,70,229,0.18)_0%,_transparent_45%),radial-gradient(circle_at_70%_60%,_rgba(37,99,235,0.15)_0%,_transparent_40%),radial-gradient(circle_at_20%_80%,_rgba(99,102,241,0.1)_0%,_transparent_35%)] blur-[140px]" 
          />
        </div>
        
        {/* Dynamic Floating Particles */}
        <div className="absolute inset-0 z-0">
           {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0],
                  scale: [0, 1, 0],
                  y: [0, -200],
                  x: [0, (Math.random() - 0.5) * 100]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-blue-500 rounded-full blur-[2px]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100 + 20}%`
                }}
              />
           ))}
        </div>

        {/* Precision HUD Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Digital Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[500px] z-10"
      >
        {/* Surround Glow Accents */}
        <div className="absolute -inset-20 bg-blue-600/10 blur-[100px] rounded-full opacity-50 -z-10" />
        
        <div className="p-[1.5px] rounded-[3.8rem] bg-gradient-to-br from-white/20 via-white/5 to-transparent relative group">
          <div className="p-12 md:p-16 rounded-[3.7rem] bg-[#050508]/80 backdrop-blur-3xl overflow-hidden relative">
            
            {/* Internal Refraction Lines */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-500/5 to-transparent rotate-12 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 mb-10 relative"
                >
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Secure Connection</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="text-6xl font-black text-white tracking-tighter mb-4 uppercase"
                >
                   Portfolio <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Access</span>
                </motion.h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="space-y-8"
                >
                  <div className="relative group/input">
                    <label className="absolute -top-3 left-8 px-2 bg-[#050508] text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] z-20 group-focus-within/input:text-blue-500 transition-all border-l border-r border-white/5">Email Address</label>
                    <div className="relative">
                       <div className="absolute inset-0 bg-blue-500/0 group-focus-within/input:bg-blue-500/5 rounded-3xl transition-all duration-500" />
                       <UserIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                       <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-transparent border border-white/10 pt-7 pb-6 pl-20 pr-8 rounded-[2rem] text-sm text-white font-medium outline-none focus:border-blue-500/40 transition-all relative z-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group/input">
                    <label className="absolute -top-3 left-8 px-2 bg-[#050508] text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] z-20 group-focus-within/input:text-blue-500 transition-all border-l border-r border-white/5">Password</label>
                    <div className="relative">
                       <div className="absolute inset-0 bg-blue-500/0 group-focus-within/input:bg-blue-500/5 rounded-3xl transition-all duration-500" />
                       <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" size={20} />
                       <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-transparent border border-white/10 pt-7 pb-6 pl-20 pr-20 rounded-[2rem] text-sm text-white font-medium outline-none focus:border-blue-500/40 transition-all relative z-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors p-1.5 z-20"
                      >
                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} className="opacity-50" />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 flex items-center gap-5"
                  >
                     <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <XCircle size={24} className="text-white" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Login Error</span>
                        <span className="text-white text-xs font-bold">{loginError}</span>
                     </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="pt-6"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-6 rounded-[2.5rem] bg-white text-[#050508] font-black text-xs uppercase tracking-[0.5em] hover:bg-transparent hover:text-white transition-all duration-700 border-2 border-white shadow-[0_20px_60px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? (
                        <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Sign In <ArrowRight size={20} className="translate-x-1 group-hover:translate-x-4 transition-transform duration-700 ease-out" /></>
                      )}
                    </div>
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
