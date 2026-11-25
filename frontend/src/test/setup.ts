import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Firebase is a network service — components only need the API surface in tests.
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({ id: "mock-doc" })),
  collection: vi.fn(() => ({ id: "mock-collection" })),
  query: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  onSnapshot: vi.fn(() => vi.fn()),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  increment: vi.fn((n: number) => n + 1),
}));

// jsdom has no matchMedia / scrollTo — components use both.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
Element.prototype.scrollTo = vi.fn() as any;

// framer-motion's whileInView needs IntersectionObserver.
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}
(globalThis as any).IntersectionObserver = IntersectionObserverMock;
(window as any).IntersectionObserver = IntersectionObserverMock;

// LogicStream draws to a canvas on mount; jsdom has no real 2D context.
const canvasContext = {
  canvas: null,
  fillStyle: "",
  font: "",
  fillRect: vi.fn(),
  fillText: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
};
HTMLCanvasElement.prototype.getContext = vi.fn(() => canvasContext as any) as any;
