import React from 'react';
import { Save, User, MapPin, Search, Plus, Trash2, Globe, Github, Linkedin, Mail, Upload } from 'lucide-react';

interface ProfilePanelProps {
  profileSettings: any;
  setProfileSettings: (val: any) => void;
  newSkill: any;
  setNewSkill: (val: any) => void;
  onSave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  loading: boolean;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  profileSettings,
  setProfileSettings,
  newSkill,
  setNewSkill,
  onSave,
  onFileChange,
  imagePreview,
  loading
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

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          Profile Settings
        </h3>
        <button
          onClick={onSave}
          disabled={loading}
          className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95 flex items-center gap-2 group disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : (
            <>
              <Save size={18} className="group-hover:translate-x-0.5 transition-transform" /> Save Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Photo Upload */}
        <div className="space-y-6">
          <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Profile Photo</label>
          <div className="relative group w-48 h-64 sm:w-64 sm:h-80 mx-auto md:mx-0">
             <div className="absolute inset-0 bg-emerald-500/10 blur-[50px] rounded-full scale-110 -z-10 animate-pulse" />
             <div className="w-full h-full rounded-[2.5rem] bg-zinc-950 border border-white/10 overflow-hidden relative group/img">
                {imagePreview || profileSettings.profileImageUrl ? (
                   <img src={imagePreview || profileSettings.profileImageUrl} alt="Profile" className="w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-105" />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 italic text-sm">No photo uploaded</div>
                )}
                
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer">
                   <Upload size={32} className="text-white mb-2" />
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Change Photo</span>
                   <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                </label>
             </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-6">
             <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-colors"
                />
             </div>
             
             <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Current Profession</label>
                <input
                  type="text"
                  value={profileSettings.role}
                  onChange={(e) => setProfileSettings({ ...profileSettings, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-colors"
                />
             </div>
             
             <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Professional Goal</label>
                <input
                  type="text"
                  value={profileSettings.goal}
                  onChange={(e) => setProfileSettings({ ...profileSettings, goal: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-800"
                />
             </div>
        </div>
      </div>

      {/* Bios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
           <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Short Bio (Home Page)</label>
              <textarea
                value={profileSettings.heroBio}
                onChange={(e) => setProfileSettings({ ...profileSettings, heroBio: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white text-sm leading-relaxed outline-none focus:border-emerald-500 transition-colors"
                placeholder="A brief introduction for your home page..."
              />
           </div>
           
           <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block">Detailed Bio (About Page)</label>
              <textarea
                value={profileSettings.aboutBio}
                onChange={(e) => setProfileSettings({ ...profileSettings, aboutBio: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white text-sm leading-relaxed outline-none focus:border-emerald-500 transition-colors"
                placeholder="A detailed description for your about page..."
              />
           </div>
      </div>

      {/* Social Telemetry */}
      <div className="pt-12 border-t border-white/5">
          <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-8">Social Media Links</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Github size={18} />, key: 'github', color: 'text-white/60' },
                  { icon: <Linkedin size={18} />, key: 'linkedin', color: 'text-blue-400' },
                  { icon: <Mail size={18} />, key: 'email', color: 'text-red-400' }
                ].map((social) => (
                  <div key={social.key} className="relative group">
                     <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${social.color} transition-all`}>
                        {social.icon}
                     </div>
                     <input
                       type="text"
                       value={profileSettings[social.key]}
                       onChange={(e) => setProfileSettings({ ...profileSettings, [social.key]: e.target.value })}
                       className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white text-xs outline-none focus:border-emerald-500 transition-colors"
                       placeholder={`${social.key.charAt(0).toUpperCase() + social.key.slice(1)} URL`}
                     />
                  </div>
                ))}
          </div>
      </div>

      {/* Technical Matrix (Skills) */}
      <div className="pt-12 border-t border-white/5">
          <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-8">Technical Skills</label>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <input
                type="text"
                placeholder="Skill Name (e.g. React)..."
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-sm outline-none focus:border-emerald-500"
              />
              <div className="flex gap-4">
                 <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl text-zinc-400 text-sm outline-none cursor-pointer"
                 >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                 </select>
                 <button 
                   onClick={addSkill}
                   className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all flex items-center justify-center"
                 >
                    <Plus size={20} />
                 </button>
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {profileSettings.skills.map((skill: any, index: number) => (
                <div key={index} className="p-6 rounded-2xl bg-zinc-950 border border-white/5 group relative text-center">
                   <button 
                     onClick={() => removeSkill(index)}
                     className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                     title="Remove Skill"
                   >
                      <Trash2 size={12} />
                   </button>
                   <div className="text-2xl mb-3">{skill.icon}</div>
                   <div className="text-xs font-bold text-white truncate mb-1">{skill.name}</div>
                   <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{skill.level}</div>
                </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
