import { useState, useEffect, useRef, useCallback } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useHUDSound } from "./useHUDSound";
import { ToastType } from "../components/Toast";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  UPLOAD = 'upload'
}

export const useAdminData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState("SYSTEM_OPTIMAL_READY");
  const [toasts, setToasts] = useState<any[]>([]);

  const { playClick, playError } = useHUDSound();
  const prevMessageCount = useRef(0);
  const firstMessageSnapshot = useRef(true);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleFirestoreError = useCallback((error: any, op: OperationType, target: string) => {
    console.error(`Admin Error [${op}] on [${target}]:`, error);
    playError();
    showToast(`Critical Protocol Failure: ${error.message}`, "error");
    setSystemStatus(`ERROR:_${op}_FAILED`);
  }, [playError, showToast]);

  useEffect(() => {
    let dataUnsubscribers: Array<() => void> = [];

    const cleanupDataListeners = () => {
      dataUnsubscribers.forEach((unsubscribe) => unsubscribe());
      dataUnsubscribers = [];
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      cleanupDataListeners();

      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userEmail = user.email?.toLowerCase();
      const isAdmin = userEmail === "koteswararaobotchu007@gmail.com";

      if (!isAdmin) {
        setUser(null);
        setLoading(false);
        signOut(auth);
        return;
      }

      setUser(user);
      firstMessageSnapshot.current = true;

      // LISTEN TO DATA REAL-TIME
      const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const unsubProjects = onSnapshot(qProjects, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
        });
        setProjects(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, "projects"));

      const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubMessages = onSnapshot(qMessages, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (firstMessageSnapshot.current) {
          // Don't notify about messages that already existed before login.
          firstMessageSnapshot.current = false;
        } else if (snapshot.size > prevMessageCount.current) {
          playClick();
          setSystemStatus("NEW_TRANSMISSION_RECEIVED");
          const newest: any = data[0] || {};
          showToast(`New message received from ${newest.name || "a visitor"}`, "info");
          try {
            if ("Notification" in window && Notification.permission === "granted" &&
                localStorage.getItem("portfolio_desktop_notifications") === "true") {
              new Notification("New portfolio message", {
                body: `${newest.name || "A visitor"}: ${String(newest.message || "").slice(0, 120)}`,
                icon: "/favicon.png",
              });
            }
          } catch (e) {
            // Desktop notifications are best-effort only.
          }
        }
        prevMessageCount.current = snapshot.size;
        setMessages(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, "messages"));

      const qTestimonials = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const unsubTestimonials = onSnapshot(qTestimonials, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTestimonials(
          data.sort((a: any, b: any) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
        );
      }, (error) => handleFirestoreError(error, OperationType.LIST, "testimonials"));

      const qCertificates = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
      const unsubCertificates = onSnapshot(qCertificates, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
        });
        setCertificates(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, "certificates"));

      const qExperiences = query(collection(db, "experiences"), orderBy("createdAt", "desc"));
      const unsubExperiences = onSnapshot(qExperiences, (snapshot) => {
        setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, "experiences"));

      const unsubSettings = onSnapshot(doc(db, "settings", "profile"), () => {
        // Profile data is consumed by the public pages; keep the listener alive for parity.
      }, (error) => handleFirestoreError(error, OperationType.LIST, "settings"));

      const unsubVisitors = onSnapshot(doc(db, "analytics", "visitors"), (snapshot) => {
        if (snapshot.exists()) {
          setVisitorCount(snapshot.data().count || 0);
        }
      }, (error) => handleFirestoreError(error, OperationType.LIST, "analytics"));

      dataUnsubscribers = [
        unsubProjects,
        unsubMessages,
        unsubTestimonials,
        unsubCertificates,
        unsubExperiences,
        unsubSettings,
        unsubVisitors,
      ];

      setLoading(false);
    });

    return () => {
      cleanupDataListeners();
      unsubscribe();
    };
  }, [handleFirestoreError, playClick]);

  const handleDelete = async (id: string, name: string, path: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    setSystemStatus(`DELETING_${name.toUpperCase()}...`);
    try {
      await deleteDoc(doc(db, path, id));
      showToast(`${name} deleted from system successfully.`, "success");
      setSystemStatus("DELETE_SUCCESSFUL");
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return {
    user, loading, activeTab, setActiveTab,
    projects, messages, testimonials, certificates, experiences,
    visitorCount, systemStatus, setSystemStatus,
    toasts, showToast, removeToast,
    handleDelete, handleFirestoreError
  };
};
