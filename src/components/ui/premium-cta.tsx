import { useEffect, useRef, useState, ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

interface PremiumCTAProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  icon?: "arrow" | "external";
}

export function PremiumCTA({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  icon = "arrow",
}: PremiumCTAProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Entrance animation
  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const tl = gsap.timeline();

    // Initial state: slightly below, faded, with blur
    gsap.set(button, {
      y: 12,
      opacity: 0,
      filter: "blur(4px)",
    });

    // Animate entrance
    tl.to(button, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  // Mouse tracking for glow
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || !glowRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // Update glow position
    gsap.to(glowRef.current, {
      x: x,
      y: y,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    if (!underlineRef.current || !iconRef.current) return;

    // Expand underline
    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
    });

    // Shift icon
    gsap.to(iconRef.current, {
      x: 3,
      duration: 0.3,
      ease: "power2.out",
    });

    // Lift button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: -2,
        boxShadow: "0 8px 24px -4px hsl(var(--foreground) / 0.08), 0 16px 48px -8px hsl(var(--foreground) / 0.04)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!underlineRef.current || !iconRef.current) return;

    // Collapse underline
    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Reset icon
    gsap.to(iconRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Reset button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: 0,
        boxShadow: "0 4px 12px -2px hsl(var(--foreground) / 0.04), 0 8px 24px -4px hsl(var(--foreground) / 0.02)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const buttonClasses = cn(
    "group relative inline-flex items-center justify-center gap-2",
    "px-8 h-12 rounded-2xl",
    "font-medium text-base",
    "backdrop-blur-xl",
    "border border-border/50",
    "transition-all duration-300",
    "overflow-hidden",
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-background/80 text-foreground",
    "shadow-[0_4px_12px_-2px_hsl(var(--foreground)/0.04),0_8px_24px_-4px_hsl(var(--foreground)/0.02)]",
    className
  );

  const content = (
    <>
      {/* Radial glow effect */}
      <div
        ref={glowRef}
        className={cn(
          "absolute pointer-events-none",
          "w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300",
          variant === "primary"
            ? "bg-primary-foreground"
            : "bg-primary"
        )}
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
      />

      {/* Underline */}
      <div
        ref={underlineRef}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0"
        style={{
          background: variant === "primary" 
            ? "hsl(var(--primary-foreground))" 
            : "hsl(var(--primary))",
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
      <span ref={iconRef} className="relative z-10 inline-flex">
        {icon === "arrow" ? (
          <ArrowRight className="h-4 w-4" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={buttonClasses}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
}
