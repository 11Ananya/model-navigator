import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const problems = [
  "Model selection is fragmented - thousands of options, no single source of truth",
  "Benchmarks don't reflect deployment reality",
  "Hardware limits surface after you've already committed",
  "Licensing risks are buried in model cards",
];

const solutions = [
  "Constraint-aware decisions, not marketing benchmarks",
  "Explicit tradeoffs - you see what you're giving up",
  "Curated metadata, no live model inference",
  "No black box - every recommendation is explainable",
];

export function WhySection() {
  const { ref: problemRef, isVisible: problemVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: solutionRef, isVisible: solutionVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <img src="/logo_.png" alt="InfraLens" className="w-24 h-24 md:w-36 md:h-36 rounded-xl object-cover" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why InfraLens
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-lg">
            Model selection shouldn't be guesswork. InfraLens helps teams make
            better first decisions - not perfect ones.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Problem */}
            <div
              ref={problemRef}
              className={cn(
                "glass-card border-destructive/20 p-6 scroll-fade-up",
                problemVisible && "visible"
              )}
            >
              <h3 className="font-semibold mb-4 text-destructive/80">The Problem</h3>
              <div className="space-y-3">
                {problems.map((text) => (
                  <div key={text} className="flex items-start gap-3 py-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-destructive/10">
                      <X className="w-3 h-3 text-destructive/70" />
                    </div>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* The InfraLens Approach */}
            <div
              ref={solutionRef}
              className={cn(
                "glass-card border-primary/20 p-6 scroll-fade-up",
                solutionVisible && "visible"
              )}
            >
              <h3 className="font-semibold mb-4 text-primary">The InfraLens Approach</h3>
              <div className="space-y-3">
                {solutions.map((text) => (
                  <div key={text} className="flex items-start gap-3 py-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-primary/10">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed text-foreground font-medium">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audience tags */}
        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center md:text-left tracking-wide">
            Built for{" "}
            <span className="font-medium text-foreground">ML engineers</span>{" · "}
            <span className="font-medium text-foreground">Startups</span>{" · "}
            <span className="font-medium text-foreground">Open-source teams</span>{" · "}
            <span className="font-medium text-foreground">Privacy-first orgs</span>
          </p>
        </div>
      </div>
    </section>
  );
}
