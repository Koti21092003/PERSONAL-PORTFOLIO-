import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profile, setProfile] = useState({
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "kurudu village,kotabommali,srikakulam",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          email: data.email || "koteswararaobotchu007@gmail.com",
          phone: data.phone || "+91 8639245927",
          location: data.location || "kurudu village,kotabommali,srikakulam",
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
    { icon: <Mail className="text-blue-400" />, label: "Email", value: profile.email },
    { icon: <Phone className="text-purple-400" />, label: "Phone", value: profile.phone },
    { icon: <MapPin className="text-emerald-400" />, label: "Location", value: profile.location },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            {contactInfo.map((info) => (
              <div key={info.label} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 flex items-center space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 p-10 rounded-[40px] bg-zinc-900/50 border border-white/10">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle className="text-emerald-500 mb-6" size={64} />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 mb-8">Thank you for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="Your Email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Your Message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : (
                    <>
                      Send Message
                      <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
