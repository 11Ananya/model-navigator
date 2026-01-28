import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

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

          {/* Headline */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Open-Source LLM
            <br />
            <span className="text-muted-foreground">Infrastructure</span>
            <br />
            Decision Support
          </h1>

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
            <Button
              asChild
              size="lg"
              className="rounded-xl text-base px-8 h-12 glow"
            >
              <a
                href="https://infralens.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get model recommendations
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl text-base px-8 h-12"
              onClick={() => scrollToSection("how-it-works")}
            >
              How it works
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
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
