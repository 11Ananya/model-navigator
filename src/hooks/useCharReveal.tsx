import { useMemo } from "react";
import type { CSSProperties, ReactElement } from "react";

/**
 * Returns an array of <span> elements with staggered blur-to-focus CSS animation.
 * Respects prefers-reduced-motion (renders plain text immediately).
 */
export function useCharReveal(
  text: string,
  staggerMs = 20
): ReactElement[] {
  return useMemo(() => {
    return [...text].map((char, i) => {
      const style: CSSProperties = {
        display: "inline-block",
        animationName: "charReveal",
        animationDuration: "0.5s",
        animationTimingFunction: "ease-out",
        animationFillMode: "both",
        animationDelay: `${i * staggerMs}ms`,
      };

      return (
        <span key={i} className="char-reveal" style={style}>
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  }, [text, staggerMs]);
}
