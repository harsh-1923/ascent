import { useEffect, RefObject } from "react";

interface UseDoubleTapOptions {
  delay?: number; // Time between taps in ms
  maxDistance?: number; // Max finger movement allowed (px)
}

export function useDoubleTap<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (coordinates: { x: number; y: number }) => void,
  options: UseDoubleTapOptions = {}
) {
  const { delay = 300, maxDistance = 10 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const isTouchCapable =
      (typeof window !== "undefined" &&
        "matchMedia" in window &&
        window.matchMedia("(pointer: coarse)").matches) ||
      (typeof navigator !== "undefined" &&
        "maxTouchPoints" in navigator &&
        (navigator as any).maxTouchPoints > 0);

    let lastTapTime = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastClickX = 0;
    let lastClickY = 0;
    let lastTouchDoubleTapAt = 0; // timestamp to suppress click-based double triggers after touch

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return; // Ignore multi-touch (pinch zoom, etc.)

      const touch = e.touches[0];
      const currentTime = Date.now();

      const timeDiff = currentTime - lastTapTime;
      const distX = Math.abs(touch.clientX - lastTouchX);
      const distY = Math.abs(touch.clientY - lastTouchY);

      if (timeDiff < delay && distX < maxDistance && distY < maxDistance) {
        const rect = element.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        callback({ x, y });
        lastTapTime = 0; // reset so triple-tap won't fire twice
        lastTouchDoubleTapAt = currentTime; // mark that a touch double-tap occurred
      } else {
        lastTapTime = currentTime;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
      // Don't prevent single touch movement - this allows scrolling
    };

    const handleClick = (e: MouseEvent) => {
      const currentTime = Date.now();

      // If a touch double-tap was just handled, ignore click-based detection briefly
      if (currentTime - lastTouchDoubleTapAt < 200) {
        return;
      }

      const timeDiff = currentTime - lastTapTime;
      const distX = Math.abs(e.clientX - lastClickX);
      const distY = Math.abs(e.clientY - lastClickY);

      if (timeDiff < delay && distX < maxDistance && distY < maxDistance) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        callback({ x, y });
        lastTapTime = 0; // reset so triple-click won't fire twice
      } else {
        lastTapTime = currentTime;
        lastClickX = e.clientX;
        lastClickY = e.clientY;
      }
    };

    // Add CSS properties to prevent zooming but allow scrolling
    element.style.touchAction = "pan-x pan-y"; // Allow horizontal and vertical scrolling
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    (element.style as any).webkitTouchCallout = "none";

    // Attach listeners. Avoid attaching click handler on touch-capable devices to prevent double firing
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    if (!isTouchCapable) {
      element.addEventListener("click", handleClick);
    }

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("click", handleClick);

      // Clean up CSS properties
      element.style.touchAction = "";
      element.style.userSelect = "";
      element.style.webkitUserSelect = "";
      (element.style as any).webkitTouchCallout = "";
    };
  }, [ref, callback, delay, maxDistance]);
}
