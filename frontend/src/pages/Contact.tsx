import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowUpRight, Terminal } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profile, setProfile] = useState({
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "Srikakulam, AP, India",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          email: data.email || profile.email,
          phone: data.phone || profile.phone,
          location: data.location || profile.location,
        });
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  const contactInfo = [
    { icon: <Mail className="text-indigo-400" size={24} />, label: "Direct Email", value: profile.email, link: `mailto:${profile.email}`, color: "from-indigo-500/10 to-transparent" },
    { icon: <Phone className="text-purple-400" size={24} />, label: "Secure Line", value: profile.phone, link: `tel:${profile.phone}`, color: "from-purple-500/10 to-transparent" },
    { icon: <MapPin className="text-emerald-400" size={24} />, label: "Origin Location", value: profile.location, link: "#", color: "from-emerald-500/10 to-transparent" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* HUD Background elements */}
      <div className="absolute inset-0 bg-grid-faded opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24 perspective-1000"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 glass-premium rounded-full mb-8 border-white/5">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Ready to Connect</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tight">
            Get In <span className="text-indigo-500">Touch</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Have a project in mind or just want to say hi? Feel free to send me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Details Stack */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-4">
              Contact Info
              <div className="h-[1.5px] flex-1 bg-zinc-900" />
            </h3>
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.link}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[3rem] glass-premium flex items-center gap-6 relative overflow-hidden transition-all duration-700 hover:border-indigo-500/30"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
                  {info.icon}
                </div>
                <div className="min-w-0 relative z-10">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white text-sm font-bold truncate group-hover:text-indigo-400 transition-colors tracking-tight">{info.value}</p>
                </div>
                <ArrowUpRight className="absolute top-8 right-8 text-zinc-800 group-hover:text-white transition-colors" size={16} />
              </motion.a>
            ))}
            
            {/* Real-time Status Indicator */}
             <div className="mt-8 p-10 rounded-[3.5rem] glass-premium border-indigo-500/10 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-6 text-center flex items-center gap-2">
                   Availability Status
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Active & Responsive</span>
                </div>
             </div>
          </div>

          {/* Form Module */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-premium rounded-[4rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-indigo-500/5 group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex items-center justify-center mb-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <CheckCircle className="text-emerald-500" size={56} />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">Message Sent!</h3>
                  <p className="text-zinc-500 mb-12 max-w-sm font-medium leading-relaxed">Thank you for reaching out. Your message has been received and I will get back to you shortly.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-12 py-5 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black active:scale-95 transition-all shadow-2xl"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-8 py-6 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 transition-all text-sm font-bold"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-8 py-6 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 transition-all text-sm font-bold"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-8 py-6 rounded-[3rem] bg-white/5 border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 transition-all resize-none text-sm font-medium leading-relaxed"
                      placeholder="How can I help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-8 rounded-[2.5rem] bg-indigo-600 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 text-[12px] shadow-[0_20px_60px_rgba(79,70,229,0.3)] group/btn"
                  >
                    {status === "loading" ? (
                      <div className="flex items-center gap-3">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Sending Message...
                      </div>
                    ) : (
                      <>Send Message <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-red-500 text-center font-bold text-xs uppercase tracking-widest mt-4">Failed to send message. Please try again.</p>
                  )}
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
