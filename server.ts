import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock data for initial testing (will replace with Firestore later)
  let projects = [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce site with React and Node.js.",
      techStack: ["React", "Node.js", "MongoDB", "Tailwind"],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      image: "https://picsum.photos/seed/shop/800/600"
    },
    {
      id: "2",
      title: "Social Media App",
      description: "A real-time social platform with chat features.",
      techStack: ["React", "Firebase", "Motion"],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      image: "https://picsum.photos/seed/social/800/600"
    }
  ];

  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("New Contact Message:", { name, email, message });
    res.status(201).json({ message: "Message sent successfully!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
