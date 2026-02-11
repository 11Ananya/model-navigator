import { ArrowRight } from "lucide-react";
import { PremiumCTA } from "./ui/premium-cta";
import { MaskedHeadline } from "./MaskedHeadline";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 gradient-mesh">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-8 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ML Infrastructure Decision Support
          </div>

          {/* Headline with masked animation */}
          <div className="mb-6">
            <MaskedHeadline className="mb-2">
              Open-Source LLM
            </MaskedHeadline>
            <MaskedHeadline className="text-muted-foreground mb-2">
              Infrastructure
            </MaskedHeadline>
            <MaskedHeadline>
              Decision Support
            </MaskedHeadline>
          </div>

          {/* Tagline */}
          <p 
            className="text-lg text-primary font-medium mb-4 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Choose the right model before you build.
          </p>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            Get principled model recommendations based on task requirements, 
            hardware constraints, latency targets, and licensing.
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <PremiumCTA
              href="https://infralens.example.com"
              icon="external"
            >
              Get model recommendations
            </PremiumCTA>
            <PremiumCTA
              onClick={() => scrollToSection("how-it-works")}
              variant="secondary"
              icon="arrow"
            >
              How it works
            </PremiumCTA>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in"
          style={{ animationDelay: "800ms" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
