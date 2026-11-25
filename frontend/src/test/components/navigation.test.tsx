import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import CommandPalette from "../../components/CommandPalette";

const withRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Navigation components", () => {
  it("Navbar renders brand, nav links and accessible buttons", () => {
    withRouter(<Navbar />);
    expect(screen.getByText(/Portfolio/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enable UI sound" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toggle menu" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByText(/About/).length).toBeGreaterThan(0);
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
