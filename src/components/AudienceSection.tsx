import { Rocket, Users, Wrench, Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const audiences = [
  {
    icon: Rocket,
    title: "Infra-focused startups",
    description: "Building production ML systems with limited resources and high stakes.",
  },
  {
    icon: Users,
    title: "Open-source teams",
    description: "Evaluating models for community projects with specific license needs.",
  },
  {
    icon: Wrench,
    title: "ML engineers",
    description: "Making deployment decisions based on real infrastructure constraints.",
  },
  {
    icon: Shield,
    title: "Privacy-conscious companies",
    description: "Self-hosting models with strict data sovereignty requirements.",
  },
];

export function AudienceSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="who-its-for" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16 scroll-fade-up",
            isVisible && "visible"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Who This Is For
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for teams that need infrastructure decisions, not demos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <AudienceCard key={audience.title} audience={audience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({ 
  audience, 
  index 
}: { 
  audience: typeof audiences[0]; 
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const Icon = audience.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "card-depth p-6 text-center hover-lift scroll-fade-up",
        isVisible && "visible"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-2">{audience.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {audience.description}
      </p>
    </div>
  );
}
