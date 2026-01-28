import { cn } from "@/lib/utils";

interface GradualBlurProps {
  className?: string;
  direction?: "top" | "bottom" | "left" | "right";
  strength?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

const strengthMap = {
  sm: {
    blur: "8px",
    size: "60px",
  },
  md: {
    blur: "16px",
    size: "100px",
  },
  lg: {
    blur: "24px",
    size: "150px",
  },
  xl: {
    blur: "32px",
    size: "200px",
  },
};

const directionMap = {
  top: {
    position: "top-0 left-0 right-0",
    gradient: "to bottom",
    height: true,
  },
  bottom: {
    position: "bottom-0 left-0 right-0",
    gradient: "to top",
    height: true,
  },
  left: {
    position: "top-0 left-0 bottom-0",
    gradient: "to right",
    height: false,
  },
  right: {
    position: "top-0 right-0 bottom-0",
    gradient: "to left",
    height: false,
  },
};

export function GradualBlur({
  className,
  direction = "bottom",
  strength = "md",
  children,
}: GradualBlurProps) {
  const { blur, size } = strengthMap[strength];
  const { position, gradient, height } = directionMap[direction];

  return (
    <div className={cn("relative", className)}>
      {children}
      <div
        className={cn("pointer-events-none absolute z-10", position)}
        style={{
          [height ? "height" : "width"]: size,
          backdropFilter: `blur(${blur})`,
          WebkitBackdropFilter: `blur(${blur})`,
          maskImage: `linear-gradient(${gradient}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
          WebkitMaskImage: `linear-gradient(${gradient}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
        }}
      />
    </div>
  );
}

// Simpler variant that uses CSS-only approach with opacity mask
export function GradualBlurEdge({
  className,
  direction = "bottom",
  strength = "md",
}: Omit<GradualBlurProps, "children">) {
  const { size } = strengthMap[strength];
  const { position, gradient, height } = directionMap[direction];

  return (
    <div
      className={cn("pointer-events-none absolute z-10", position, className)}
      style={{
        [height ? "height" : "width"]: size,
        background: `linear-gradient(${gradient}, hsl(var(--background)) 0%, transparent 100%)`,
      }}
    />
  );
}
