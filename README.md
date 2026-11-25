# 🛡️Personal Portfolio - Botchu Koteswara Rao

[![Technical Level](https://img.shields.io/badge/Architecture-SYSTEM_READY-indigo)](#)
[![Stack Status](https://img.shields.io/badge/Frontend-UI_STABLE-blue)](#)
[![Logic Integrity](https://img.shields.io/badge/Logic-SYNCED-purple)](#)
[![Deployment](https://img.shields.io/badge/Production-OPERATIONAL-emerald)](#)

A high-fidelity, professional personal portfolio architected with an **Elite Coder** aesthetic. This project features a "Hyper-Transparent Obsidian" glassmorphism UI, a real-time administrative command center, and a fully dynamic technical capability matrix.

---

## 🏗️ Technical Architecture

### **Core Frontend Node**
- **React.js & Vite**: Lightning-fast development and optimized build performance.
- **Tailwind CSS**: Custom utility-first styling with advanced glassmorphism filters.
- **Framer Motion**: High-fidelity micro-interactions and page transitions.
- **Lucide React**: Clean, semantic iconography suite.

### **Cloud & Persistence Layer**
- **Firebase Firestore**: Real-time NoSQL database for projects, metrics, and profile data.
- **Firebase Auth**: Secure administrative gateway to the management dashboard.
- **Firebase Storage**: Object storage for professional assets and technical documents.

### **Backend Module**
- **Node.js & Express**: High-performance API routing and server-side logic assets.
- **TypeScript**: End-to-end type safety across the entire data stream.

---

## ⚡ Key Control Modules

### **1. Real-Time Admin Command Center**
Manage your entire professional identity from a private dashboard:
- **Instant Web Sync**: Add, edit, or delete skills and projects with immediate cloud reflection.
- **Technical Matrix Telemetry**: Refine your Architecture, Frontend, and Logic scores in real-time.
- **In-Situ Editing**: No-popup, inline editing for a fluid administrative experience.

### **2. Dynamic Technical Matrix**
Showcase your mastery with animated progress indicators and a categorized skills matrix that automatically updates via your admin deck.

### **3. Optimized Professional Branding**
- **Custom Browser Identity**: Personalized tab titles and portrait favicons.
- **Elite Aesthetic**: Dark-themed, glass-morphism UI designed to "WOW" technical recruiters and stakeholders.

---

## 📁 Repository Structure

```text
PERSONAL-PORTFOLIO-
├── frontend/             # React/Vite Portfolio Node
│   ├── src/              # Source code (Components, Pages, Services)
│   ├── public/           # Static assets (Favicon, Profile Photos)
│   ├── netlify/functions/# Email notification + AI assistant functions
│   └── index.html        # Entry document
├── backend/              # Node.js/Express Server Node
│   └── src/              # Logic modules and API routes
├── netlify.toml          # CI/CD Deployment Controller
└── README.md             # Project Documentation
```

---

## 🛠️ Local Development & Deployment

### **Installation**
Clone the repository and install dependencies for both the frontend and backend nodes:

```bash
# Clone the Node
git clone https://github.com/Koti21092003/PERSONAL-PORTFOLIO-.git

# Install All Dependencies (Root Script)
npm run install:all
```

### **Manual Build & Execution**
```bash
# Frontend (Vite)
npm run dev

# Optional Express backend (run in a second terminal)
npm run dev:backend
```

### **Email notifications for contact messages**
The contact form saves every message to Firestore first, then calls a Netlify Function that sends an email through [Resend](https://resend.com). If email delivery fails, the message is still visible in the admin dashboard.

1. Create a free Resend account using the email address where you want to receive notifications.
2. In Resend, create an API key.
3. In Netlify, open **Site configuration → Environment variables** and add:
   - `RESEND_API_KEY` — your Resend API key
   - `NOTIFICATION_EMAIL` — the inbox that should receive messages (for example, `koteswararaobotchu007@gmail.com`)
   - `RESEND_FROM_EMAIL` — verified sender address (e.g. `Koteswara Rao <koteswararaobotchu007@gmail.com>`; the `onboarding@resend.dev` test sender is temporary)
4. Redeploy the site.

`onboarding@resend.dev` is Resend's temporary test sender and can only send to the Resend account owner's email. For production, verify a sender (Gmail address or domain) in Resend and set `RESEND_FROM_EMAIL` to that verified sender. The current working value in `frontend/.env` and the Netlify function fallback is `Portfolio Notifications <onboarding@resend.dev>`.

For local email testing, run `npx netlify dev` instead of `npm run dev`; Vite alone does not serve Netlify Functions.

### **Portfolio assistant (KOTI.AI)**
The floating assistant in the bottom-right corner answers visitor questions about skills, projects, experience, certificates, availability, resume, and contact details. It reads the same Firestore data as the site, so answers stay in sync with the admin dashboard.

- Common questions are answered instantly in the browser with no API cost.
- Free-form questions are answered by a real AI model through `netlify/functions/chat.mjs`, with the local engine as a fallback.
- AI works out of the box through a chain of keyless OpenAI-compatible providers. For maximum reliability and quality, add your own provider key.
- The assistant also opens from the command palette (`Ctrl/Cmd + K` → "Ask: KOTI.AI Portfolio Assistant").

To use your own AI provider, add one of these in **Netlify → Site configuration → Environment variables**, then redeploy:

| Variable | Provider | Default model |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | OpenRouter | `openai/gpt-4o-mini` |
| `GROQ_API_KEY` | Groq | `llama-3.3-70b-versatile` |
| `AI_API_KEY` | Any OpenAI-compatible API | `gpt-4o-mini` |

Optional overrides: `AI_MODEL`, `AI_BASE_URL` (for `AI_API_KEY`), and `SITE_URL` (OpenRouter attribution). Keys are read only inside the Netlify Function and are never included in the frontend bundle.

The keyless fallback can be disabled with `AI_KEYLESS=false`. If it is disabled and no key is set, the assistant still answers every built-in topic locally. Without a key, requests race Kilo Gateway and Pollinations, so a single rate-limited provider does not take the assistant offline. Set `AI_KEYLESS_URL` and `AI_KEYLESS_MODEL` to use a different keyless endpoint instead of the built-in pair. The keyless providers receive the visitor's question and the public portfolio context; do not send private data through the chat. For local testing with functions, run `npx netlify dev`. To point the Vite dev server at a locally running function, set `VITE_CHAT_ENDPOINT=http://localhost:8888/.netlify/functions/chat`.

---

## 🌐 Production Environment
The live instance of this technical asset is synchronized with the master branch via Netlify.
**Live Portfolio**: (https://koteswararaoportfolioo.netlify.app/)

---

### 🛡️ System Origin
- **Architect**: Botchu Koteswara Rao
- **Specialization**: Full Stack Engineer (React.js & Angular 18)
- **GitHub**: [Koti21092003](https://github.com/Koti21092003)
- **Status**: OPERATIONAL_NODE
