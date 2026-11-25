export type ChatAction = {
  label: string;
  to?: string;
  href?: string;
};

export type KnowledgeSkill = {
  name: string;
  level?: string;
  info?: string;
  icon?: string;
};

export type KnowledgeProject = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  type?: string;
  isStarred: boolean;
  architecture?: string;
  challenges?: string;
  createdAtMs: number;
};

export type KnowledgeExperience = {
  title: string;
  company: string;
  description: string;
  period: string;
  tags: string[];
  link: string;
  createdAtMs: number;
};

export type KnowledgeCertificate = {
  title: string;
  issuer: string;
  date: string;
  link: string;
  category: string;
  description: string;
  isStarred: boolean;
  createdAtMs: number;
};

export type KnowledgeProfile = {
  name: string;
  role: string;
  heroBio: string;
  aboutBio: string;
  journey: string;
  education: string;
  goal: string;
  passion: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  availability: boolean;
  skills: KnowledgeSkill[];
};

export type PortfolioKnowledge = {
  profile: KnowledgeProfile;
  projects: KnowledgeProject[];
  experiences: KnowledgeExperience[];
  certificates: KnowledgeCertificate[];
};

export type LocalAnswer = {
  text: string;
  actions?: ChatAction[];
  matched: boolean;
};

const DEFAULT_SKILLS: KnowledgeSkill[] = [
  { name: "React", level: "Advanced", info: "Hooks, SPA, Redux" },
  { name: "JavaScript", level: "Advanced", info: "ES6+, Async/Await" },
  { name: "TypeScript", level: "Intermediate", info: "Interfaces, Generics" },
  { name: "Tailwind CSS", level: "Advanced", info: "JIT, Custom Config" },
  { name: "Node.js", level: "Intermediate", info: "Express, REST API" },
  { name: "MongoDB", level: "Intermediate", info: "Data modeling, CRUD" },
  { name: "Firebase", level: "Intermediate", info: "Auth, Firestore" },
  { name: "Git", level: "Advanced", info: "Version control, GitHub" },
];

export const DEFAULT_KNOWLEDGE: PortfolioKnowledge = {
  profile: {
    name: "Botchu Koteswara Rao",
    role: "Full Stack Developer",
    heroBio: "A passionate Full Stack Developer specializing in React.js and Angular 18",
    aboutBio:
      "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    journey:
      "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development.",
    education: "B.Tech in CSE at Centurion University (2022-2026)",
    goal: "Ready to work and open to opportunities",
    passion: "Building modern, user-centric web apps",
    email: "koteswararaobotchu007@gmail.com",
    phone: "+91 8639245927",
    location: "Srikakulam, Andhra Pradesh, India",
    github: "https://github.com/Koti21092003",
    linkedin: "",
    resumeUrl: "",
    availability: true,
    skills: DEFAULT_SKILLS,
  },
  projects: [],
  experiences: [],
  certificates: [],
};

export const WELCOME_TEXT =
  "Hey! I'm KOTI.AI, Koteswara's portfolio assistant. Ask me about his skills, projects, experience, certificates, availability, or how to get in touch.";

export const QUICK_PROMPTS = [
  "What are Koteswara's skills?",
  "Show me his best projects",
  "Is he ready to work?",
  "How can I contact him?",
];

const PROJECT_STOP_WORDS = new Set([
  "website",
  "application",
  "project",
  "portfolio",
  "platform",
  "system",
  "clone",
  "app",
  "the",
  "and",
  "with",
]);

const asText = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return String(value);
  return fallback;
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const toMillis = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
  }
  if (value && typeof value === "object") {
    const maybeTimestamp = value as { toDate?: () => Date };
    if (typeof maybeTimestamp.toDate === "function") {
      const time = maybeTimestamp.toDate().getTime();
      return Number.isFinite(time) ? time : 0;
    }
  }
  return 0;
};

const cleanUrl = (value: unknown) => {
  const url = asText(value);
  if (!url || url === "#") return "";
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
};

