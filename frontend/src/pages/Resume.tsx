import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { Printer, Download, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

const Resume = () => {
  const [profile, setProfile] = useState<any>({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    aboutBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    journey: "",
    education: "B.Tech in Computer Science and Engineering",
    goal: "",
    passion: "",
    profileImageUrl: "/favicon.png",
    resumeUrl: null,
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "Srikakulam, AP, India",
    isAvailableForHire: true,
    skills: [],
    stats: [],
  });
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProfile = onSnapshot(doc(db, "settings", "profile"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile((prev: any) => ({ ...prev, ...data, skills: data.skills || prev.skills || [] }));
      }
      setLoading(false);
    });
    const unsubExp = onSnapshot(query(collection(db, "experiences"), orderBy("createdAt", "desc")), (snap) => {
      setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProfile();
      unsubExp();
    };
  }, []);

  useEffect(() => {
    setSkills(profile.skills || []);
  }, [profile.skills]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const url = profile.resumeUrl;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "KoteswaraRao_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Loading Resume Data...</div>
      </div>
    );
  }

  const contactItems = [
    { icon: <Mail size={12} />, label: profile.email, href: `mailto:${profile.email}` },
    { icon: <Phone size={12} />, label: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, "")}` },
    { icon: <MapPin size={12} />, label: profile.location, href: undefined },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto space-y-8 print:space-y-6">
        {/* Resume Sheet */}
        <div className="glass resume-sheet rounded-[2.5rem] p-8 sm:p-14 print:rounded-none print:border print:border-zinc-300 print:bg-white print:shadow-none relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-12 print:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-5xl font-black text-white print:text-black uppercase tracking-tighter leading-none">
                {profile.name}
              </h1>
              <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 print:text-indigo-700 text-[10px] font-black uppercase tracking-[0.3em]">
                {profile.role}
              </div>
              <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 text-zinc-500 print:text-zinc-700">
                {contactItems.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                    {c.icon} {c.href ? <a href={c.href} className="hover:text-white print:hover:text-black">{c.label}</a> : c.label}
                  </span>
                ))}
                {profile.github && <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><Github size={12} /> GitHub</span>}
                {profile.linkedin && <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><Linkedin size={12} /> LinkedIn</span>}
              </div>
            </div>

            {profile.profileImageUrl && (
              <div className="w-32 h-32 shrink-0 rounded-3xl overflow-hidden border border-white/10 print:border-zinc-300 bg-zinc-900 print:bg-zinc-100">
                <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover" loading="lazy" width={128} height={128} />
              </div>
            )}
          </div>

          {/* Summary */}
          {(profile.heroBio || profile.aboutBio) && (
            <section className="mb-12 print:mb-8">
              <h2 className="text-sm font-black text-white print:text-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/10 print:border-zinc-300">
                Professional Summary
              </h2>
              <p className="text-zinc-400 print:text-zinc-700 text-xs leading-relaxed font-medium">
                {profile.heroBio || profile.aboutBio}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-12 print:mb-8">
              <h2 className="text-sm font-black text-white print:text-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/10 print:border-zinc-300">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 print:text-indigo-700 text-[10px] font-black uppercase tracking-widest">
                    {s.name} {s.level ? `• ${s.level}` : ""}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          <section className="mb-12 print:mb-8">
            <h2 className="text-sm font-black text-white print:text-black uppercase tracking-[0.3em] mb-6 pb-2 border-b border-white/10 print:border-zinc-300">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experiences.length === 0 && (
                <p className="text-zinc-500 print:text-zinc-600 text-xs italic">No experience records found.</p>
              )}
              {experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm font-black text-white print:text-black uppercase tracking-wide">
                      {exp.title} <span className="text-indigo-400 print:text-indigo-700">@ {exp.company}</span>
                    </h3>
                    <span className="text-[10px] font-black text-zinc-500 print:text-zinc-600 uppercase tracking-widest">{exp.period}</span>
                  </div>
                  {exp.description && (
                    <p className="text-zinc-400 print:text-zinc-700 text-xs leading-relaxed font-medium mb-3">{exp.description}</p>
                  )}
                  {exp.tags && (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(exp.tags) ? exp.tags.map((t: string) => (
                        <span key={t} className="text-[9px] font-black text-zinc-400 print:text-zinc-600 border border-white/10 print:border-zinc-300 px-2 py-0.5 rounded uppercase tracking-widest">{t}</span>
                      )) : (
                        <span className="text-[9px] font-black text-zinc-400 print:text-zinc-600 border border-white/10 print:border-zinc-300 px-2 py-0.5 rounded uppercase tracking-widest">{exp.tags}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          {profile.education && (
            <section className="mb-4 print:mb-8">
              <h2 className="text-sm font-black text-white print:text-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/10 print:border-zinc-300">
                Education
              </h2>
              <p className="text-zinc-400 print:text-zinc-700 text-xs leading-relaxed font-medium">{profile.education}</p>
              {profile.journey && <p className="mt-2 text-zinc-500 print:text-zinc-600 text-xs leading-relaxed">{profile.journey}</p>}
            </section>
          )}
        </div>

        {/* Print Actions */}
        <div className="flex items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all active:scale-95"
          >
            <Printer size={16} /> Print Resume
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
