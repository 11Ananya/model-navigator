import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface MaskedHeadlineProps {
  children: string;
  className?: string;
}

export function MaskedHeadline({ children, className }: MaskedHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const words = children.split(" ");

  useEffect(() => {
    if (!containerRef.current) return;

    const wordElements = containerRef.current.querySelectorAll<HTMLElement>(".masked-word");
    
    wordElements.forEach((wordElement, index) => {
      // Set initial state
      gsap.set(wordElement, { y: "100%" });
      
      // Animate word sliding up
      gsap.to(wordElement, {
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power4.out", // Fast start, slow end - cinematic feel
      });
    });
  }, [children]);

  return (
    <h1
      ref={containerRef}
      className={cn(
        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
        className
      )}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block relative mr-2"
          style={{ overflow: "hidden", height: "1.2em", verticalAlign: "top" }}
        >
          <span className="block relative" style={{ height: "1.2em", overflow: "hidden" }}>
            <span className="block masked-word">
              {word}{index < words.length - 1 ? " " : ""}
            </span>
          </span>
        </span>
      ))}
    </h1>
  );
}
