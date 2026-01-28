import { useEffect, useState, useRef, RefObject } from "react";

interface UseScrollProgressOptions {
  offset?: number; // Start tracking when element is this many pixels from viewport
  clamp?: boolean; // Clamp progress between 0 and 1
}

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollProgressOptions = {}
): { ref: RefObject<T>; progress: number } {
  const { offset = 0, clamp = true } = options;
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the element we've scrolled
      // 0 = element just entered viewport from bottom
      // 1 = element has left viewport at top
      const elementTop = rect.top - windowHeight + offset;
      const elementBottom = rect.bottom - offset;
      const totalScrollDistance = elementBottom - elementTop;
      
      let currentProgress = -elementTop / totalScrollDistance;
      
      if (clamp) {
        currentProgress = Math.max(0, Math.min(1, currentProgress));
      }
      
      setProgress(currentProgress);
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [offset, clamp]);

  return { ref, progress };
}
