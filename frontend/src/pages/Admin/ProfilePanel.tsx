import React from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Search, Plus, Trash2, Globe, Github, Linkedin, Mail, Upload, FileText, CheckCircle2, XCircle, Download, Layout, ShieldCheck, Terminal, Award, Box } from 'lucide-react';

interface ProfilePanelProps {
  profileSettings: any;
  setProfileSettings: (val: any) => void;
  newSkill: any;
  setNewSkill: (val: any) => void;
  onSave: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  loading: boolean;
  showToast: (message: string, type: any) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  profileSettings,
  setProfileSettings,
  newSkill,
  setNewSkill,
  onSave,
  onFileChange,
  onResumeChange,
  imagePreview,
  loading,
  showToast
}) => {
  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfileSettings({
        ...profileSettings,
        skills: [...profileSettings.skills, newSkill]
      });
      setNewSkill({ name: "", level: "Advanced", icon: "⚛️", isStarred: false });
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = profileSettings.skills.filter((_: any, i: number) => i !== index);
    setProfileSettings({ ...profileSettings, skills: updatedSkills });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(profileSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'portfolio_config_backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("Configuration backup generated", "success");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Profile Settings</h3>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Update your personal information</p>
        </div>
        
        <button
          onClick={onSave}
          disabled={loading}
          className="group relative px-10 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-emerald-600/30 active:scale-95 flex items-center gap-3 disabled:opacity-50"
        >
          <div className="w-6 h-6 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            {loading ? <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
          </div>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar: Photo and Key Info */}
        <div className="lg:col-span-4 space-y-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-1 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl"
           >
              <div className="p-8 rounded-[3.4rem] bg-zinc-950 flex flex-col items-center">
                 <div className="relative group/avatar mb-8">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse group-hover/avatar:bg-emerald-500/40 transition-all" />
                    <div className="relative w-48 h-60 rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
                       {imagePreview || profileSettings.profileImageUrl ? (
                          <img src={imagePreview || profileSettings.profileImageUrl} alt="Master Avatar" className="w-full h-full object-cover group-hover/avatar:scale-105 transition-all duration-1000" />
                       ) : (
                          <User size={64} className="text-zinc-800" />
                       )}
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                          <Upload size={32} className="text-white mb-3" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload Photo</span>
                          <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                       </label>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2 mb-8">
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{profileSettings.name || "Name Not Set"}</h4>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">{profileSettings.role || "Role Not Set"}</p>
                 </div>

                 <div className="w-full pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2">
                       <span>Ready to Work</span>
                       <button
                          type="button"
                          onClick={() => setProfileSettings({ ...profileSettings, isAvailableForHire: !profileSettings.isAvailableForHire })}
                          className={`relative w-12 h-6 rounded-full transition-all duration-500 p-1 ${
                            profileSettings.isAvailableForHire ? "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-800"
                          }`}
                       >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-500 ${
                            profileSettings.isAvailableForHire ? "translate-x-6" : "translate-x-0"
                          }`} />
                       </button>
                    </div>
                 </div>
              </div>
           </motion.div>

           <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 Social Media Links
              </label>
              <div className="space-y-4">
                 {[
                   { icon: <Github size={14} />, key: 'github', label: 'GitHub' },
                   { icon: <Linkedin size={14} />, key: 'linkedin', label: 'LinkedIn' },
                   { icon: <Mail size={14} />, key: 'email', label: 'Email' }
                 ].map((link) => (
                    <div key={link.key} className="space-y-1.5">
                       <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">{link.label}</span>
                       <div className="relative group/link">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/link:text-indigo-500 transition-colors">
                             {link.icon}
                          </div>
                          <input
                            type="text"
                            value={profileSettings[link.key]}
                            onChange={(e) => setProfileSettings({ ...profileSettings, [link.key]: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3.5 rounded-2xl text-white text-[11px] font-bold outline-none focus:border-indigo-500/50 transition-all font-mono"
                            placeholder="https://..."
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Main Form: Bio and Settings */}
        <div className="lg:col-span-8 space-y-12">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-10 rounded-[3.5rem] bg-zinc-900/20 border border-white/5 space-y-12"
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 py-5 px-6 rounded-2xl text-white font-bold outline-none focus:border-emerald-500/50 transition-all uppercase tracking-tight"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Job Title / Role</label>
                    <input
                      type="text"
                      value={profileSettings.role}
                      onChange={(e) => setProfileSettings({ ...profileSettings, role: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 py-5 px-6 rounded-2xl text-white font-bold outline-none focus:border-emerald-500/50 transition-all uppercase tracking-tight"
                    />
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Short Introduction (Home Page)</label>
                    <textarea
                      value={profileSettings.heroBio}
                      onChange={(e) => setProfileSettings({ ...profileSettings, heroBio: e.target.value })}
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 p-6 rounded-[2.5rem] text-zinc-400 font-bold text-xs leading-relaxed outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Detailed Bio (About Page)</label>
                    <textarea
                      value={profileSettings.aboutBio}
                      onChange={(e) => setProfileSettings({ ...profileSettings, aboutBio: e.target.value })}
                      rows={5}
                      className="w-full bg-black/40 border border-white/5 p-8 rounded-[3rem] text-zinc-400 font-bold text-xs leading-relaxed outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
                    />
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                 <button
                   onClick={exportData}
                   className="w-full py-5 rounded-3xl bg-zinc-950 border border-white/5 flex items-center justify-center gap-4 group/export hover:border-indigo-500/40 transition-all"
                 >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover/export:bg-indigo-600 group-hover/export:text-white transition-all">
                       <Download size={18} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Download Data Backup</p>
                       <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em]">Save your settings as a JSON file</p>
                    </div>
                 </button>
              </div>
           </motion.div>

           {/* Technical Matrix */}
           <div className="space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter">My Technical Skills</h4>
                 </div>
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/5">{profileSettings.skills.length} Skills</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <div className="relative group/skillinput flex-1">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/skillinput:text-amber-500 transition-colors">
                       <Award size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. React.js)"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="w-full bg-zinc-900/40 border border-white/5 pl-14 pr-6 py-5 rounded-[2rem] text-white font-bold text-xs outline-none focus:border-amber-500/50 transition-all uppercase tracking-widest"
                    />
                  </div>
                  <div className="flex gap-4">
                     <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                        className="bg-zinc-900/40 border border-white/5 px-8 py-5 rounded-[2rem] text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] outline-none cursor-pointer hover:border-white/20 transition-all"
                     >
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Beginner">Beginner</option>
                     </select>
                     <button 
                       onClick={addSkill}
                       className="w-16 h-16 rounded-[2rem] bg-amber-500 text-black flex items-center justify-center hover:bg-white transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                     >
                        <Plus size={24} />
                     </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {profileSettings.skills.map((skill: any, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-6 rounded-[2.5rem] bg-zinc-950 border border-white/5 group relative text-center hover:border-amber-500/30 transition-all overflow-hidden"
                    >
                       <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/10 group-hover:bg-amber-500/40 transition-all" />
                       <button 
                         onClick={() => removeSkill(index)}
                         className="absolute -top-1 -right-1 w-10 h-10 rounded-[1.5rem] bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 scale-75 group-hover:scale-100 shadow-xl"
                         title="Remove Skill"
                       >
                          <Trash2 size={14} />
                       </button>
                       <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{skill.icon}</div>
                       <div className="text-[10px] font-black text-white truncate mb-1 uppercase tracking-tight">{skill.name}</div>
                       <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:text-amber-600 transition-colors">{skill.level}</div>
                    </motion.div>
                  ))}
              </div>
           </div>

           {/* Professional Documents */}
           <div className="pt-12 border-t border-white/5">
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-24 h-24 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center shrink-0 shadow-2xl relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-50" />
                    <FileText className="text-indigo-500 relative z-10" size={40} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">My Resume</h4>
                       <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/30">PDF Format</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto md:mx-0">Upload your latest resume here.</p>
                 </div>
                 <label className="px-8 py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-xl active:scale-95 flex items-center gap-3">
                    <Upload size={16} /> {profileSettings.resumeUrl ? "Change Resume" : "Upload Resume"}
                    <input type="file" className="hidden" onChange={onResumeChange} accept=".pdf" />
                 </label>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
