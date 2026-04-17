import React, { useState, useEffect, useRef } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useHUDSound } from "../hooks/useHUDSound";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, MessageSquare, Upload, Image as ImageIcon, Settings as SettingsIcon, User as UserIcon, Layout, ShieldCheck, Briefcase, Terminal, EyeOff, Search, Star, Edit2, Trash2, Plus, DownloadCloud } from "lucide-react";
import Loader from "../components/Loader";
import StatCards from "./Admin/StatCards";
import ProjectPanel from "./Admin/ProjectPanel";
import CertificatePanel from "./Admin/CertificatePanel";
import ExperiencePanel from "./Admin/ExperiencePanel";
import MessagePanel from "./Admin/MessagePanel";
import ProfilePanel from "./Admin/ProfilePanel";
import { ToastContainer } from "../components/Toast";
import { useAdminData, OperationType } from "../hooks/useAdminData";
import AdminLogin from "./Admin/AdminLogin";
import { compressImage } from "../utils/imageOptimizer";
import { generateResume } from '../utils/resumeGenerator';
const Admin = () => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const {
    user, loading, activeTab, setActiveTab,
    projects, messages, certificates, experiences,
    visitorCount, systemStatus, setSystemStatus,
    toasts, showToast, removeToast,
    handleDelete, handleFirestoreError
  } = useAdminData();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  const { playClick, playError } = useHUDSound();

  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [expFormData, setExpFormData] = useState({ title: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "", tags: "" });

  const [profileSettings, setProfileSettings] = useState<any>({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer (React & Angular 18 Specialist)",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    aboutBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    journey: "Currently pursuing my B.Tech in CSE at Centurion University.",
    resumeUrl: "",
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "Srikakulam, AP, India",
    isAvailableForHire: true,
    skills: [],
    stats: []
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    image: "",
    isStarred: false,
    architecture: "",
    challenges: ""
  });

  const [certFormData, setCertFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    link: "",
    image: "",
    category: "",
    description: "",
    isStarred: false,
  });

  const [newSkill, setNewSkill] = useState({ name: "", level: "Advanced", icon: "⚛️", isStarred: false });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      const unsubSettings = onSnapshot(doc(db, "settings", "profile"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfileSettings((prev: any) => ({
            ...prev,
            ...data,
            skills: data.skills || prev.skills,
            stats: data.stats || prev.stats,
            resumeUrl: data.resumeUrl || prev.resumeUrl
          }));
        }
      });
      return () => unsubSettings();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab && tabsRef.current) {
      const activeElement = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOperationLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error: any) {
      setLoginError("Invalid email or password");
      playError();
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    showToast("Session terminated successfully.", "info");
  };


  const handleMessageStatusUpdate = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
      await updateDoc(doc(db, "messages", id), { status: nextStatus });
      showToast(`Signal status updated: ${nextStatus.toUpperCase()}`, "success");
    } catch (error: any) {
      showToast(`Protocol failure: ${error.message}`, "error");
    }
  };

  const handleMarkAllMessagesRead = async () => {
    const unread = messages.filter(m => m.status === 'unread');
    if (unread.length === 0) return;
    
    setSystemStatus("BATCH_UPDATING_MESSAGES...");
    try {
      const batchPromises = unread.map(msg => 
        updateDoc(doc(db, "messages", msg.id), { status: 'read' })
      );
      await Promise.all(batchPromises);
      showToast("All transmissions acknowledged.", "success");
      setSystemStatus("SYSTEM_SYNCHRONIZED");
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, "messages");
    }
  };


  const handleFileUpload = async (file: File, pathPrefix: string = "uploads") => {
    // FOR NON-IMAGES (PDF, DOCX), UPLOAD DIRECTLY TO STORAGE
    if (!file.type.startsWith('image/')) {
      const storageRef = ref(storage, `${pathPrefix}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }

    // FOR IMAGES, OPTIMIZE AND THEN UPLOAD TO STORAGE
    try {
      const compressedBlob = await compressImage(file);
      const storageRef = ref(storage, `${pathPrefix}/${Date.now()}_${file.name.split('.')[0]}.webp`);
      const snapshot = await uploadBytes(storageRef, compressedBlob, { contentType: 'image/webp' });
      return await getDownloadURL(snapshot.ref);
    } catch (error: any) {
      throw new Error(`Compression Protocol Failure: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSystemStatus("ENCODING_MEDIA...");

    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        // BYPASS FIREBASE STORAGE - SAVE AS BASE64 STRING
        imageUrl = await handleFileUpload(selectedFile);
      }

      const projectData = {
        ...formData,
        image: imageUrl,
        techStack: typeof formData.techStack === 'string' ? formData.techStack.split(",").map(s => s.trim()) : formData.techStack,
        createdAt: editingProject ? editingProject.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingProject) {
        await updateDoc(doc(db, "projects", editingProject.id), projectData);
      } else {
        await addDoc(collection(db, "projects"), projectData);
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setSelectedFile(null);
      setImagePreview(null);
      setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "", isStarred: false, architecture: "", challenges: "" });
      showToast("Project saved successfully!", "success");
    } catch (error: any) {
      console.error("Error saving project:", error);
      showToast(`Failed to save project: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setSystemStatus("STABLE");
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setSystemStatus("ENCODING_AVATAR...");
      try {
        const url = await handleFileUpload(file, "profile");
        setProfileSettings({ ...profileSettings, profileImageUrl: url });
        await setDoc(doc(db, "settings", "profile"), { profileImageUrl: url }, { merge: true });
        showToast("Profile image updated!", "success");
      } catch (error: any) {
        showToast(`Upload failed: ${error.message}`, "error");
      } finally {
        setUploading(false);
        setSystemStatus("STABLE");
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setSystemStatus("ENCODING_DOC_CORE...");
      try {
        const url = await handleFileUpload(file, "resumes");
        await setDoc(doc(db, "settings", "profile"), { resumeUrl: url }, { merge: true });
        setProfileSettings({ ...profileSettings, resumeUrl: url });
        showToast("Resume saved securely!", "success");
      } catch (error: any) {
        showToast(`Upload failed: ${error.message}`, "error");
      } finally {
        setUploading(false);
        setSystemStatus("STABLE");
      }
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSystemStatus("SYNCING_MASTER_NODE...");
    try {
      await setDoc(doc(db, "settings", "profile"), profileSettings, { merge: true });
      showToast("Profile Settings synchronized", "success");
    } catch (error: any) {
      showToast(`Sync failed: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setSystemStatus("STABLE");
    }
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSystemStatus("ENCODING_EXPERIENCE_NODE...");

    try {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      };

      const period = expFormData.isCurrent 
        ? `${formatDate(expFormData.startDate)} - Present`
        : `${formatDate(expFormData.startDate)} - ${formatDate(expFormData.endDate)}`;

      const expData = {
        ...expFormData,
        period,
        tags: expFormData.tags.split(",").map(t => t.trim()).filter(t => t),
        createdAt: editingExperience ? editingExperience.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingExperience) {
        await updateDoc(doc(db, "experiences", editingExperience.id), expData);
      } else {
        await addDoc(collection(db, "experiences"), expData);
      }

      setIsExpModalOpen(false);
      setEditingExperience(null);
      setExpFormData({ title: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "", tags: "" });
      showToast("Experience node integrated", "success");
    } catch (error: any) {
      console.error("Error saving experience:", error);
      showToast(`Failed to save experience: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setSystemStatus("STABLE");
    }
  };

  const handleExpDelete = async (id: string) => {
    if (window.confirm("ARE_YOU_SURE_DELETING_THIS_NODE?")) {
      try {
        await deleteDoc(doc(db, "experiences", id));
      } catch (error) {
        console.error("Error deleting experience:", error);
      }
    }
  };

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSystemStatus("ENCODING_CREDENTIAL...");

    try {
      let imageUrl = certFormData.image;
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const certData = {
        ...certFormData,
        image: imageUrl,
        createdAt: editingCertificate ? editingCertificate.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingCertificate) {
        await updateDoc(doc(db, "certificates", editingCertificate.id), certData);
      } else {
        await addDoc(collection(db, "certificates"), certData);
      }

      setIsCertModalOpen(false);
      setEditingCertificate(null);
      setSelectedFile(null);
      setImagePreview(null);
      setCertFormData({ title: "", issuer: "", date: "", link: "", image: "", category: "", description: "", isStarred: false });
      showToast("Credential saved successfully!", "success");
    } catch (error: any) {
      console.error("Error saving certificate:", error);
      showToast(`Failed to save certificate: ${error.message}`, "error");
    } finally {
      setUploading(false);
      setSystemStatus("STABLE");
    }
  };

  const handleCertificateDelete = async (id: string) => {
    if (window.confirm("EXECUTE_DELETE_CERTIFICATE?")) {
      try {
        await deleteDoc(doc(db, "certificates", id));
      } catch (error) {
        console.error("Error deleting certificate:", error);
      }
    }
  };

  if (loading) return <Loader />;

   if (!user) {
    return (
      <AdminLogin 
        handleLogin={handleLogin}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginError={loginError}
        loading={isOperationLoading}
      />
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-2">
                 Management Dashboard
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                Portfolio <span className="text-blue-500">Admin</span>
              </h1>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
               Secure Session • <span className="text-white/40 lowercase italic font-medium">{user?.email}</span>
            </p>
          </div>
        </div>
      </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                <div className="relative w-16 h-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center transition-transform hover:rotate-6 hover:scale-105 group cursor-pointer overflow-hidden z-10">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <UserIcon className="text-blue-500 relative z-10 group-hover:text-white transition-colors" size={28} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-3xl font-black text-white tracking-tighter">Welcome <span className="text-blue-500">Back</span></h2>
                   <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest">Administrator</div>
                </div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   Admin Dashboard • {user?.email}
                </p>
              </div>
            </div>
            {/* Mobile Logout - Quick Access */}
            <button 
              onClick={handleLogout}
              className="md:hidden p-4 rounded-3xl bg-red-600/10 text-red-500 active:scale-90"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>

          <div 
            ref={tabsRef}
            className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide no-scrollbar w-full md:w-auto -mx-2 px-2 scroll-smooth"
          >
            <button
              id="tab-dashboard"
              data-tab-id="dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group ${activeTab === "dashboard" ? "bg-amber-600 text-white shadow-xl shadow-amber-600/30 border border-amber-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              id="tab-projects"
              data-tab-id="projects"
              onClick={() => setActiveTab("projects")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group ${activeTab === "projects" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 border border-blue-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Layout size={16} /> Projects
            </button>
            <button
              id="tab-certificates"
              data-tab-id="certificates"
              onClick={() => setActiveTab("certificates")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group ${activeTab === "certificates" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <ShieldCheck size={16} /> Certificates
            </button>
            <button
              id="tab-experiences"
              data-tab-id="experiences"
              onClick={() => setActiveTab("experiences")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group ${activeTab === "experiences" ? "bg-orange-600 text-white shadow-xl shadow-orange-600/30 border border-orange-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Briefcase size={16} /> Experience
            </button>
            <button
              id="tab-messages"
              data-tab-id="messages"
              onClick={() => setActiveTab("messages")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group relative ${activeTab === "messages" ? "bg-purple-600 text-white shadow-xl shadow-purple-600/30 border border-purple-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <MessageSquare size={16} /> Messages
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full border border-black shadow-lg font-black">
                  {messages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </button>
            <button
              id="tab-settings"
              data-tab-id="settings"
              onClick={() => setActiveTab("settings")}
              className={`px-8 py-4 rounded-3xl font-black transition-all whitespace-nowrap text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 group ${activeTab === "settings" ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400" : "bg-white/5 text-zinc-500 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
            >
              <SettingsIcon size={16} /> Profile
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          <StatCards 
            visitorCount={visitorCount} 
            projectsCount={projects.length} 
            messagesCount={messages.filter(m => m.status === 'unread').length} 
            totalMessages={messages.length}
          />
        ) : activeTab === "projects" ? (
          <ProjectPanel 
            projects={projects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTechStack={selectedTechStack}
            setSelectedTechStack={setSelectedTechStack}
            allTechStacks={Array.from(new Set(projects.flatMap(p => Array.isArray(p.techStack) ? p.techStack : [])))}
            onAddProject={() => {
              setEditingProject(null);
              setSelectedFile(null);
              setImagePreview(null);
              setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "", isStarred: false, architecture: "", challenges: "" });
              setIsModalOpen(true);
            }}
            onEditProject={(project) => {
              setEditingProject(project);
              setFormData({
                title: project.title,
                description: project.description,
                techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : (project.techStack || ""),
                githubLink: project.githubLink,
                liveLink: project.liveLink,
                image: project.image,
                isStarred: project.isStarred || false,
                architecture: project.architecture || "",
                challenges: project.challenges || ""
              });
              setImagePreview(project.image);
              setIsModalOpen(true);
            }}
            onDeleteProject={(id, title) => handleDelete(id, title, "projects")}
          />
        ) : activeTab === "certificates" ? (
          <CertificatePanel 
            certificates={certificates}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAdd={() => {
              setEditingCertificate(null);
              setIsCertModalOpen(true);
            }}
            onEdit={(cert) => {
              setEditingCertificate(cert);
              setCertFormData({
                title: cert.title,
                issuer: cert.issuer,
                date: cert.date,
                link: cert.link,
                image: cert.image,
                category: cert.category || "",
                description: cert.description || "",
                isStarred: cert.isStarred || false,
              });
              setIsCertModalOpen(true);
            }}
            onDelete={(id, name) => handleDelete(id, name, "certificates")}
          />
        ) : activeTab === "experiences" ? (
          <ExperiencePanel 
            experiences={experiences}
            onAdd={() => {
              setEditingExperience(null);
              setIsExpModalOpen(true);
            }}
            onEdit={(exp) => {
              setEditingExperience(exp);
              setExpFormData({
                title: exp.title,
                company: exp.company,
                startDate: exp.startDate || "",
                endDate: exp.endDate || "",
                isCurrent: exp.isCurrent || false,
                description: exp.description,
                tags: Array.isArray(exp.tags) ? exp.tags.join(", ") : exp.tags,
              });
              setIsExpModalOpen(true);
            }}
            onDelete={(id, title) => handleDelete(id, title, "experiences")}
          />
        ) : activeTab === "messages" ? (
          <MessagePanel 
            messages={messages}
            onUpdateStatus={handleMessageStatusUpdate}
            onUpdateAllStatus={handleMarkAllMessagesRead}
            onDelete={(id, name) => handleDelete(id, name, "messages")}
          />
        ) : activeTab === "settings" ? (
          <ProfilePanel 
            profileSettings={profileSettings}
            setProfileSettings={setProfileSettings}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            onSave={handleSettingsUpdate}
            onFileChange={handleProfileImageUpload}
            onResumeChange={handleResumeUpload}
            imagePreview={imagePreview}
            loading={uploading}
            showToast={showToast}
          />
        ) : null}

        {/* Mobile Command Bar (Docks to bottom on small screens) */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
           <div className="bg-zinc-950/80 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              {[
                { id: "dashboard", icon: <LayoutDashboard size={20} /> },
                { id: "projects", icon: <Layout size={20} /> },
                { id: "certificates", icon: <ShieldCheck size={20} /> },
                { id: "experiences", icon: <Briefcase size={20} /> },
                { id: "messages", icon: <MessageSquare size={20} /> },
                { id: "settings", icon: <SettingsIcon size={20} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    playClick();
                  }}
                  className={`p-3 rounded-2xl transition-all relative ${
                    activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.id === 'messages' && messages.filter(m => m.status === 'unread').length > 0 && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  )}
                </button>
              ))}
           </div>
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* Fixed Quick Logout Button */}
        <div className="fixed bottom-10 right-10 z-[100] group hidden md:flex">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 bg-zinc-950/80 backdrop-blur-xl border border-red-500/20 px-8 py-5 rounded-[2.5rem] text-red-500 font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 hover:text-white hover:border-red-400 transition-all duration-500 hover:scale-105 active:scale-95 group-hover:shadow-red-600/20"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 flex items-center justify-center transition-colors group-hover:bg-white/20">
              <LogOut size={20} />
            </div>
            Sign Out
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl p-10 rounded-[40px] bg-zinc-900 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold text-white mb-8">{editingProject ? "Edit Project" : "Add New Project"}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">GitHub Link</label>
                    <input
                      type="url"
                      required
                      value={formData.githubLink}
                      onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Live Link</label>
                    <input
                      type="url"
                      required
                      value={formData.liveLink}
                      onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Engineering Logic (Architecture)</label>
                    <textarea
                      rows={2}
                      value={formData.architecture}
                      onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                      placeholder="e.g. Microservices, MVC, Client-Server..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Technical Challenges & Resolution</label>
                    <textarea
                      rows={2}
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                      placeholder="e.g. Optimized database queries by 40% using indexing..."
                    />
                  </div>
                </div>

                {/* Starred Toggle for Project */}
                <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 mb-2">
                   <input 
                     type="checkbox" 
                     id="isStarredProject"
                     checked={formData.isStarred}
                     onChange={(e) => setFormData({ ...formData, isStarred: e.target.checked })}
                     className="w-5 h-5 accent-yellow-500 rounded-md cursor-pointer"
                   />
                   <label htmlFor="isStarredProject" className="text-sm font-bold text-yellow-500 cursor-pointer flex items-center gap-2">
                     <Star size={14} fill={formData.isStarred ? "currentColor" : "none"} />
                     Mark as Featured (Always Show First)
                   </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Project Image</label>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="text-gray-400 mb-3" size={40} />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 800x400px)</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <Loader />
                        <span className="ml-2">Uploading...</span>
                      </>
                    ) : (
                      editingProject ? "Update Project" : "Create Project"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {isCertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCertModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl p-10 rounded-[40px] bg-zinc-900 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold text-white mb-8">{editingCertificate ? "Edit Certificate" : "Add New Certificate"}</h3>
              <form onSubmit={handleCertificateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Certificate Title</label>
                    <input
                      type="text"
                      required
                      value={certFormData.title}
                      onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Issuing Organization (optional)</label>
                    <input
                      type="text"
                      value={certFormData.issuer}
                      onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Starred Toggle for Certificate */}
                <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 mb-2">
                   <input 
                     type="checkbox" 
                     id="isStarredCert"
                     checked={certFormData.isStarred}
                     onChange={(e) => setCertFormData({ ...certFormData, isStarred: e.target.checked })}
                     className="w-5 h-5 accent-yellow-500 rounded-md cursor-pointer"
                   />
                   <label htmlFor="isStarredCert" className="text-sm font-bold text-yellow-500 cursor-pointer flex items-center gap-2">
                     <Star size={14} fill={certFormData.isStarred ? "currentColor" : "none"} />
                     Mark as Featured (Always Show First)
                   </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Issue Date (optional)</label>
                    <input
                      type="date"
                      value={certFormData.date}
                      onChange={(e) => setCertFormData({ ...certFormData, date: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Category (optional)</label>
                    <input
                      type="text"
                      value={certFormData.category}
                      onChange={(e) => setCertFormData({ ...certFormData, category: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                      placeholder="e.g. Development, Cloud"
                    />
                  </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Certificate Description (optional)</label>
                  <textarea
                    rows={3}
                    value={certFormData.description}
                    onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none resize-none"
                    placeholder="Briefly describe the significance of this credential..."
                  />
                </div>
              </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Verification Link (optional)</label>
                  <input
                    type="url"
                    value={certFormData.link}
                    onChange={(e) => setCertFormData({ ...certFormData, link: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Certificate Image / Badge (optional)</label>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-zinc-950 p-4" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload className="text-white" size={32} />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="text-gray-400 mb-3" size={40} />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload badge</span>
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {uploading ? <Loader /> : (editingCertificate ? "Update Certificate" : "Add Certificate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isExpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsExpModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl p-10 rounded-[40px] bg-zinc-900 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold text-white mb-8">{editingExperience ? "Edit Experience" : "Add New Experience"}</h3>
              <form onSubmit={handleExpSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Job Title</label>
                    <input
                      type="text"
                      required
                      value={expFormData.title}
                      onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none"
                      placeholder="e.g. Full Stack Intern"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={expFormData.company}
                      onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none"
                      placeholder="e.g. Wayspire"
                    />
                  </div>
                </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-4">Start Date</label>
                        <input
                          type="date"
                          required
                          value={expFormData.startDate}
                          onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-4">End Date</label>
                        <input
                          type="date"
                          required={!expFormData.isCurrent}
                          disabled={expFormData.isCurrent}
                          value={expFormData.endDate}
                          onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none [color-scheme:dark] ${expFormData.isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <input
                        type="checkbox"
                        id="isCurrent"
                        checked={expFormData.isCurrent}
                        onChange={(e) => setExpFormData({ ...expFormData, isCurrent: e.target.checked, endDate: e.target.checked ? "" : expFormData.endDate })}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-orange-500"
                      />
                      <label htmlFor="isCurrent" className="text-sm font-medium text-gray-400 cursor-pointer">Currently Working Here</label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={expFormData.tags}
                      onChange={(e) => setExpFormData({ ...expFormData, tags: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none"
                      placeholder="e.g. React, Node.js, API"
                    />
                  </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-4">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={expFormData.description}
                    onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none resize-none"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-4 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {uploading ? <Loader /> : (editingExperience ? "Update Experience" : "Add Experience")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Admin;
