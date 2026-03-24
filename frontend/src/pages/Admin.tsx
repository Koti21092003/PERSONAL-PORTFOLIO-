import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc, getDocFromServer } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, MessageSquare, PlusCircle, Upload, Image as ImageIcon, Settings as SettingsIcon, FileText, Lock, User, Code, Search, Filter, ChevronDown } from "lucide-react";
import Loader from "../components/Loader";

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
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "messages" | "settings">("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Profile status for terminal UI
  const [systemStatus, setSystemStatus] = useState("CONNECTED_SECURE_CLOUD");

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
  });

  const [certFormData, setCertFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    link: "",
    image: "",
    category: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState({ name: "", level: "Advanced", icon: "⚛️" });

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

          setLoading(false);
          return () => {
            unsubProjects();
            unsubMessages();
            unsubCertificates();
            unsubSettings();
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
      setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "" });
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
      setCertFormData({ title: "", issuer: "", date: "", link: "", image: "", category: "", description: "" });
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

  const handleDelete = async (id: string) => {
    if (window.confirm("EXECUTE_DELETE_COMMAND?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const allTechStacks = Array.from(new Set(projects.flatMap(p => p.techStack || []))).sort();

  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = project.title.toLowerCase().includes(searchLower) ||
      (project.techStack && project.techStack.some((tech: string) => tech.toLowerCase().includes(searchLower)));

    const matchesTech = selectedTechStack === "" ||
      (project.techStack && project.techStack.some((tech: string) => tech.toLowerCase() === selectedTechStack.toLowerCase()));

    return matchesSearch && matchesTech;
  });

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500">
              <User className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${activeTab === "projects" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${activeTab === "certificates" ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${activeTab === "messages" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${activeTab === "settings" ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              Profile
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === "projects" ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Manage Projects</h3>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setSelectedFile(null);
                  setImagePreview(null);
                  setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", image: "" });
                  setIsModalOpen(true);
                }}
                className="px-6 py-2 rounded-full bg-white text-black font-bold flex items-center hover:bg-gray-200 transition-colors"
              >
                <Plus size={20} className="mr-2" /> Add Project
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search projects by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="relative w-full md:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <select
                  value={selectedTechStack}
                  onChange={(e) => setSelectedTechStack(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-900">All Tech Stacks</option>
                  {allTechStacks.map(tech => (
                    <option key={tech} value={tech} className="bg-zinc-900">{tech}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 group">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setSelectedFile(null);
                          setImagePreview(project.image);
                          setFormData({
                            title: project.title,
                            description: project.description,
                            techStack: project.techStack.join(", "),
                            githubLink: project.githubLink,
                            liveLink: project.liveLink,
                            image: project.image,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === "certificates" ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Manage Certificates</h3>
              <button
                onClick={() => {
                  setEditingCertificate(null);
                  setSelectedFile(null);
                  setImagePreview(null);
                  setCertFormData({ title: "", issuer: "", date: "", link: "", image: "", category: "" });
                  setIsCertModalOpen(true);
                }}
                className="px-6 py-2 rounded-full bg-white text-black font-bold flex items-center hover:bg-gray-200 transition-colors"
              >
                <Plus size={20} className="mr-2" /> Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 text-lg">No certificates found.</p>
                </div>
              ) : (
                certificates.map((cert) => (
                  <div key={cert.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 group">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{cert.title}</h4>
                    <p className="text-zinc-500 text-xs mb-4 uppercase tracking-widest">{cert.issuer}</p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setEditingCertificate(cert);
                          setSelectedFile(null);
                          setImagePreview(cert.image);
                          setCertFormData({
                            title: cert.title,
                            issuer: cert.issuer,
                            date: cert.date,
                            link: cert.link,
                            image: cert.image,
                            category: cert.category || "",
                            description: cert.description || "",
                          });
                          setIsCertModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleCertificateDelete(cert.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === "messages" ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-8">Recent Messages</h3>
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">{msg.name}</h4>
                      <p className="text-blue-400 text-sm">{msg.email}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-8">Profile Management</h3>
            <div className="space-y-8">
              {/* Profile Image & Hero Section */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Hero Section</h4>
                    <p className="text-gray-500 text-sm">Main text and profile image on your home page</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shrink-0 relative group">
                    <img src={profileSettings.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Upload className="text-white" size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-4">Full Name</label>
                        <input
                          type="text"
                          value={profileSettings.name}
                          onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-4">Role</label>
                        <input
                          type="text"
                          value={profileSettings.role}
                          onChange={(e) => setProfileSettings({ ...profileSettings, role: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Hero Bio</label>
                      <textarea
                        rows={2}
                        value={profileSettings.heroBio}
                        onChange={(e) => setProfileSettings({ ...profileSettings, heroBio: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">About Section</h4>
                    <p className="text-gray-500 text-sm">Detailed information about your journey and goals</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">About Bio (Short)</label>
                    <textarea
                      rows={2}
                      value={profileSettings.aboutBio}
                      onChange={(e) => setProfileSettings({ ...profileSettings, aboutBio: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">My Journey (Full Story)</label>
                    <textarea
                      rows={4}
                      value={profileSettings.journey}
                      onChange={(e) => setProfileSettings({ ...profileSettings, journey: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Education</label>
                      <input
                        type="text"
                        value={profileSettings.education}
                        onChange={(e) => setProfileSettings({ ...profileSettings, education: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Goal</label>
                      <input
                        type="text"
                        value={profileSettings.goal}
                        onChange={(e) => setProfileSettings({ ...profileSettings, goal: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Passion</label>
                      <input
                        type="text"
                        value={profileSettings.passion}
                        onChange={(e) => setProfileSettings({ ...profileSettings, passion: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <SettingsIcon size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Technical Matrix Telemetry</h4>
                      <p className="text-gray-500 text-sm">Dynamic Master Metrics Management</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      const newStats = [...(profileSettings.stats || []), { label: "NEW_METRIC", value: 50, detail: "INIT_STABLE", color: "bg-indigo-500" }];
                      setProfileSettings({ ...profileSettings, stats: newStats });

                      // SYNC
                      setUploading(true);
                      setSystemStatus("INJECTING_MASTER_METRIC...");
                      try {
                        await setDoc(doc(db, "settings", "profile"), { ...profileSettings, stats: newStats }, { merge: true });
                      } finally {
                        setUploading(false);
                        setSystemStatus("STABLE");
                      }
                    }}
                    className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {profileSettings.stats?.map((stat: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col gap-4 relative group">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...profileSettings.stats];
                            newStats[idx] = { ...stat, label: e.target.value };
                            setProfileSettings({ ...profileSettings, stats: newStats });
                          }}
                          className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none w-2/3"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...profileSettings.stats];
                              newStats[idx] = { ...stat, value: parseInt(e.target.value) };
                              setProfileSettings({ ...profileSettings, stats: newStats });
                            }}
                            className="bg-zinc-950/40 border border-white/5 rounded-lg px-2 py-1 text-xs font-mono text-white w-14 outline-none"
                          />
                          <span className="text-xs text-zinc-700">%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <input
                          type="text"
                          value={stat.detail}
                          onChange={(e) => {
                            const newStats = [...profileSettings.stats];
                            newStats[idx] = { ...stat, detail: e.target.value };
                            setProfileSettings({ ...profileSettings, stats: newStats });
                          }}
                          className="bg-transparent border-none p-0 text-[9px] font-mono text-indigo-500/60 outline-none uppercase tracking-widest"
                        />
                        <button
                          onClick={async () => {
                            const newStats = [...profileSettings.stats];
                            newStats.splice(idx, 1);
                            setProfileSettings({ ...profileSettings, stats: newStats });

                            // SYNC
                            setUploading(true);
                            setSystemStatus("DECOMMISSIONING_METRIC...");
                            try {
                              await setDoc(doc(db, "settings", "profile"), { ...profileSettings, stats: newStats }, { merge: true });
                            } finally {
                              setUploading(false);
                              setSystemStatus("STABLE");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Code size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Skills Matrix</h4>
                    <p className="text-gray-500 text-sm">Inline Management Module - Real-time Sync Enabled</p>
                  </div>
                </div>

                {/* Add New Skill In-Situ Form */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                  <input
                    type="text"
                    placeholder="NAME (e.g. React)"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ICON (emoji)"
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                    className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500 text-center"
                  />
                  <button
                    onClick={async () => {
                      if (!newSkill.name) return;
                      const newSkills = [...(profileSettings.skills || []), newSkill];
                      setProfileSettings({ ...profileSettings, skills: newSkills });
                      setNewSkill({ name: "", level: "Advanced", icon: "⚛️" });

                      // SYNC
                      setUploading(true);
                      setSystemStatus("PUSHING_SKILL_TO_NODE...");
                      try {
                        await setDoc(doc(db, "settings", "profile"), { ...profileSettings, skills: newSkills }, { merge: true });
                      } finally {
                        setUploading(false);
                        setSystemStatus("STABLE");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Deploy Skill
                  </button>
                </div>

                {/* Dynamic Skills List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileSettings.skills?.map((skill: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-4 relative group">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={skill.icon}
                          onChange={(e) => {
                            const newSkills = [...profileSettings.skills];
                            newSkills[idx] = { ...skill, icon: e.target.value };
                            setProfileSettings({ ...profileSettings, skills: newSkills });
                          }}
                          className="bg-transparent border-none p-0 text-3xl w-12 outline-none focus:scale-110 transition-transform text-center"
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...profileSettings.skills];
                              newSkills[idx] = { ...skill, name: e.target.value };
                              setProfileSettings({ ...profileSettings, skills: newSkills });
                            }}
                            className="bg-transparent border-none p-0 text-white font-black uppercase tracking-widest text-sm w-full outline-none focus:text-indigo-400"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...profileSettings.skills];
                              newSkills[idx] = { ...skill, level: e.target.value };
                              setProfileSettings({ ...profileSettings, skills: newSkills });
                            }}
                            className="bg-transparent border-none p-0 text-zinc-600 font-bold uppercase tracking-widest text-[9px] w-full outline-none cursor-pointer appearance-none hover:text-white"
                          >
                            <option value="Advanced">Advanced</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Beginner">Beginner</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        <button
                          onClick={async () => {
                            setUploading(true);
                            setSystemStatus("LOGGING_SKILL_MASTER_NODE...");
                            try {
                              await setDoc(doc(db, "settings", "profile"), profileSettings, { merge: true });
                              alert("Skill sync: DATA_STABLE");
                            } finally {
                              setUploading(false);
                              setSystemStatus("STABLE");
                            }
                          }}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-black uppercase flex items-center gap-2"
                        >
                          <SettingsIcon size={14} /> Sync Web
                        </button>
                        <button
                          onClick={async () => {
                            const newSkills = [...profileSettings.skills];
                            newSkills.splice(idx, 1);
                            setProfileSettings({ ...profileSettings, skills: newSkills });

                            // SYNC
                            setUploading(true);
                            setSystemStatus("REMOVING_SKILL_LOG...");
                            try {
                              await setDoc(doc(db, "settings", "profile"), { ...profileSettings, skills: newSkills }, { merge: true });
                            } finally {
                              setUploading(false);
                              setSystemStatus("STABLE");
                            }
                          }}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social & Contact Section */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                    <SettingsIcon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Social & Contact</h4>
                    <p className="text-gray-500 text-sm">Links and resume management</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">GitHub URL</label>
                      <input
                        type="url"
                        value={profileSettings.github}
                        onChange={(e) => setProfileSettings({ ...profileSettings, github: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profileSettings.linkedin}
                        onChange={(e) => setProfileSettings({ ...profileSettings, linkedin: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Contact Email</label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-4">Phone Number</label>
                      <input
                        type="text"
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Location</label>
                    <input
                      type="text"
                      value={profileSettings.location}
                      onChange={(e) => setProfileSettings({ ...profileSettings, location: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-4">Resume (PDF)</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                        <Upload size={20} className="mr-2" />
                        {uploading ? "Uploading..." : "Upload New Resume"}
                        <input type="file" className="hidden" accept="application/pdf" onChange={handleResumeUpload} />
                      </label>
                      {profileSettings.resumeUrl && (
                        <a href={profileSettings.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors">
                          <FileText size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSettingsUpdate}
                disabled={uploading}
                className="w-full py-6 rounded-[32px] bg-emerald-600 text-white font-bold text-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-emerald-600/20"
              >
                {uploading ? <Loader /> : "Save All Profile Changes"}
              </button>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Admin;
