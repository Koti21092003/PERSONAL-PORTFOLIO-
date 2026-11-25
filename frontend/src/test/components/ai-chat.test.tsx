import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AIChat from "../../pages/AIChat";

const renderChat = () => render(<MemoryRouter><AIChat /></MemoryRouter>);

describe("NEXUS.AI general chatbot", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("renders an empty state with starter prompts", () => {
    renderChat();
    expect(screen.getByText("How can I help?")).toBeInTheDocument();
    expect(screen.getByText(/Explain quantum computing/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear conversation" })).toBeInTheDocument();
  });

  it("sends a message in general mode and displays the AI reply", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Hello from NEXUS!" }),
    } as any);

    renderChat();
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi there" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Hello from NEXUS!")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/.netlify/functions/chat"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"mode":"general"'),
      })
    );
  });

  it("shows an error bubble when the service fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: "AI answers are not configured." }),
    } as any);

    renderChat();
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    fireEvent.keyDown(screen.getByLabelText("Message"), { key: "Enter" });

    expect((await screen.findAllByText(/AI answers are not configured/)).length).toBeGreaterThan(0);
  });

  it("clears the conversation", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Remember this." }),
    } as any);

    renderChat();
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Remember me" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("Remember this.");

    fireEvent.click(screen.getByRole("button", { name: "Clear conversation" }));
    await waitFor(() => expect(screen.queryByText("Remember this.")).not.toBeInTheDocument());
    expect(screen.getByText("How can I help?")).toBeInTheDocument();
  });
});
