import { ClipboardList, Filter, BarChart3, FileCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { GradualBlurEdge } from "./GradualBlur";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Define task and constraints",
    description: "Specify your use case, hardware, latency, and license requirements.",
  },
  {
    icon: Filter,
    number: "02",
    title: "Filter by feasibility",
    description: "Models are filtered based on hard constraints you can't compromise on.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Rank by tradeoffs",
    description: "Remaining models are scored and ranked by your priority weights.",
  },
  {
    icon: FileCheck,
    number: "04",
    title: "Get recommendations",
    description: "Clear explanations with tradeoff notes and models to avoid.",
  },
];

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: progressRef, progress } = useScrollProgress<HTMLDivElement>({ offset: 100 });

  // Calculate the line length based on scroll progress
  const lineProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.6));

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Luminosity effect at top */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div 
          ref={headerRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 scroll-fade-up",
            headerVisible && "visible"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Principled recommendations from curated model metadata, 
            constraint filtering, and tradeoff scoring.
          </p>
        </div>

        {/* Pipeline visualization with SVG connector */}
        <div ref={progressRef} className="max-w-5xl mx-auto relative">
          {/* SVG connecting line - desktop only */}
          <svg 
            className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 pointer-events-none"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Background line */}
            <line 
              x1="10%" 
              y1="50%" 
              x2="90%" 
              y2="50%" 
              stroke="hsl(var(--border))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Animated progress line */}
            <line 
              x1="10%" 
              y1="50%" 
              x2="90%" 
              y2="50%" 
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (1000 * lineProgress)}
              className="transition-all duration-100"
            />
          </svg>

          {/* Step cards */}
          <div className="grid md:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <StepCard 
                key={step.number} 
                step={step} 
                index={index} 
                isActive={lineProgress > (index / steps.length)}
              />
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="max-w-2xl mx-auto mt-12 relative">
          <GradualBlurEdge direction="left" strength="sm" />
          <GradualBlurEdge direction="right" strength="sm" />
          <div className="text-center text-sm text-muted-foreground glass-3d rounded-2xl p-4">
            <span className="font-medium text-foreground">No live inference.</span>
            {" "}Recommendations are based on curated metadata—not API calls to models.
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ 
  step, 
  index,
  isActive 
}: { 
  step: typeof steps[0]; 
  index: number;
  isActive: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const Icon = step.icon;

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "card-glass p-6 h-full scroll-fade-up hover-lift-3d transition-all duration-500",
          isVisible && "visible",
          isActive && "glow-intense"
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-primary/10 text-primary"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-xs font-mono transition-colors duration-500",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {step.number}
            </span>
          </div>
          <h3 className="font-semibold mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connection dot indicator */}
      <div className={cn(
        "hidden md:flex absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-500",
        isActive 
          ? "bg-primary border-primary glow" 
          : "bg-background border-border"
      )} />
    </div>
  );
}
