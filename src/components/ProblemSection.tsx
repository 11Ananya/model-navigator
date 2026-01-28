import { AlertTriangle, Puzzle, Cpu, Scale } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: Puzzle,
    title: "Open-source model selection is hard",
    description: "Thousands of models. Fragmented benchmarks. No single source of truth.",
  },
  {
    icon: Scale,
    title: "Benchmark scores rarely reflect reality",
    description: "Academic metrics don't capture real deployment constraints.",
  },
  {
    icon: Cpu,
    title: "Hardware limits are discovered too late",
    description: "Memory requirements surface after you've already committed.",
  },
  {
    icon: AlertTriangle,
    title: "Licensing risks are overlooked",
    description: "Commercial use restrictions buried in model cards.",
  },
];

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 scroll-fade-up",
            isVisible && "visible"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What It Solves
          </h2>
          <p className="text-lg text-muted-foreground">
            Model selection shouldn't be guesswork.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <ProblemCard key={problem.title} problem={problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ 
  problem, 
  index 
}: { 
  problem: typeof problems[0]; 
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const Icon = problem.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "card-glass p-6 hover-lift-3d scroll-fade-up",
        isVisible && "visible"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{problem.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {problem.description}
          </p>
        </div>
      </div>
    </div>
  );
}
