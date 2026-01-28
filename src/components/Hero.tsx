import { ArrowRight, ExternalLink } from "lucide-react";
import { GlowButton } from "./ui/GlowButton";
import { AnimatedHeadline } from "./AnimatedHeadline";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 gradient-mesh luminosity-overlay">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d text-sm text-muted-foreground mb-8 animate-slide-in-blur"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ML Infrastructure Decision Support
          </div>

          {/* Animated Headline */}
          <div className="mb-6">
            <AnimatedHeadline
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              delay={200}
            >
              Open-Source LLM
            </AnimatedHeadline>
            <AnimatedHeadline
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-muted-foreground"
              delay={400}
            >
              Infrastructure
            </AnimatedHeadline>
            <AnimatedHeadline
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              delay={600}
            >
              Decision Support
            </AnimatedHeadline>
          </div>

          {/* Tagline */}
          <p 
            className="text-lg text-primary font-medium mb-4 animate-slide-in-blur"
            style={{ animationDelay: "800ms" }}
          >
            Choose the right model before you build.
          </p>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-in-blur"
            style={{ animationDelay: "900ms" }}
          >
            Get principled model recommendations based on task requirements, 
            hardware constraints, latency targets, and licensing.
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-blur"
            style={{ animationDelay: "1000ms" }}
          >
            <GlowButton
              asChild
              href="https://infralens.example.com"
              size="lg"
              className="glow-intense"
              showUnderline
            >
              Get model recommendations
              <ExternalLink className="h-4 w-4 arrow-shift" />
            </GlowButton>
            <GlowButton
              variant="outline"
              size="lg"
              className="glass-3d"
              onClick={() => scrollToSection("how-it-works")}
            >
              How it works
              <ArrowRight className="h-4 w-4 arrow-shift" />
            </GlowButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-slide-in-blur"
          style={{ animationDelay: "1200ms" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