const normalizeSkill = (value: unknown): KnowledgeSkill | null => {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? { name } : null;
  }
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const name = asText(record.name);
  if (!name) return null;

  return {
    name,
    level: asText(record.level) || undefined,
    info: asText(record.info) || undefined,
    icon: asText(record.icon) || undefined,
  };
};

const normalizeProject = (value: unknown): KnowledgeProject | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const title = asText(record.title);
  if (!title) return null;

  return {
    id: asText(record.id),
    title,
    description: asText(record.description),
    techStack: toStringArray(record.techStack),
    githubLink: cleanUrl(record.githubLink) || cleanUrl(record.githubUrl) || cleanUrl(record.github),
    liveLink: cleanUrl(record.liveLink) || cleanUrl(record.liveUrl) || cleanUrl(record.live),
    type: asText(record.type) || undefined,
    isStarred: record.isStarred === true || record.isFeatured === true,
    architecture: asText(record.architecture) || undefined,
    challenges: asText(record.challenges) || undefined,
    createdAtMs: toMillis(record.createdAt),
  };
};

const normalizeExperience = (value: unknown): KnowledgeExperience | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const title = asText(record.title);
  if (!title) return null;

  const start = asText(record.startDate);
  const end = asText(record.endDate);
  const period =
    asText(record.period) ||
    [start, record.isCurrent === true ? "Present" : end].filter(Boolean).join(" - ");

  return {
    title,
    company: asText(record.company),
    description: asText(record.description),
    period,
    tags: toStringArray(record.tags),
    link: cleanUrl(record.link),
    createdAtMs: toMillis(record.createdAt),
  };
};

const normalizeCertificate = (value: unknown): KnowledgeCertificate | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const title = asText(record.title);
  if (!title) return null;

  return {
    title,
    issuer: asText(record.issuer),
    date: asText(record.date),
    link: cleanUrl(record.link),
    category: asText(record.category),
    description: asText(record.description),
    isStarred: record.isStarred === true || record.isFeatured === true,
    createdAtMs: toMillis(record.createdAt),
  };
};

export function buildKnowledge(input: {
  profile?: Record<string, unknown> | null;
  projects?: Record<string, unknown>[];
  experiences?: Record<string, unknown>[];
  certificates?: Record<string, unknown>[];
}): PortfolioKnowledge {
  const rawProfile = input.profile || {};
  const defaults = DEFAULT_KNOWLEDGE.profile;

  const skills = Array.isArray(rawProfile.skills)
    ? rawProfile.skills
        .map(normalizeSkill)
        .filter((skill): skill is KnowledgeSkill => Boolean(skill))
    : [];

  const projects = (input.projects || [])
    .map(normalizeProject)
    .filter((project): project is KnowledgeProject => Boolean(project))
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const experiences = (input.experiences || [])
    .map(normalizeExperience)
    .filter((experience): experience is KnowledgeExperience => Boolean(experience))
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const certificates = (input.certificates || [])
    .map(normalizeCertificate)
    .filter((certificate): certificate is KnowledgeCertificate => Boolean(certificate))
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const profile: KnowledgeProfile = {
    name: asText(rawProfile.name, defaults.name),
    role: asText(rawProfile.role, defaults.role),
    heroBio: asText(rawProfile.heroBio, defaults.heroBio),
    aboutBio: asText(rawProfile.aboutBio, defaults.aboutBio),
    journey: asText(rawProfile.journey, defaults.journey),
    education: asText(rawProfile.education, defaults.education),
    goal: asText(rawProfile.goal, defaults.goal),
    passion: asText(rawProfile.passion, defaults.passion),
    email: asText(rawProfile.email, defaults.email),
    phone: asText(rawProfile.phone, defaults.phone),
    location: asText(rawProfile.location, defaults.location),
    github: asText(rawProfile.github) || asText(rawProfile.githubUrl) || defaults.github,
    linkedin: asText(rawProfile.linkedin) || asText(rawProfile.linkedinUrl),
    resumeUrl: asText(rawProfile.resumeUrl) || asText(rawProfile.resume),
    availability: asBoolean(
      rawProfile.isAvailableForHire ?? rawProfile.availableForHire,
      defaults.availability
    ),
    skills: skills.length ? skills : defaults.skills,
  };

  return { profile, projects, experiences, certificates };
}

