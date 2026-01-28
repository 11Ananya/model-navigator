import { ClipboardList, Filter, BarChart3, FileCheck, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

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
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 scroll-fade-up",
            isVisible && "visible"
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

        {/* Pipeline visualization */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} isLast={index === steps.length - 1} />
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="text-center text-sm text-muted-foreground bg-card/50 rounded-2xl p-4 border border-border/50">
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
  isLast 
}: { 
  step: typeof steps[0]; 
  index: number;
  isLast: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const Icon = step.icon;

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "card-depth p-6 h-full scroll-fade-up",
          isVisible && "visible"
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
          </div>
          <h3 className="font-semibold mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Arrow connector (hidden on mobile, shown on md+) */}
      {!isLast && (
        <div className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10">
          <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}
