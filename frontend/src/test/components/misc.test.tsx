import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Magnetic from "../../components/Magnetic";
import LogicStream from "../../components/LogicStream";
import PortfolioChat from "../../components/PortfolioChat";

describe("Remaining components", () => {
  it("Magnetic renders its children", () => {
    render(
      <Magnetic>
        <button>Attract me</button>
      </Magnetic>
    );
    expect(screen.getByRole("button", { name: "Attract me" })).toBeInTheDocument();
  });

  it("LogicStream mounts a full-screen canvas", () => {
    const { container } = render(<LogicStream />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("PortfolioChat opens and closes the assistant panel", async () => {
    render(
      <MemoryRouter>
        <PortfolioChat />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open portfolio assistant" }));
    expect(screen.getByPlaceholderText(/Ask about skills/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    await waitFor(() => expect(screen.queryByPlaceholderText(/Ask about skills/)).not.toBeInTheDocument());
  });
});
