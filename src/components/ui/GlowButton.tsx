import * as React from "react";
import { useRef, useState, useCallback } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowButtonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 px-8 rounded-xl text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
  showUnderline?: boolean;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant, size, asChild = false, showUnderline = false, children, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovering(true), []);
    const handleMouseLeave = useCallback(() => setIsHovering(false), []);

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          glowButtonVariants({ variant, size, className }),
          "animate-slide-in-blur"
        )}
        ref={(node) => {
          // Handle both refs
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Dynamic glow effect that follows mouse */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isHovering
              ? `radial-gradient(120px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--glow) / 0.4), transparent 60%)`
              : "transparent",
          }}
        />

        {/* Content wrapper with arrow shift */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Underline expansion effect */}
        {showUnderline && (
          <span className="absolute bottom-2 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary-foreground/80 transition-all duration-300 ease-out group-hover:w-[calc(100%-2rem)]" />
        )}
      </Comp>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };
