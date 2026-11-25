import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { ToastContainer } from "../../components/Toast";
import ErrorBoundary from "../../components/ErrorBoundary";
import BootScreen from "../../components/BootScreen";

describe("Feedback components", () => {
  it("Toast shows its message and calls removeToast via the dismiss button", () => {
    const removeToast = vi.fn();
    render(
      <ToastContainer
        toasts={[{ id: "1", message: "Saved successfully", type: "success" }]}
        removeToast={removeToast}
      />
    );
    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(removeToast).toHaveBeenCalledWith("1");
  });

  it("Toast auto-dismisses after 5 seconds", () => {
    vi.useFakeTimers();
    const removeToast = vi.fn();
    render(
      <ToastContainer
        toasts={[{ id: "2", message: "Auto close", type: "info" }]}
        removeToast={removeToast}
      />
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(removeToast).toHaveBeenCalledWith("2");
    vi.useRealTimers();
  });

  it("ToastContainer renders each queued toast", () => {
    render(
      <ToastContainer
        toasts={[
          { id: "1", message: "First", type: "success" },
          { id: "2", message: "Second", type: "error" },
        ]}
        removeToast={vi.fn()}
      />
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("ErrorBoundary shows a fallback when a child throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken = () => {
      throw new Error("Crash test");
    };
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Crash test")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload Page" })).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("BootScreen renders the boot sequence on a first visit", () => {
    sessionStorage.clear();
    render(<BootScreen />);
    expect(screen.getByText(/portfolio boot sequence/i)).toBeInTheDocument();
  });
});
