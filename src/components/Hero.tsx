import { useRef, useCallback } from "react";
import { PremiumCTA } from "./ui/premium-cta";
import { useCharReveal } from "@/hooks/useCharReveal";

export function Hero() {
  const line1 = useCharReveal("Choose the right model", 20);
  const line2 = useCharReveal("before you build.", 20);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
    spotlightRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = "0";
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-20 dot-grid hero-glow overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute top-0 left-0 w-[320px] h-[320px] rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow) / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline with character reveal */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            <span className="block">{line1}</span>
            <span className="block text-primary">{line2}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "600ms" }}
          >
            Principled model recommendations based on your constraints, not benchmarks.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "750ms" }}
          >
            <PremiumCTA
              onClick={() => scrollToSection("demo")}
              icon="arrow"
            >
              Try the demo
            </PremiumCTA>
            <PremiumCTA
              onClick={() => scrollToSection("how-it-works")}
              variant="secondary"
              icon="arrow"
            >
              How it works
            </PremiumCTA>
          </div>

          {/* Version tag */}
          <p
            className="mt-8 text-xs font-mono text-muted-foreground/60 animate-fade-in"
            style={{ animationDelay: "1000ms" }}
          >
            v0.1 · open source
          </p>
        </div>
      </div>

      {/* Rolling model tickers */}
      <div className="absolute bottom-6 left-0 right-0 space-y-2 overflow-hidden pointer-events-none animate-fade-in" style={{ animationDelay: "1200ms" }}>
        {/* Row 1 — left */}
        <div className="model-ticker whitespace-nowrap text-xs font-mono text-muted-foreground/50 dark:text-muted-foreground/30">
          <span className="inline-block">
            meta-llama/Llama-3.1-70B&nbsp;&nbsp;·&nbsp;&nbsp;mistralai/Mixtral-8x7B-v0.1&nbsp;&nbsp;·&nbsp;&nbsp;google/gemma-2-27b&nbsp;&nbsp;·&nbsp;&nbsp;Qwen/Qwen2.5-72B&nbsp;&nbsp;·&nbsp;&nbsp;microsoft/phi-3-medium-128k&nbsp;&nbsp;·&nbsp;&nbsp;NousResearch/Hermes-3-Llama-3.1-8B&nbsp;&nbsp;·&nbsp;&nbsp;deepseek-ai/DeepSeek-V2.5&nbsp;&nbsp;·&nbsp;&nbsp;01-ai/Yi-1.5-34B&nbsp;&nbsp;·&nbsp;&nbsp;tiiuae/falcon-40b&nbsp;&nbsp;·&nbsp;&nbsp;stabilityai/stablelm-2-12b&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
          <span className="inline-block">
            meta-llama/Llama-3.1-70B&nbsp;&nbsp;·&nbsp;&nbsp;mistralai/Mixtral-8x7B-v0.1&nbsp;&nbsp;·&nbsp;&nbsp;google/gemma-2-27b&nbsp;&nbsp;·&nbsp;&nbsp;Qwen/Qwen2.5-72B&nbsp;&nbsp;·&nbsp;&nbsp;microsoft/phi-3-medium-128k&nbsp;&nbsp;·&nbsp;&nbsp;NousResearch/Hermes-3-Llama-3.1-8B&nbsp;&nbsp;·&nbsp;&nbsp;deepseek-ai/DeepSeek-V2.5&nbsp;&nbsp;·&nbsp;&nbsp;01-ai/Yi-1.5-34B&nbsp;&nbsp;·&nbsp;&nbsp;tiiuae/falcon-40b&nbsp;&nbsp;·&nbsp;&nbsp;stabilityai/stablelm-2-12b&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
        </div>
        {/* Row 2 — right */}
        <div className="model-ticker-reverse whitespace-nowrap text-xs font-mono text-muted-foreground/50 dark:text-muted-foreground/30">
          <span className="inline-block">
            THUDM/glm-4-9b&nbsp;&nbsp;·&nbsp;&nbsp;databricks/dbrx-instruct&nbsp;&nbsp;·&nbsp;&nbsp;allenai/OLMo-7B&nbsp;&nbsp;·&nbsp;&nbsp;upstage/SOLAR-10.7B-v1.0&nbsp;&nbsp;·&nbsp;&nbsp;HuggingFaceH4/zephyr-7b-beta&nbsp;&nbsp;·&nbsp;&nbsp;CohereForAI/c4ai-command-r-v01&nbsp;&nbsp;·&nbsp;&nbsp;bigcode/starcoder2-15b&nbsp;&nbsp;·&nbsp;&nbsp;mosaicml/mpt-30b&nbsp;&nbsp;·&nbsp;&nbsp;EleutherAI/gpt-neox-20b&nbsp;&nbsp;·&nbsp;&nbsp;teknium/OpenHermes-2.5-Mistral-7B&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
          <span className="inline-block">
            THUDM/glm-4-9b&nbsp;&nbsp;·&nbsp;&nbsp;databricks/dbrx-instruct&nbsp;&nbsp;·&nbsp;&nbsp;allenai/OLMo-7B&nbsp;&nbsp;·&nbsp;&nbsp;upstage/SOLAR-10.7B-v1.0&nbsp;&nbsp;·&nbsp;&nbsp;HuggingFaceH4/zephyr-7b-beta&nbsp;&nbsp;·&nbsp;&nbsp;CohereForAI/c4ai-command-r-v01&nbsp;&nbsp;·&nbsp;&nbsp;bigcode/starcoder2-15b&nbsp;&nbsp;·&nbsp;&nbsp;mosaicml/mpt-30b&nbsp;&nbsp;·&nbsp;&nbsp;EleutherAI/gpt-neox-20b&nbsp;&nbsp;·&nbsp;&nbsp;teknium/OpenHermes-2.5-Mistral-7B&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
