import { describe, it, expect, beforeEach, afterEach, jest } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  let originalMatchMedia: any;
  let originalInnerWidth: number;
  let listeners: Set<(e: any) => void>;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;
    listeners = new Set();

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false, // Default, not used by the hook implementation but good to have
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn((event, callback) => {
          if (event === "change") {
            listeners.add(callback);
          }
        }),
        removeEventListener: jest.fn((event, callback) => {
          if (event === "change") {
            listeners.delete(callback);
          }
        }),
        dispatchEvent: jest.fn(),
      })),
    });

    // We can't easily mock window.innerWidth with strict mode or some environments,
    // but happy-dom usually allows it. If not, we use Object.defineProperty.
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024, // Default to desktop
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
  });

  const triggerResize = (width: number) => {
    act(() => {
        window.innerWidth = width;
        // The hook listens to 'change' on matchMedia, not 'resize' on window.
        // But the callback checks window.innerWidth.
        // So we update innerWidth and then trigger the matchMedia listener.
        listeners.forEach((callback) => callback({} as any));
    });
  };

  it("should return false when screen is desktop size (>= 768px)", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true when screen is mobile size (< 768px)", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should update when window resizes from desktop to mobile", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    triggerResize(500);

    expect(result.current).toBe(true);
  });

  it("should update when window resizes from mobile to desktop", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    triggerResize(1024);

    expect(result.current).toBe(false);
  });
});
