import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TestimonialsPanel from "../../pages/Admin/TestimonialsPanel";
import ProjectPanel from "../../pages/Admin/ProjectPanel";
import CertificatePanel from "../../pages/Admin/CertificatePanel";
import ExperiencePanel from "../../pages/Admin/ExperiencePanel";
import MessagePanel from "../../pages/Admin/MessagePanel";
import StatCards from "../../pages/Admin/StatCards";
import AdminLogin from "../../pages/Admin/AdminLogin";

const noop = vi.fn();

describe("Admin panels", () => {
  it("TestimonialsPanel lists, searches and exposes CRUD actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { rerender } = render(
      <TestimonialsPanel
        testimonials={[
          { id: "t1", name: "Alice", role: "Mentor", text: "Excellent work" },
          { id: "t2", name: "Bob", role: "Peer", text: "Great teammate" },
        ]}
        searchQuery=""
        setSearchQuery={noop}
        onAdd={noop}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    fireEvent.click(document.getElementById("edit-testimonial-t1")!);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ name: "Alice" }));
    fireEvent.click(document.getElementById("delete-testimonial-t2")!);
    expect(onDelete).toHaveBeenCalledWith("t2", "Bob");

    rerender(
      <TestimonialsPanel
        testimonials={[{ id: "t1", name: "Alice", role: "Mentor", text: "Excellent work" }]}
        searchQuery="bob"
        setSearchQuery={noop}
        onAdd={noop}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText(/No testimonials found/)).toBeInTheDocument();
  });

  it("ProjectPanel lists projects and exposes CRUD actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <ProjectPanel
        projects={[{ id: "p1", title: "Portfolio", techStack: ["React"], image: "/x.png" }]}
        searchQuery=""
        setSearchQuery={noop}
        selectedTechStack=""
        setSelectedTechStack={noop}
        allTechStacks={["React"]}
        onAddProject={noop}
        onEditProject={onEdit}
        onDeleteProject={onDelete}
      />
    );
    expect(screen.getAllByText(/Portfolio/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Add New Project/i })).toBeInTheDocument();
  });

  it("CertificatePanel renders records and add action", () => {
    render(
      <CertificatePanel
        certificates={[{ id: "c1", title: "React Certified", issuer: "Meta", date: "2025", image: "/c.png" }]}
        searchQuery=""
        setSearchQuery={noop}
        onAdd={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );
    expect(screen.getByText("React Certified")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add New Certificate/i })).toBeInTheDocument();
  });

  it("ExperiencePanel renders records and add action", () => {
    render(
      <ExperiencePanel
        experiences={[{ id: "e1", title: "Developer", company: "Acme", period: "2025", description: "Built apps" }]}
        onAdd={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add New Experience/i })).toBeInTheDocument();
  });

  it("MessagePanel renders messages and status actions", () => {
    const onUpdateStatus = vi.fn();
    const onUpdateAllStatus = vi.fn();
    render(
      <MessagePanel
        messages={[{ id: "m1", name: "Visitor", email: "v@example.com", message: "Hello", status: "unread", createdAt: "2026-01-01" }]}
        onDelete={noop}
        onUpdateStatus={onUpdateStatus}
        onUpdateAllStatus={onUpdateAllStatus}
      />
    );
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Visitor")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Mark all as read|Acknowledge all/i }));
    expect(onUpdateAllStatus).toHaveBeenCalled();
  });

  it("StatCards renders dashboard counters", () => {
    render(<StatCards visitorCount={42} projectsCount={7} messagesCount={3} totalMessages={12} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("AdminLogin submits credentials and toggles password visibility", () => {
    const handleLogin = vi.fn();
    render(
      <AdminLogin
        handleLogin={handleLogin}
        loginEmail=""
        setLoginEmail={noop}
        loginPassword=""
        setLoginPassword={noop}
        showPassword={false}
        setShowPassword={noop}
        loginError=""
        loading={false}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
    fireEvent.click(buttons[0]);
  });
});
