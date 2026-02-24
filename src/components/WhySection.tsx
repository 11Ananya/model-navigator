import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const points = [
  { text: "Model selection is fragmented -thousands of options, no single source of truth", positive: false },
  { text: "Benchmarks don't reflect deployment reality", positive: false },
  { text: "Hardware limits surface after you've already committed", positive: false },
  { text: "Licensing risks are buried in model cards", positive: false },
  { text: "Constraint-aware decisions, not marketing benchmarks", positive: true },
  { text: "Explicit tradeoffs -you see what you're giving up", positive: true },
  { text: "Curated metadata, no live model inference", positive: true },
  { text: "No black box -every recommendation is explainable", positive: true },
];

export function WhySection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className={cn("py-24 md:py-32 scroll-fade-up", isVisible && "visible")}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 md:gap-16 items-start">
          {/* Left column -heading + description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Why InfraLens
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Model selection shouldn't be guesswork. InfraLens helps teams make
              better first decisions -not perfect ones.
            </p>
          </div>

          {/* Right column -key points as text rows */}
          <div className="md:col-span-3 space-y-3">
            {points.map((point) => (
              <div key={point.text} className="flex items-start gap-3 py-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    point.positive
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {point.positive ? (
                    <Check className="w-3 h-3 text-primary" />
                  ) : (
                    <X className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm leading-relaxed",
                    point.positive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {point.text}
                </span>
              </div>
            ))}
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