export function buildAIContext(knowledge: PortfolioKnowledge) {
  const { profile, projects, experiences, certificates } = knowledge;

  return {
    owner: {
      name: displayName(profile),
      role: profile.role,
      bio: truncate(profile.aboutBio || profile.heroBio, 700),
      journey: truncate(profile.journey, 500),
      education: profile.education,
      goal: profile.goal,
      passion: profile.passion,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      availability: profile.availability
        ? "Ready to work — open to full-time roles and internships, including remote"
        : "Not open to new roles right now",
      status: profile.availability ? "Ready to work" : "Not currently looking",
      links: {
        github: profile.github || null,
        linkedin: profile.linkedin || null,
        resume: profile.resumeUrl || null,
      },
    },
    site: {
      url: "https://koteswararaoportfolioo.netlify.app/",
      builtWith: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Three.js",
        "Firebase",
        "Netlify",
      ],
      features: [
        "3D ambient hero scene",
        "Live Firestore content",
        "Admin dashboard",
        "Email notifications for contact messages",
        "KOTI.AI portfolio assistant",
      ],
    },
    skills: profile.skills.slice(0, 24).map((skill) => ({
      name: skill.name,
      level: skill.level || null,
      info: skill.info || null,
    })),
    projects: projects.slice(0, 8).map((project) => ({
      title: project.title,
      description: truncate(project.description, 300),
      techStack: project.techStack.slice(0, 10),
      type: project.type || null,
      architecture: project.architecture ? truncate(project.architecture, 250) : null,
      challenges: project.challenges ? truncate(project.challenges, 250) : null,
      liveLink: project.liveLink || null,
      githubLink: project.githubLink || null,
      featured: project.isStarred,
    })),
    experiences: experiences.slice(0, 6).map((experience) => ({
      title: experience.title,
      company: experience.company || null,
      period: experience.period || null,
      description: truncate(experience.description, 300),
      tags: experience.tags.slice(0, 8),
    })),
    certificates: certificates.slice(0, 8).map((certificate) => ({
      title: certificate.title,
      issuer: certificate.issuer || null,
      date: certificate.date || null,
      category: certificate.category || null,
      description: certificate.description ? truncate(certificate.description, 200) : null,
    })),
  };
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s@.+#/'-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasPhrase = (text: string, phrase: string) => {
  if (!phrase) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(phrase)}(?=\\s|$)`, "i").test(text);
};

const hasAnyPhrase = (text: string, phrases: string[]) =>
  phrases.some((phrase) => hasPhrase(text, phrase));

const skillAliases = (name: string) => {
  const normalized = normalize(name);
  const withoutExtension = normalized.replace(/\.(js|ts|tsx|jsx)$/, "").trim();
  const firstWord = normalized.split(" ")[0];
  return Array.from(
    new Set([normalized, withoutExtension, firstWord].filter((alias) => alias.length >= 2))
  );
};

const findMentionedSkills = (text: string, skills: KnowledgeSkill[]) =>
  skills.filter((skill) =>
    skillAliases(skill.name).some((alias) => hasPhrase(text, alias))
  );

const findMentionedProject = (text: string, projects: KnowledgeProject[]) => {
  const direct = projects.find((project) =>
    hasPhrase(text, normalize(project.title))
  );
  if (direct) return direct;

  const multiWord = projects.find((project) => {
    const words = normalize(project.title)
      .split(" ")
      .filter((word) => word.length >= 4 && !PROJECT_STOP_WORDS.has(word));
    return words.length >= 2 && words.every((word) => hasPhrase(text, word));
  });
  if (multiWord) return multiWord;

  const singleWordMatches = projects.filter((project) => {
    const words = normalize(project.title)
      .split(" ")
      .filter((word) => word.length >= 5 && !PROJECT_STOP_WORDS.has(word));
    return words.some((word) => hasPhrase(text, word));
  });

  return singleWordMatches.length === 1 ? singleWordMatches[0] : undefined;
};

const titleCase = (value: string) =>
  value.length > 1 && value === value.toUpperCase()
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : value;

const displayName = (profile: KnowledgeProfile) =>
  profile.name
    .split(/\s+/)
    .filter(Boolean)
    .map(titleCase)
    .join(" ");

const preferredName = (profile: KnowledgeProfile) => {
  const parts = profile.name.split(/\s+/).filter(Boolean);
  const part =
    parts.find((entry) => entry.toLowerCase().startsWith("kotes")) ||
    parts[0] ||
    "Koteswara";
  return titleCase(part);
};

const truncate = (value: string, max = 240) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
};

const contactActions = (profile: KnowledgeProfile): ChatAction[] => {
  const actions: ChatAction[] = [{ label: "Open contact form", to: "/contact" }];
  if (profile.email) {
    actions.push({ label: "Email Koteswara", href: `mailto:${profile.email}` });
  }
  return actions;
};

const projectActions = (project: KnowledgeProject): ChatAction[] => {
  const actions: ChatAction[] = [];
  if (project.liveLink) actions.push({ label: "Live demo", href: project.liveLink });
  if (project.githubLink) actions.push({ label: "Source code", href: project.githubLink });
  actions.push({ label: "All projects", to: "/projects" });
  return actions;
};

const resumeActions = (profile: KnowledgeProfile): ChatAction[] => {
  const actions: ChatAction[] = [];
  if (profile.resumeUrl) {
    actions.push({ label: "Download resume", href: profile.resumeUrl });
  }
  actions.push({ label: "Contact Koteswara", to: "/contact" });
  return actions;
};

export function answerLocally(
  query: string,
  knowledge: PortfolioKnowledge
): LocalAnswer {
  const text = normalize(query);
  const { profile, projects, experiences, certificates } = knowledge;
  const name = preferredName(profile);
  const contact = contactActions(profile);
  const aboutAction: ChatAction = { label: "About Koteswara", to: "/about" };
  const projectsAction: ChatAction = { label: "View projects", to: "/projects" };
  const skillsAction: ChatAction = { label: "View skills", to: "/skills" };
  const certificatesAction: ChatAction = { label: "View certificates", to: "/certificates" };

  if (!text) {
    return { matched: false, text: WELCOME_TEXT };
  }

  const mentionedProject = findMentionedProject(text, projects);
  if (mentionedProject) {
    const sections = [truncate(mentionedProject.description, 260)];
    if (mentionedProject.architecture) {
      sections.push(`Architecture: ${truncate(mentionedProject.architecture, 180)}`);
    }
    if (mentionedProject.challenges) {
      sections.push(`Challenge: ${truncate(mentionedProject.challenges, 180)}`);
    }

    return {
      matched: true,
      text: `${mentionedProject.title}${
        mentionedProject.type ? ` (${mentionedProject.type})` : ""
      }\n\n${sections.filter(Boolean).join("\n\n")}${
        mentionedProject.techStack.length
          ? `\n\nTech: ${mentionedProject.techStack.join(", ")}`
          : ""
      }`,
      actions: projectActions(mentionedProject),
    };
  }

  if (
    hasAnyPhrase(text, [
      "who made this website",
      "who built this website",
      "who created this website",
      "who made this portfolio",
      "who built this portfolio",
      "who created this portfolio",
    ])
  ) {
    return {
      matched: true,
      text: `This portfolio was designed and built by ${displayName(profile)} using React, TypeScript, Vite, Tailwind CSS, Three.js, Firebase, and Netlify.`,
      actions: [
        { label: "View source", href: "https://github.com/Koti21092003/PERSONAL-PORTFOLIO-" },
        projectsAction,
      ],
    };
  }

  if (
    hasAnyPhrase(text, [
      "this website",
      "this site",
      "this portfolio",
      "tech stack of this",
      "website use",
      "site use",
      "built this",
    ])
  ) {
    return {
      matched: true,
      text: `This portfolio is built with React, TypeScript, Vite, Tailwind CSS, Three.js, Firebase, and Netlify. Contact messages are stored in Firestore and emailed through a Netlify Function with Resend.`,
      actions: [
        { label: "View source", href: "https://github.com/Koti21092003/PERSONAL-PORTFOLIO-" },
        projectsAction,
      ],
    };
  }

  if (hasAnyPhrase(text, ["github", "linkedin", "social", "socials", "source code", "repository", "repo"])) {
    const actions: ChatAction[] = [];
    if (profile.github) actions.push({ label: "GitHub", href: profile.github });
    if (profile.linkedin) actions.push({ label: "LinkedIn", href: profile.linkedin });

    const links = [
      profile.github ? `GitHub: ${profile.github}` : "",
      profile.linkedin ? `LinkedIn: ${profile.linkedin}` : "",
    ].filter(Boolean);

    return {
      matched: true,
      text: links.length
        ? `Here are ${name}'s links:\n\n${links.join("\n")}`
        : `The social links are available in the header and footer. You can also ask ${name} directly through the contact form.`,
      actions: actions.length ? actions : contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "why should i hire",
      "why should we hire",
      "why hire",
      "why should i choose",
    ])
  ) {
    const topSkills = profile.skills.slice(0, 4).map((skill) => skill.name).join(", ");
    return {
      matched: true,
      text: `${name} is a ${profile.role} with hands-on experience in ${topSkills}. He builds responsive, production-ready web apps and is ${
        profile.availability ? "ready to work and open to full-time opportunities" : "not open to new roles right now"
      }. The best next step is a quick conversation about the role.`,
      actions: [projectsAction, ...contact],
    };
  }

  if (
    hasAnyPhrase(text, [
      "available",
      "availability",
      "open to work",
      "open for work",
      "ready to work",
      "ready for work",
      "looking for a job",
      "looking for work",
      "full time",
      "full-time",
      "internship",
      "internships",
      "hire",
      "hiring",
      "opportunity",
      "opportunities",
      "job offer",
      "join your team",
    ])
  ) {
    return {
      matched: true,
      text: profile.availability
        ? `Yes — ${name} is ready to work and open to full-time roles and internships. He's based in ${profile.location} and open to remote opportunities.`
        : `${name} isn't open to new roles right now, but you can still reach out through the contact form to start a conversation.`,
      actions: contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "remote",
      "remote work",
      "work from home",
      "wfh",
      "relocate",
      "relocation",
      "hybrid",
      "onsite",
      "on-site",
    ])
  ) {
    return {
      matched: true,
      text: `${name} is based in ${profile.location} and is open to remote opportunities. For relocation or hybrid arrangements, the contact form is the best way to confirm.`,
      actions: contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "strength",
      "strengths",
      "strong point",
      "strong points",
      "best at",
      "good at",
    ])
  ) {
    const top = profile.skills
      .slice(0, 5)
      .map((skill) => (skill.level ? `${skill.name} (${skill.level})` : skill.name));

    return {
      matched: true,
      text: `${name}'s strongest areas from the portfolio:\n\n${top
        .map((skill) => `• ${skill}`)
        .join("\n")}\n\nHe pairs that with hands-on project work across the stack. The portfolio doesn't include a self-assessed weaknesses list — that's a better question for him directly.`,
      actions: [skillsAction, projectsAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "weakness",
      "weaknesses",
      "weak point",
      "weak points",
    ])
  ) {
    return {
      matched: true,
      text: `The portfolio doesn't include a self-assessed weaknesses list. That's a better question for ${name} directly — the contact form is the fastest way to ask.`,
      actions: contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "salary",
      "ctc",
      "compensation",
      "expected pay",
      "notice period",
      "joining date",
      "start date",
    ])
  ) {
    return {
      matched: true,
      text: `Compensation and notice-period details aren't listed in the portfolio. Send ${name} a message through the contact form and he can share them directly.`,
      actions: contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "full name",
      "his name",
      "what is his name",
      "what's his name",
    ])
  ) {
    return {
      matched: true,
      text: `${displayName(profile)} — ${profile.role}.`,
      actions: [aboutAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "contact",
      "email",
      "e-mail",
      "mail",
      "phone",
      "call",
      "reach",
      "message",
      "connect",
      "get in touch",
    ])
  ) {
    const details = [`Email: ${profile.email}`];
    if (profile.phone) details.push(`Phone: ${profile.phone}`);
    if (profile.location) details.push(`Location: ${profile.location}`);

    return {
      matched: true,
      text: `You can reach ${name} directly:\n\n${details.join(
        "\n"
      )}\n\nThe contact form is the fastest way — messages go straight to his inbox.`,
      actions: contact,
    };
  }

  if (hasAnyPhrase(text, ["resume", "cv", "curriculum vitae"])) {
    return {
      matched: true,
      text: profile.resumeUrl
        ? `Here's ${name}'s resume. You can download it below.`
        : `The resume link isn't available right now. Send ${name} a message through the contact form and he can share it with you.`,
      actions: resumeActions(profile),
    };
  }

  if (
    hasAnyPhrase(text, [
      "location",
      "located",
      "where are you from",
      "where is he from",
      "where do you live",
      "where does he live",
      "based",
      "which city",
      "city",
    ])
  ) {
    return {
      matched: true,
      text: `${name} is based in ${profile.location}.`,
      actions: contact,
    };
  }

  if (
    hasAnyPhrase(text, [
      "education",
      "study",
      "studying",
      "college",
      "university",
      "b.tech",
      "btech",
      "degree",
      "student",
      "academic",
      "school",
    ])
  ) {
    return {
      matched: true,
      text: `${profile.education}${
        profile.journey ? `\n\n${truncate(profile.journey, 260)}` : ""
      }`,
      actions: [aboutAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "certificate",
      "certificates",
      "certification",
      "certifications",
      "credential",
      "credentials",
      "award",
      "awards",
      "course",
      "courses",
    ])
  ) {
    if (!certificates.length) {
      return {
        matched: true,
        text: `The certificate list is on the Certificates page.`,
        actions: [certificatesAction],
      };
    }

    const lines = certificates
      .slice(0, 4)
      .map(
        (certificate) =>
          `• ${certificate.title}${
            certificate.issuer ? ` — ${certificate.issuer}` : ""
          }`
      );

    return {
      matched: true,
      text: `${name} has ${certificates.length} certificate${
        certificates.length === 1 ? "" : "s"
      } in the portfolio, including:\n\n${lines.join("\n")}${
        certificates.length > 4
          ? `\n\n…and ${certificates.length - 4} more on the Certificates page.`
          : ""
      }`,
      actions: [certificatesAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "experience",
      "work experience",
      "internship",
      "internships",
      "company",
      "companies",
      "worked",
      "employment",
      "where do you work",
      "where does he work",
    ])
  ) {
    if (!experiences.length) {
      return {
        matched: true,
        text: `Experience details are on the About page. ${name} is currently focused on full-stack projects and open to new opportunities.`,
        actions: [aboutAction, ...contact],
      };
    }

    const lines = experiences.slice(0, 4).map(
      (experience) =>
        `• ${experience.title}${
          experience.company ? ` at ${experience.company}` : ""
        }${experience.period ? ` (${experience.period})` : ""}${
          experience.description
            ? ` — ${truncate(experience.description, 140)}`
            : ""
        }`
    );

    return {
      matched: true,
      text: `${name}'s experience:\n\n${lines.join("\n")}`,
      actions: [aboutAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "project",
      "projects",
      "your work",
      "his work",
      "show me work",
      "portfolio",
      "built",
      "build",
      "apps",
      "applications",
      "case study",
      "case studies",
    ])
  ) {
    if (!projects.length) {
      return {
        matched: true,
        text: `The latest projects are on the Projects page.`,
        actions: [projectsAction],
      };
    }

    const mentionedTech = findMentionedSkills(text, profile.skills);
    const filtered = mentionedTech.length
      ? projects.filter((project) =>
          project.techStack.some((tech) =>
            mentionedTech.some((skill) =>
              skillAliases(skill.name).some((alias) =>
                hasPhrase(normalize(tech), alias)
              )
            )
          )
        )
      : projects;
    const source = filtered.length ? filtered : projects;
    const featured = [...source]
      .sort((a, b) => Number(b.isStarred) - Number(a.isStarred))
      .slice(0, 3);
    const lines = featured.map(
      (project) =>
        `• ${project.title}${
          project.techStack.length
            ? ` — ${project.techStack.slice(0, 3).join(", ")}`
            : ""
        }`
    );
    const techLabel = mentionedTech.length
      ? ` using ${mentionedTech.map((skill) => skill.name).join(", ")}`
      : "";

    return {
      matched: true,
      text: `${name} has ${source.length} project${
        source.length === 1 ? "" : "s"
      }${techLabel} in the portfolio.${
        featured.length ? ` A few highlights:\n\n${lines.join("\n")}` : ""
      }${
        source.length > featured.length
          ? `\n\n…and ${source.length - featured.length} more on the Projects page.`
          : ""
      }`,
      actions: [projectsAction],
    };
  }

  const mentionedSkills = findMentionedSkills(text, profile.skills);
  if (
    mentionedSkills.length ||
    hasAnyPhrase(text, [
      "skill",
      "skills",
      "tech stack",
      "technology",
      "technologies",
      "expertise",
      "proficient",
      "know",
      "stack",
    ])
  ) {
    if (mentionedSkills.length) {
      const primary = mentionedSkills[0];
      const others = profile.skills
        .filter((skill) => skill.name !== primary.name)
        .slice(0, 5)
        .map((skill) => skill.name);
      return {
        matched: true,
        text: `${primary.name}${
          primary.level ? ` — ${primary.level}` : ""
        }${primary.info ? ` (${primary.info})` : ""}.${
          others.length ? `\n\n${name}'s core stack also includes ${others.join(", ")}.` : ""
        }`,
        actions: [skillsAction],
      };
    }

    const top = profile.skills
      .slice(0, 8)
      .map((skill) => (skill.level ? `${skill.name} (${skill.level})` : skill.name));

    return {
      matched: true,
      text: `${name}'s core skills:\n\n${top
        .map((skill) => `• ${skill}`)
        .join("\n")}\n\nHe focuses on building full-stack applications with React, Node.js, and modern web technologies.`,
      actions: [skillsAction],
    };
  }

  if (
    hasAnyPhrase(text, [
      "who are you",
      "what are you",
      "your name",
      "who is koteswara",
      "who is koti",
      "who is he",
      "about you",
      "about him",
      "introduce yourself",
      "tell me about yourself",
      "tell me about him",
      "what do you do",
      "your role",
      "his role",
      "background",
    ])
  ) {
    return {
      matched: true,
      text: `I'm KOTI.AI, ${name}'s portfolio assistant. ${name} is a ${profile.role} based in ${profile.location}. ${truncate(
        profile.aboutBio || profile.heroBio,
        320
      )}`,
      actions: [aboutAction, projectsAction],
    };
  }

  if (
    text.length <= 32 &&
    hasAnyPhrase(text, [
      "hello",
      "hi",
      "hey",
      "namaste",
      "yo",
      "good morning",
      "good evening",
      "good afternoon",
    ])
  ) {
    return { matched: true, text: WELCOME_TEXT };
  }

  if (hasAnyPhrase(text, ["thanks", "thank you", "appreciate it", "appreciate"])) {
    return {
      matched: true,
      text: `Anytime! If you'd like to talk to ${name} directly, the contact form is the best way.`,
      actions: contact,
    };
  }

  if (hasAnyPhrase(text, ["help", "what can you do", "options", "questions", "commands"])) {
    return {
      matched: true,
      text: `I can answer questions about ${name}'s skills, projects, experience, education, certificates, availability, resume, and contact details. Try one of the suggestions below.`,
      actions: [projectsAction, { label: "Open contact form", to: "/contact" }],
    };
  }

  return {
    matched: false,
    text: `I don't have that detail in the portfolio yet. I can help with skills, projects, experience, education, certificates, availability, resume, or contact info — or you can send ${name} a message directly.`,
    actions: contact,
  };
}
