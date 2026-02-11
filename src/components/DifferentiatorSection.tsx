import { Check, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const differentiators = [
  { text: "Constraint-aware decisions", isPositive: true },
  { text: "Explicit tradeoffs", isPositive: true },
  { text: "Curated model metadata", isPositive: true },
  { text: "No model inference required", isPositive: true },
  { text: "No hype or marketing benchmarks", isPositive: false },
  { text: "No black box recommendations", isPositive: false },
];

export function DifferentiatorSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 scroll-fade-up",
            isVisible && "visible"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why It's Different
          </h2>
          <p className="text-lg text-muted-foreground">
            InfraLens helps teams make better first decisions, not perfect ones.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card-depth-lg light-interaction p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {differentiators.map((item, index) => (
                <DifferentiatorItem key={item.text} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DifferentiatorItem({ 
  item, 
  index 
}: { 
  item: typeof differentiators[0]; 
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-colors scroll-fade-up",
        item.isPositive ? "bg-primary/5" : "bg-secondary",
        isVisible && "visible"
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
        item.isPositive ? "bg-primary/10" : "bg-muted"
      )}>
        {item.isPositive ? (
          <Check className="w-3.5 h-3.5 text-primary" />
        ) : (
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
      <span className={cn(
        "text-sm font-medium",
        item.isPositive ? "text-foreground" : "text-muted-foreground"
      )}>
        {item.text}
      </span>
    </div>
  );
}
