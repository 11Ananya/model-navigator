import type { ReactNode } from "react";

interface FadeEdgeProps {
  children: ReactNode;
  direction?: "top" | "bottom" | "both";
  strength?: number;
  className?: string;
}

export function FadeEdge({
  children,
  direction = "bottom",
  strength = 48,
  className,
}: FadeEdgeProps) {
  const masks: Record<string, string> = {
    top: `linear-gradient(to bottom, transparent 0px, black ${strength}px)`,
    bottom: `linear-gradient(to bottom, black calc(100% - ${strength}px), transparent 100%)`,
    both: `linear-gradient(to bottom, transparent 0px, black ${strength}px, black calc(100% - ${strength}px), transparent 100%)`,
  };

  return (
    <div className={className} style={{ maskImage: masks[direction], WebkitMaskImage: masks[direction] }}>
      {children}
    </div>
  );
}
