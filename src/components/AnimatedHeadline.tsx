import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function AnimatedHeadline({ 
  children, 
  className, 
  delay = 0,
  as: Component = "h1" 
}: AnimatedHeadlineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Split by line breaks first, then by words
  const lines = children.split('\n');

  return (
    <Component className={cn("overflow-hidden", className)}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split(' ').map((word, wordIndex) => {
            const globalIndex = lines.slice(0, lineIndex).join(' ').split(' ').length + wordIndex;
            return (
              <span
                key={`${lineIndex}-${wordIndex}`}
                className="inline-block overflow-hidden"
              >
                <span
                  className={cn(
                    "inline-block transition-transform",
                    isVisible ? "animate-word-reveal" : "translate-y-full"
                  )}
                  style={{
                    animationDelay: isVisible ? `${globalIndex * 80}ms` : "0ms",
                    animationFillMode: "forwards",
                  }}
                >
                  {word}
                </span>
                {wordIndex < line.split(' ').length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}
