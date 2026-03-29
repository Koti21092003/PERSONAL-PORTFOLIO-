import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc, getDocFromServer } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, MessageSquare, PlusCircle, Upload, Image as ImageIcon, Settings as SettingsIcon, FileText, Lock, User, Code, Search, Filter, ChevronDown, Star } from "lucide-react";
import Loader from "../components/Loader";
import StatCards from "./Admin/StatCards";
import ProjectPanel from "./Admin/ProjectPanel";
import CertificatePanel from "./Admin/CertificatePanel";
import ExperiencePanel from "./Admin/ExperiencePanel";
import MessagePanel from "./Admin/MessagePanel";
import ProfilePanel from "./Admin/ProfilePanel";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // throw new Error(JSON.stringify(errInfo)); // We don't want to crash the whole app, but we want it in the logs
};

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "certificates" | "messages" | "settings" | "experiences">("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [expFormData, setExpFormData] = useState({ title: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "", tags: "" });

  // Profile status for terminal UI
  const [systemStatus, setSystemStatus] = useState("Online and Secure");

  const [profileSettings, setProfileSettings] = useState<any>({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer (React & Angular 18 Specialist)",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    aboutBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    education: "B.Tech in CSE at Centurion University",
    goal: "Seeking Internships & Job Opportunities",
    passion: "Building modern, user-centric web apps",
    journey: "Currently pursuing my B.Tech in CSE at Centurion University.",
    resumeUrl: "",
    github: "#",
    linkedin: "#",
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "Srikakulam, AP, India",
    profileImageUrl: "https://picsum.photos/seed/koteswararao-v2/400/400",
    skills: [
      { name: "React", level: "Advanced", icon: "⚛️", info: "Hooks, SPA, Redux" },
      { name: "JavaScript", level: "Advanced", icon: "🟨", info: "ES6+, Async/Await" },
      { name: "TypeScript", level: "Intermediate", icon: "🟦", info: "Interfaces, Generics" },
      { name: "Tailwind CSS", level: "Advanced", icon: "🎨", info: "JIT, Custom Config" },
      { name: "Node.js", level: "Intermediate", icon: "🟢", info: "Express, REST API" },
      { name: "Express", level: "Intermediate", icon: "🚂", info: "Middleware, Auth" },
      { name: "Firebase", level: "Intermediate", icon: "🔥", info: "Firestore, Auth" },
      { name: "Git", level: "Advanced", icon: "🌿", info: "Workflows, Rebase" },
      { name: "Docker", level: "Intermediate", icon: "🐳", info: "Containers, Images" },
      { name: "AWS", level: "Beginner", icon: "☁️", info: "S3, EC2, Lambda" },
    ],
    stats: [
      { label: "Architecture", value: 94, detail: "SYSTEM_READY", color: "bg-indigo-500" },
      { label: "Frontend Dev", value: 98, detail: "UI_STABLE", color: "bg-blue-500" },
      { label: "Algorithm Logic", value: 89, detail: "LOGIC_SYNCED", color: "bg-purple-500" }
    ]
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    image: "",
    isStarred: false,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email?.toLowerCase() === "koteswararaobotchu007@gmail.com") {
          setUser(user);
          setLoginError("");

          // LISTEN TO DATA REAL-TIME
          const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
          const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "projects"));

          const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
          const unsubMessages = onSnapshot(qMessages, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "messages"));

          const qCertificates = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
          const unsubCertificates = onSnapshot(qCertificates, (snapshot) => {
            setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "certificates"));

          const qExperiences = query(collection(db, "experiences"), orderBy("createdAt", "desc"));
          const unsubExperiences = onSnapshot(qExperiences, (snapshot) => {
            setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "experiences"));

          const unsubSettings = onSnapshot(doc(db, "settings", "profile"), (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setProfileSettings((prev: any) => ({
                ...prev,
                ...data,
                skills: data.skills || prev.skills, // Fallback to defaults if empty
                stats: data.stats || prev.stats     // Fallback to defaults if empty
              }));
            }
          });
          const unsubVisitors = onSnapshot(doc(db, "analytics", "visitors"), (snapshot) => {
            if (snapshot.exists()) {
              setVisitorCount(snapshot.data().count || 0);
            }
          });

          setLoading(false);
          return () => {
            unsubProjects();
            unsubMessages();
            unsubCertificates();
            unsubExperiences();
            unsubSettings();
            unsubVisitors();
          };
        } else {
          setUser(null);
          setLoading(false);
          signOut(auth);
          alert(`Unauthorized access.`);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error: any) {
      setLoginError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

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

  const handleFileUpload = async (file: File) => {
    // PASS-THROUGH FOR DOCUMENTS (PDF, DOCX) OR SMALL ASSETS
    if (!file.type.startsWith('image/') || file.size < 500000) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) resolve(reader.result as string);
          else reject(new Error("File conversion failed - result empty."));
        };
        reader.onerror = () => reject(new Error("Filestream interruption."));
        reader.readAsDataURL(file);
      });
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          let quality = 0.95;
          let dataUrl = "";
          let iterations = 0;

          const optimize = () => {
            if (iterations > 0) {
              width *= 0.9;
              height *= 0.9;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Advanced Frame Failure"));

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            dataUrl = canvas.toDataURL("image/webp", quality);

            if (dataUrl.length > 900000 && iterations < 10) {
              quality -= 0.1;
              iterations++;
              setSystemStatus(`LEVELING_FIDELITY_STEP_${iterations}...`);
              optimize();
            } else {
              setSystemStatus(`ASSET_ENCODED`);
              resolve(dataUrl);
            }
          };

          optimize();
        };
        img.onerror = () => reject(new Error("Visual encoding failed - please ensure this is a valid image asset."));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Data transfer error."));
      reader.readAsDataURL(file);
    });
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
      setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "", isStarred: false });
      alert("Project saved successfully using Cloud Native Storage!");
    } catch (error: any) {
      console.error("Error saving project:", error);
      alert(`Failed to save project: ${error.message}`);
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
        const url = await handleFileUpload(file);
        setProfileSettings({ ...profileSettings, profileImageUrl: url });
        await setDoc(doc(db, "settings", "profile"), { profileImageUrl: url }, { merge: true });
        alert("Profile image updated!");
      } catch (error: any) {
        alert(`Storage process error: ${error.message}`);
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
        const url = await handleFileUpload(file);
        await setDoc(doc(db, "settings", "profile"), { resumeUrl: url }, { merge: true });
        setProfileSettings({ ...profileSettings, resumeUrl: url });
        alert("Resume saved to cloud!");
      } catch (error: any) {
        alert(`Storage process error: ${error.message}`);
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
      alert("Profile Settings updated successfully!");
    } catch (error: any) {
      alert(`Sync failed: ${error.message}`);
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
      alert("Experience saved successfully!");
    } catch (error: any) {
      console.error("Error saving experience:", error);
      alert(`Failed to save experience: ${error.message}`);
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
      alert("Certificate saved successfully!");
    } catch (error: any) {
      console.error("Error saving certificate:", error);
      alert(`Failed to save certificate: ${error.message}`);
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900/50 border border-white/10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-500" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
            <p className="text-gray-400">Enter your credentials to manage your portfolio.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-4">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500 transition-transform hover:scale-105 shrink-0">
                <User className="text-blue-500" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest opacity-60">Admin Dashboard</p>
              </div>
            </div>
            {/* Mobile Logout - Quick Access */}
            <button 
              onClick={handleLogout}
              className="md:hidden p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide no-scrollbar w-full md:w-auto -mx-2 px-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "dashboard" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "projects" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "certificates" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab("experiences")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "experiences" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "messages" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-5 md:px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${activeTab === "settings" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25" : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
            >
              Profile
            </button>
            <button 
              onClick={handleLogout} 
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all ml-4"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          <StatCards 
            visitorCount={visitorCount} 
            projectsCount={projects.length} 
            messagesCount={messages.length} 
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
              setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "", isStarred: false });
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
              });
              setImagePreview(project.image);
              setIsModalOpen(true);
            }}
            onDeleteProject={(id, title) => {
              if (window.confirm(`Are you sure you want to delete ${title}?`)) {
                deleteDoc(doc(db, "projects", id));
              }
            }}
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
            onDelete={(id, name) => {
              if (window.confirm(`Delete certificate ${name}?`)) {
                deleteDoc(doc(db, "certificates", id));
              }
            }}
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
            onDelete={(id, title) => {
              if (window.confirm(`Delete experience ${title}?`)) {
                deleteDoc(doc(db, "experiences", id));
              }
            }}
          />
        ) : activeTab === "messages" ? (
          <MessagePanel 
            messages={messages}
            onDelete={(id, name) => {
              if (window.confirm(`Delete message from ${name}?`)) {
                deleteDoc(doc(db, "messages", id));
              }
            }}
          />
        ) : activeTab === "settings" ? (
          <ProfilePanel 
            profileSettings={profileSettings}
            setProfileSettings={setProfileSettings}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            onSave={handleSettingsUpdate}
            onFileChange={handleProfileImageUpload}
            imagePreview={imagePreview}
            loading={uploading}
          />
        ) : null}

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
