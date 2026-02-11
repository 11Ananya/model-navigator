import { useEffect, useRef } from "react";

export function useScrollDrawnLine(pathId: string) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const path = document.getElementById(pathId) as SVGPathElement;

    if (!path) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Calculate progress: 0 when section enters viewport, 1 when fully scrolled past
      let progress = 0;

      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Section is in viewport
        const viewportTop = Math.max(0, -sectionTop);
        const scrollableHeight = sectionHeight - windowHeight;
        
        if (scrollableHeight > 0) {
          progress = Math.min(1, Math.max(0, viewportTop / scrollableHeight));
        } else {
          // Section fits in viewport, show full line
          progress = 1;
        }
      } else if (sectionTop + sectionHeight <= 0) {
        // Section is above viewport
        progress = 1;
      }

      // Update stroke dash offset
      const offset = pathLength * (1 - progress);
      path.style.strokeDashoffset = `${offset}`;
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathId]);

  return containerRef;
}
