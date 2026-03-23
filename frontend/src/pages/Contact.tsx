import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowUpRight } from "lucide-react";

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
    { icon: <Mail className="text-indigo-400" size={24} />, label: "Email", value: profile.email, link: `mailto:${profile.email}` },
    { icon: <Phone className="text-purple-400" size={24} />, label: "Phone", value: profile.phone, link: `tel:${profile.phone}` },
    { icon: <MapPin className="text-emerald-400" size={24} />, label: "Location", value: profile.location, link: "#" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative bg-black overflow-hidden">
      {/* Deep Obsidian Ambient Orbs (Subtle) */}
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[0%] w-[30%] h-[30%] bg-purple-500/5 blur-[180px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border-white/5">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Available for projects</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 font-display uppercase tracking-tight">
            Get in <span className="text-indigo-500">Touch</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed font-sans font-bold">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Details Stack */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-4">
              Contact Details
              <div className="h-[1px] flex-1 bg-zinc-800" />
            </h3>
            {contactInfo.map((info) => (
              <motion.a
                key={info.label}
                href={info.link}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] glass glass-hover flex items-center gap-6 relative"
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white text-sm font-bold truncate group-hover:text-indigo-400 transition-colors tracking-tight">{info.value}</p>
                </div>
                <ArrowUpRight className="absolute top-6 right-6 text-zinc-800 group-hover:text-white transition-colors" size={16} />
              </motion.a>
            ))}
            
            {/* Social Signal Placeholder */}
            <div className="mt-8 p-10 rounded-[2.5rem] glass border-white/10 flex flex-col items-center">
               <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 text-center">CURRENT STATUS</div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-bold text-white uppercase tracking-widest">Active - Responding Daily</span>
               </div>
            </div>
          </div>

          {/* Form Module */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass rounded-[3rem] p-8 sm:p-12 relative overflow-hidden backdrop-blur-3xl"
          >
            <div className="h-full w-full relative overflow-hidden">
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                    <CheckCircle className="text-emerald-500" size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Message Sent</h3>
                  <p className="text-zinc-500 mb-12 max-w-sm font-medium">Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-10 py-4 rounded-xl glass bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 active:scale-95 transition-all shadow-2xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-5 rounded-2xl glass bg-white/5 text-white placeholder:text-zinc-800 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm font-bold tracking-tight"
                        placeholder="Name"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-5 rounded-2xl glass bg-white/5 text-white placeholder:text-zinc-800 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all text-sm font-bold tracking-tight"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl glass bg-white/5 text-white placeholder:text-zinc-800 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                      placeholder="How can I help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-6 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 text-sm shadow-[0_0_40px_rgba(79,70,229,0.3)] shadow-indigo-600/20"
                  >
                    {status === "loading" ? (
                      <div className="flex items-center gap-3">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Sending Message...
                      </div>
                    ) : (
                      <>Send Message <Send size={18}/></>
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-red-500 text-center font-black text-[10px] uppercase tracking-widest animate-shake">Critical Transmission Error - Please Re-verify Input</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
