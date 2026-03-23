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
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "settings">("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileSettings, setProfileSettings] = useState<any>({
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer",
    heroBio: "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    aboutBio: "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    education: "B.Tech in CSE at Centurion University",
    goal: "Seeking Internships & Job Opportunities",
    passion: "Building modern, user-centric web apps",
    journey: "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development. I've had the opportunity to work on significant projects, including the Dean's Dashboard - a React.js-based application for college administration that's also integrated with an Android application.",
    resumeUrl: "",
    github: "#",
    linkedin: "#",
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "kurudu village,kotabommali,srikakulam",
    profileImageUrl: "https://picsum.photos/seed/koteswararao-v2/400/400",
    skills: [
      { name: "JavaScript/TypeScript", level: "Advanced", icon: "🟨" },
      { name: "React.js", level: "Advanced", icon: "⚛️" },
      { name: "Angular", level: "Advanced", icon: "🅰️" },
      { name: "Node.js", level: "Advanced", icon: "🟢" },
      { name: "Python", level: "Advanced", icon: "🐍" },
      { name: "SQL", level: "Advanced", icon: "🗄️" },
      { name: "AWS", level: "Advanced", icon: "☁️" },
      { name: "Docker", level: "Advanced", icon: "🐳" },
      { name: "Git", level: "Advanced", icon: "🌿" },
      { name: "UI/UX Design", level: "Advanced", icon: "🎨" },
    ],
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    image: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current user email:", user.email);
        if (user.email?.toLowerCase() === "koteswararaobotchu007@gmail.com") {
          setUser(user);
          setLoginError(""); // Clear any previous errors
          // Fetch Projects
          const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
          const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "projects"));

          // Fetch Messages
          const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
          const unsubMessages = onSnapshot(qMessages, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, "messages"));

          // Fetch Profile Settings
          const unsubSettings = onSnapshot(doc(db, "settings", "profile"), (doc) => {
            if (doc.exists()) {
              setProfileSettings(doc.data());
            }
          }, (error) => handleFirestoreError(error, OperationType.GET, "settings/profile"));

          // Test connection as required by guidelines
          const testConnection = async () => {
            try {
              await getDocFromServer(doc(db, 'test', 'connection'));
            } catch (error) {
              if(error instanceof Error && error.message.includes('the client is offline')) {
                console.error("Please check your Firebase configuration. ");
              }
            }
          };
          testConnection();

          setLoading(false);
          return () => {
            unsubProjects();
            unsubMessages();
            unsubSettings();
          };
        } else {
          console.warn("Unauthorized email:", user.email);
          setUser(null);
          setLoading(false);
          signOut(auth);
          alert(`Unauthorized access. Only the admin can access this panel.`);
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
      console.error("Login failed:", error);
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

  const handleFileUpload = async (file: File, path: string) => {
    try {
      if (!storage) throw new Error("Firebase Storage is not initialized.");
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error: any) {
      console.error("Upload failed:", error);
      if (error.code === 'storage/unauthorized') {
        throw new Error("Upload failed: Unauthorized. Please check your Firebase Storage rules in the console.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile, "projects");
      } else if (!editingProject && !imageUrl) {
        alert("Please select an image for the project.");
        setUploading(false);
        return;
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
      alert("Project saved successfully!");
    } catch (error: any) {
      console.error("Error saving project:", error);
      alert(`Failed to save project: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const url = await handleFileUpload(file, "profile");
        setProfileSettings({ ...profileSettings, profileImageUrl: url });
        await setDoc(doc(db, "settings", "profile"), { profileImageUrl: url }, { merge: true });
        alert("Profile image updated!");
      } catch (error: any) {
        alert(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const url = await handleFileUpload(file, "resumes");
        await setDoc(doc(db, "settings", "profile"), { resumeUrl: url }, { merge: true });
        setProfileSettings({ ...profileSettings, resumeUrl: url });
        alert("Resume uploaded successfully!");
      } catch (error: any) {
        alert(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      // Use setDoc with merge: true to handle both create and update
      await setDoc(doc(db, "settings", "profile"), profileSettings, { merge: true });
      alert("Settings updated successfully!");
    } catch (error: any) {
      console.error("Settings update failed:", error);
      alert(`Failed to update settings: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
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
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === "projects" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === "messages" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === "settings" ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
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
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <Code size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Skills</h4>
                      <p className="text-gray-500 text-sm">Manage your technical expertise</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt("Skill Name (e.g. React)");
                      const level = prompt("Level (e.g. Advanced)");
                      const icon = prompt("Icon/Emoji (e.g. ⚛️)");
                      if (name && level && icon) {
                        setProfileSettings({
                          ...profileSettings,
                          skills: [...(profileSettings.skills || []), { name, level, icon }]
                        });
                      }
                    }}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileSettings.skills?.map((skill: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{skill.icon}</span>
                        <div>
                          <p className="text-white text-sm font-bold">{skill.name}</p>
                          <p className="text-gray-500 text-[10px] uppercase">{skill.level}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newSkills = [...profileSettings.skills];
                          newSkills.splice(idx, 1);
                          setProfileSettings({ ...profileSettings, skills: newSkills });
                        }}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
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
      </div>
    </div>
  );
};

export default Admin;
