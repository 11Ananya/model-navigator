import { useRef, useCallback, useState, useEffect } from "react";
import { gsap } from "gsap";
import { PremiumCTA } from "./ui/premium-cta";
// @ts-expect-error - JSX component without types
import TextType from "./TextType";

const COMMANDS = [
  "$ infralens rank --task summarization --max-cost 0.002 --min-context 32k",
  "$ infralens rank --task code-gen --max-latency 150ms --license permissive",
  "$ infralens rank --task rag --gpu a100 --privacy on-prem",
];

interface OutputLine {
  text: string;
  type: "info" | "result" | "done" | "blank";
}

const OUTPUTS: OutputLine[][] = [
  [
    { text: "  Scanning 847 models...", type: "info" },
    { text: "  Filtered to 23 candidates", type: "info" },
    { text: "", type: "blank" },
    { text: "  #1  Qwen/Qwen2.5-72B          0.94", type: "result" },
    { text: "  #2  meta-llama/Llama-3.1-70B   0.91", type: "result" },
    { text: "  #3  mistralai/Mixtral-8x7B     0.87", type: "result" },
    { text: "", type: "blank" },
    { text: "  Done in 0.3s", type: "done" },
  ],
  [
    { text: "  Scanning 847 models...", type: "info" },
    { text: "  Filtered to 18 candidates", type: "info" },
    { text: "", type: "blank" },
    { text: "  #1  bigcode/starcoder2-15b     0.92", type: "result" },
    { text: "  #2  deepseek-ai/DeepSeek-V2.5  0.89", type: "result" },
    { text: "  #3  meta-llama/CodeLlama-34b   0.85", type: "result" },
    { text: "", type: "blank" },
    { text: "  Done in 0.2s", type: "done" },
  ],
  [
    { text: "  Scanning 847 models...", type: "info" },
    { text: "  Filtered to 9 candidates", type: "info" },
    { text: "", type: "blank" },
    { text: "  #1  meta-llama/Llama-3.1-70B   0.96", type: "result" },
    { text: "  #2  NousResearch/Hermes-3-8B   0.90", type: "result" },
    { text: "  #3  allenai/OLMo-7B            0.84", type: "result" },
    { text: "", type: "blank" },
    { text: "  Done in 0.4s", type: "done" },
  ],
];

