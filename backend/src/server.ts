import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin (using local service account or application default)
// For local studio environment, we usually use the project ID.
admin.initializeApp({
  projectId: "gen-lang-client-0491207388",
  storageBucket: "gen-lang-client-0491207388.firebasestorage.app",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*", // Allow all origins for dev/testing to fix port 5174 issues
  credentials: true,
}));
app.use(express.json({ limit: "50mb" })); // Support Base64 payloads

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// PROJECTS API
app.get("/api/projects", async (_req, res) => {
  try {
    const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const data = req.body;
    const { id, ...projectData } = data;

    if (id) {
      await db.collection("projects").doc(id).set(projectData, { merge: true });
      res.json({ message: "Project updated", id });
    } else {
      const docRef = await db.collection("projects").add(projectData);
      res.json({ message: "Project created", id: docRef.id });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    await db.collection("projects").doc(req.params.id).delete();
    res.json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// SETTINGS API
app.get("/api/settings", async (_req, res) => {
  try {
    const docSnap = await db.collection("settings").doc("profile").get();
    res.json(docSnap.exists ? docSnap.data() : {});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    await db.collection("settings").doc("profile").set(req.body, { merge: true });
    res.json({ message: "Settings updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// FILE UPLOAD API (Base64)
app.post("/api/upload", async (req, res) => {
  try {
    const { base64, filename, folder } = req.body;
    if (!base64 || !filename) {
      res.status(400).json({ error: "Missing file data" });
      return;
    }

    const buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const docPath = `${folder || "uploads"}/${Date.now()}_${filename}`;
    const file = bucket.file(docPath);

    await file.save(buf, {
      metadata: { contentType: "image/png" }, // Simplified
    });

    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${docPath}`;
    res.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Contact form (Mock/Stub for now, or connect to firestore)
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    await db.collection("messages").add({
      name, email, message,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Advanced Backend running on http://localhost:${PORT}`);
});
