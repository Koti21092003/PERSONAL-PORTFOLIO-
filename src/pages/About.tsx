import { motion } from "motion/react";
import { GraduationCap, Code, Briefcase, User } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const About = () => {
  const [profile, setProfile] = useState({
    aboutBio: "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
    journey: "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development. I've had the opportunity to work on significant projects, including the Dean's Dashboard - a React.js-based application for college administration that's also integrated with an Android application.",
    education: "B.Tech in CSE at Centurion University",
    role: "Full Stack Developer",
    goal: "Seeking Internships & Job Opportunities",
    passion: "Building modern, user-centric web apps",
    profileImageUrl: "https://picsum.photos/seed/koteswararao-v2/400/400",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          aboutBio: data.aboutBio || "I'm a passionate Full Stack Developer with a strong focus on React.js, Angular, and modern web technologies. I love creating intuitive and responsive user interfaces that provide exceptional user experiences.",
          journey: data.journey || "Currently pursuing my B.Tech in Computer Science and Engineering at Centurion University of Technology and Management (Batch 2022-2026). My academic journey has strengthened my foundation in computer science while allowing me to explore and specialize in frontend development. I've had the opportunity to work on significant projects, including the Dean's Dashboard - a React.js-based application for college administration that's also integrated with an Android application.",
          education: data.education || "B.Tech in CSE at Centurion University",
          role: data.role || "Full Stack Developer",
          goal: data.goal || "Seeking Internships & Job Opportunities",
          passion: data.passion || "Building modern, user-centric web apps",
          profileImageUrl: data.profileImageUrl || "https://picsum.photos/seed/koteswararao-v2/400/400",
        });
      }
    });
    return () => unsub();
  }, []);

  const details = [
    {
      icon: <GraduationCap className="text-blue-400" size={24} />,
      title: "Education",
      description: profile.education,
    },
    {
      icon: <Code className="text-purple-400" size={24} />,
      title: "Role",
      description: profile.role,
    },
    {
      icon: <Briefcase className="text-emerald-400" size={24} />,
      title: "Goal",
      description: profile.goal,
    },
    {
      icon: <User className="text-orange-400" size={24} />,
      title: "Passion",
      description: profile.passion,
    },
  ];

  const experiences = [
    {
      title: "Dean's Dashboard Project",
      company: "Centurion University",
      period: "2023-2024",
      description: "Developed a comprehensive React.js-based dashboard for college administration, featuring intuitive interfaces and seamless integration with an Android application. The project improved administrative efficiency and data management capabilities."
    },
    {
      title: "Full Stack Development Intern",
      company: "Wayspire",
      period: "2024",
      description: "Developing full-stack web applications using React.js, Angular, Node.js, and modern web technologies. Working on real-world projects and improving development skills across multiple frameworks."
    }
  ];

  const skills = [
    "JavaScript/TypeScript", "React.js", "Angular", "Node.js", "Python", 
    "SQL", "AWS", "Docker", "Git", "UI/UX Design"
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {profile.aboutBio}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {detail.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{detail.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{detail.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shrink-0">
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">My Journey</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {profile.journey}
            </p>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill) => (
                <span key={skill} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-zinc-900/50 border border-white/10"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                  </div>
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