export function Hero() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [outputIndex, setOutputIndex] = useState(0);

  useEffect(() => {
    // Hide underline initially
    gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({ delay: 2.0 });
    // Roll up and out, then back in from below (slower)
    tl.to(word1Ref.current, { y: "-110%", duration: 0.5, ease: "power2.in" })
      .set(word1Ref.current, { y: "110%" })
      .to(word1Ref.current, { y: "0%", duration: 0.6, ease: "power3.out" })
      .to(word2Ref.current, { y: "-110%", duration: 0.5, ease: "power2.in" }, "-=0.15")
      .set(word2Ref.current, { y: "110%" })
      .to(word2Ref.current, { y: "0%", duration: 0.6, ease: "power3.out" })
      // Underline sweeps in after roll-up finishes
      .to(underlineRef.current, { scaleX: 1, duration: 0.6, ease: "power2.out" }, "+=0.15");
    return () => { tl.kill(); };
  }, []);
  const [outputVisible, setOutputVisible] = useState(true);

  const handleSentenceComplete = useCallback((_text: string, index: number) => {
    // Fade out output before switching
    setOutputVisible(false);
    setTimeout(() => {
      setOutputIndex((index + 1) % OUTPUTS.length);
      setOutputVisible(true);
    }, 400);
  }, []);

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

  const currentOutput = OUTPUTS[outputIndex];

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 dot-grid overflow-hidden"
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

      <div className="container relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
          {/* Left */}
          <div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="block font-semibold text-foreground">
                Stop{" "}
                <span className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
                  <span ref={word1Ref} className="inline-block">
                    guessing.
                  </span>
                </span>
              </span>
              <span className="block font-bold text-foreground whitespace-nowrap">
                Start{" "}
                <span className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
                  <span ref={word2Ref} className="inline-block relative">
                    engineering.
                    <span
                      ref={underlineRef}
                      className="absolute left-0 right-0 bottom-[-2px] h-[3px] bg-primary rounded-full"
                    />
                  </span>
                </span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              Constraint-driven model ranking for teams that ship. Define requirements, get deterministic recommendations.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: "450ms" }}
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

            <p
              className="mt-8 text-xs font-mono text-muted-foreground/60 animate-fade-in"
              style={{ animationDelay: "600ms" }}
            >
              v0.1 · open source
            </p>
          </div>

          {/* Right — Animated terminal */}
          <div
            className="hidden lg:block animate-fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="rounded-xl border border-border/60 bg-[#0a0a0b] overflow-hidden shadow-2xl shadow-black/20">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-2 text-[11px] font-mono text-white/25 tracking-wide">
                  infralens
                </span>
              </div>

              {/* Terminal body */}
              <div className="px-5 py-4 font-mono text-[13px] leading-[1.7] min-h-[300px]">
                {/* Typing command line */}
                <div className="text-white/90">
                  <TextType
                    text={COMMANDS}
                    typingSpeed={35}
                    deletingSpeed={15}
                    pauseDuration={3500}
                    loop
                    showCursor
                    cursorCharacter="▋"
                    cursorClassName="!text-white/70 !ml-0"
                    cursorBlinkDuration={0.53}
                    onSentenceComplete={handleSentenceComplete}
                  />
                </div>

                {/* Output block */}
                <div
                  className="mt-3 transition-opacity duration-300"
                  style={{ opacity: outputVisible ? 1 : 0 }}
                >
                  {currentOutput.map((line, i) => {
                    if (line.type === "blank") {
                      return <div key={i} className="h-[1.7em]" />;
                    }

                    let colorClass = "text-white/40";
                    if (line.type === "result") colorClass = "text-emerald-400/90";
                    else if (line.type === "done") colorClass = "text-white/60";

                    return (
                      <div key={i} className={colorClass}>
                        <span className="whitespace-pre">{line.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rolling model tickers */}
      <div className="absolute bottom-6 left-0 right-0 space-y-2 overflow-hidden pointer-events-none animate-fade-in" style={{ animationDelay: "1200ms" }}>
        <div className="model-ticker whitespace-nowrap text-xs font-mono text-muted-foreground/50 dark:text-muted-foreground/30">
          <span className="inline-block">
            meta-llama/Llama-3.1-70B&nbsp;&nbsp;·&nbsp;&nbsp;mistralai/Mixtral-8x7B-v0.1&nbsp;&nbsp;·&nbsp;&nbsp;google/gemma-2-27b&nbsp;&nbsp;·&nbsp;&nbsp;Qwen/Qwen2.5-72B&nbsp;&nbsp;·&nbsp;&nbsp;microsoft/phi-3-medium-128k&nbsp;&nbsp;·&nbsp;&nbsp;NousResearch/Hermes-3-Llama-3.1-8B&nbsp;&nbsp;·&nbsp;&nbsp;deepseek-ai/DeepSeek-V2.5&nbsp;&nbsp;·&nbsp;&nbsp;01-ai/Yi-1.5-34B&nbsp;&nbsp;·&nbsp;&nbsp;tiiuae/falcon-40b&nbsp;&nbsp;·&nbsp;&nbsp;stabilityai/stablelm-2-12b&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
          <span className="inline-block">
            meta-llama/Llama-3.1-70B&nbsp;&nbsp;·&nbsp;&nbsp;mistralai/Mixtral-8x7B-v0.1&nbsp;&nbsp;·&nbsp;&nbsp;google/gemma-2-27b&nbsp;&nbsp;·&nbsp;&nbsp;Qwen/Qwen2.5-72B&nbsp;&nbsp;·&nbsp;&nbsp;microsoft/phi-3-medium-128k&nbsp;&nbsp;·&nbsp;&nbsp;NousResearch/Hermes-3-Llama-3.1-8B&nbsp;&nbsp;·&nbsp;&nbsp;deepseek-ai/DeepSeek-V2.5&nbsp;&nbsp;·&nbsp;&nbsp;01-ai/Yi-1.5-34B&nbsp;&nbsp;·&nbsp;&nbsp;tiiuae/falcon-40b&nbsp;&nbsp;·&nbsp;&nbsp;stabilityai/stablelm-2-12b&nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
        </div>
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
