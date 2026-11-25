import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { vi } from "vitest";
import Home from "../../pages/Home";
import About from "../../pages/About";
import Skills from "../../pages/Skills";
import Projects from "../../pages/Projects";
import Certificates from "../../pages/Certificates";
import Contact from "../../pages/Contact";
import Resume from "../../pages/Resume";
import NotFound from "../../pages/NotFound";
import Admin from "../../pages/Admin";

const renderPage = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  // Populate Firestore-backed pages with a minimal profile document.
  vi.mocked(onSnapshot).mockImplementation(((arg: any, cb: any) => {
    if (arg && arg.id === "mock-doc") {
      cb({ exists: () => true, data: () => ({ name: "Botchu Koteswara Rao", role: "Full Stack Developer", skills: [], stats: [] }) });
    } else {
      cb({ docs: [] });
    }
    return vi.fn();
  }) as any);
});

describe("Page smoke tests", () => {
  it("Home renders the hero", () => {
    renderPage(<Home />);
    expect(screen.getAllByText(/Botchu Koteswara Rao/).length).toBeGreaterThan(0);
  });

  it("About renders the background section", () => {
    renderPage(<About />);
    expect(screen.getByText(/My Background & Story/)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Activity/)).toBeInTheDocument();
  });

  it("Skills renders", () => {
    const { container } = renderPage(<Skills />);
    expect(container.textContent).toBeTruthy();
  });

  it("Projects renders", () => {
    const { container } = renderPage(<Projects />);
    expect(container.textContent).toBeTruthy();
  });

  it("Certificates renders", () => {
    const { container } = renderPage(<Certificates />);
    expect(container.textContent).toBeTruthy();
  });

  it("Contact renders the form", () => {
    renderPage(<Contact />);
    expect(screen.getAllByText(/Send Message|Transmission|Contact/i).length).toBeGreaterThan(0);
  });

  it("Resume renders professional summary", async () => {
    renderPage(<Resume />);
    expect(await screen.findByText(/Professional Summary/)).toBeInTheDocument();
  });

  it("NotFound renders a 404 message", () => {
    const { container } = renderPage(<NotFound />);
    expect(container.textContent).toMatch(/404|not found|lost/i);
  });

  it("Admin renders the login gate when unauthenticated", () => {
    const { container } = renderPage(<Admin />);
    expect(container.textContent).toBeTruthy();
  });
});
