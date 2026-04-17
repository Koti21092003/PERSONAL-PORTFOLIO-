import { jsPDF } from "jspdf";

export const generateResume = (profile: any, experiences: any[], projects: any[]) => {
  const doc = new jsPDF();
  const primaryColor = "#4f46e5"; // Indigo-600

  // Helper for text wrapping
  const splitText = (text: string, maxWidth: number) => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // 1. Header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(profile.name.toUpperCase(), 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${profile.role} | ${profile.email}`, 20, 32);

  let y = 55;

  // 2. Summary
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PROFESSIONAL SUMMARY", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const summary = splitText(profile.aboutBio || profile.heroBio, 170);
  doc.text(summary, 20, y);
  y += (summary.length * 5) + 10;

  // 3. Experience
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("WORK EXPERIENCE", 20, y);
  y += 10;

  experiences.forEach((exp) => {
    if (y > 250) { doc.addPage(); y = 20; }
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(exp.title.toUpperCase(), 20, y);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(`${exp.company} | ${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}`, 20, y + 5);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const desc = splitText(exp.description, 170);
    doc.text(desc, 20, y + 12);
    y += (desc.length * 5) + 18;
  });

  // 4. Skills
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TECHNICAL SKILLS", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const skillsList = profile.skills?.map((s: any) => s.name).join(", ") || "React, JavaScript, TypeScript, Node.js, Tailwind CSS";
  const wrappedSkills = splitText(skillsList, 170);
  doc.text(wrappedSkills, 20, y);
  y += (wrappedSkills.length * 5) + 15;

  // 5. Featured Projects
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("KEY PROJECTS", 20, y);
  y += 10;

  projects.slice(0, 3).forEach((proj) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(proj.title, 20, y);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const pDesc = splitText(proj.description, 170);
    doc.text(pDesc, 20, y + 5);
    y += (pDesc.length * 5) + 10;
  });

  doc.save(`${profile.name.replace(/\s+/g, "_")}_Resume.pdf`);
};
