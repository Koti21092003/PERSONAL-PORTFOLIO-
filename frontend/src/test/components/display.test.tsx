import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { vi } from "vitest";
import ProjectCard from "../../components/ProjectCard";
import CertificateCard from "../../components/CertificateCard";
import Testimonials from "../../components/Testimonials";
import VisitorLog from "../../components/VisitorLog";

const project = {
  title: "Test Project",
  description: "A test project description",
  techStack: ["React", "Firebase"],
  githubLink: "https://github.com/test",
  liveLink: "https://example.com",
  image: "/test.png",
  architecture: "Client-server",
  challenges: "Latency",
  result: "50% faster",
};

describe("Display components", () => {
  it("ProjectCard renders details and flips to the technical analysis view", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getAllByText("Test Project").length).toBeGreaterThan(0);
    expect(screen.getByText("Discover More")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Discover More"));
    expect(screen.getByText("Technical Details")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByText("50% faster")).toBeInTheDocument();
  });

  it("CertificateCard renders credential info and verify action", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <CertificateCard
        certificate={{
          title: "AWS Certified",
          issuer: "Amazon",
          date: "2025",
          link: "example.com/verify",
          image: "/cert.png",
          category: "Cloud",
          isStarred: true,
        }}
      />
    );
    expect(screen.getByText("AWS Certified")).toBeInTheDocument();
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Verify Credential/ }));
    expect(openSpy).toHaveBeenCalledWith("https://example.com/verify", "_blank");
    openSpy.mockRestore();
  });

  it("Testimonials renders quotes from Firestore and advances the carousel", async () => {
    vi.mocked(onSnapshot).mockImplementation(((_q: unknown, cb: any) => {
      cb({
        docs: [
          { id: "t1", data: () => ({ name: "Alice", role: "Mentor", text: "Great work", createdAt: "2026-01-01" }) },
          { id: "t2", data: () => ({ name: "Bob", role: "Peer", text: "Solid engineer", createdAt: "2026-01-02" }) },
        ],
      });
      return vi.fn();
    }) as any);

    render(<Testimonials />);
    expect(screen.getByText(/Great work/)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(await screen.findByText(/Solid engineer/)).toBeInTheDocument();
    expect(await screen.findByText("Bob")).toBeInTheDocument();
  });

  it("Testimonials renders nothing when the collection is empty", () => {
    vi.mocked(onSnapshot).mockImplementation(((_q: unknown, cb: any) => {
      cb({ docs: [] });
      return vi.fn();
    }) as any);
    const { container } = render(<Testimonials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("VisitorLog renders incoming uplink entries from Firestore", async () => {
    vi.mocked(onSnapshot).mockImplementation(((_q: unknown, cb: any) => {
      cb({
        docs: [
          { id: "v1", data: () => ({ city: "Hyderabad", timestamp: "2026-01-01T10:00:00Z" }) },
        ],
      });
      return vi.fn();
    }) as any);
    render(<VisitorLog />);
    expect(await screen.findByText(/Hyderabad/i)).toBeInTheDocument();
  });
});
