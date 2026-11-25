import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import CommandPalette from "../../components/CommandPalette";

const withRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  // Tests assume HUD audio is explicitly off unless a test enables it.
  localStorage.setItem("portfolio_sound_enabled", "false");
});

describe("Navigation components", () => {
  it("Navbar renders brand, nav links and accessible buttons", () => {
    withRouter(<Navbar />);
    expect(screen.getByText(/Portfolio/)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Enable UI sound" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Toggle menu" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByText(/About/).length).toBeGreaterThan(0);
  });

  it("HUD audio is ON by default when no preference is saved", () => {
    localStorage.removeItem("portfolio_sound_enabled");
    withRouter(<Navbar />);
    expect(screen.getAllByRole("button", { name: "Disable UI sound" }).length).toBeGreaterThan(0);
    localStorage.setItem("portfolio_sound_enabled", "false");
  });

  it("HUD audio toggle is available on mobile controls", () => {
    localStorage.setItem("portfolio_sound_enabled", "false");
    withRouter(<Navbar />);
    const toggles = screen.getAllByRole("button", { name: "Enable UI sound" });
    expect(toggles.length).toBeGreaterThan(1); // desktop + mobile top bar
    fireEvent.click(toggles[toggles.length - 1]);
    expect(localStorage.getItem("portfolio_sound_enabled")).toBe("true");
    expect(screen.getAllByRole("button", { name: "Disable UI sound" }).length).toBeGreaterThan(1);
    localStorage.setItem("portfolio_sound_enabled", "false");
  });

  it("Footer renders navigation links including Resume", () => {
    withRouter(<Footer />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume");
    expect(screen.getByText(/Gateway/)).toBeInTheDocument();
  });

  it("ScrollToTop scrolls the window on mount", () => {
    withRouter(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("CommandPalette stays closed until Ctrl+K is pressed", () => {
    withRouter(<CommandPalette />);
    expect(screen.queryByPlaceholderText(/SEARCH SYSTEM COMMANDS/)).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByPlaceholderText(/SEARCH SYSTEM COMMANDS/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByPlaceholderText(/SEARCH SYSTEM COMMANDS/)).not.toBeInTheDocument();
  });
});
