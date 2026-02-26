import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { usePipelineTimeline } from "@/hooks/usePipelineTimeline";

// ─── Static data ─────────────────────────────────────────────────

const CONSTRAINTS = [
  { key: "task", value: "text-generation" },
  { key: "cost", value: "< $0.002/1k" },
  { key: "latency", value: "< 200ms" },
  { key: "license", value: "open-source" },
  { key: "privacy", value: "self-hosted" },
];

const FILTER_STEPS = [
  { label: "cost > $0.002", removed: 412 },
  { label: "latency > 200ms", removed: 289 },
  { label: "closed license", removed: 123 },
];

// 23 surviving indices out of 100 — matches the 847→23 narrative
const SURVIVING = new Set([
  3, 7, 12, 15, 19, 23, 27, 34, 39, 42, 45, 51, 56, 58, 63, 67, 71, 78, 84,
  86, 89, 91, 95,
]);

const BAR_DATA = [
  { name: "Qwen2.5-72B", score: 94, top: true },
  { name: "Llama-3.1-70B", score: 91, top: true },
  { name: "Mixtral-8x7B", score: 87, top: true },
  { name: "Gemma-2-27B", score: 76, top: false },
  { name: "Phi-3-medium", score: 68, top: false },
];

const OUTPUT_LINES: { text: string; type: "cmd" | "blank" | "result" | "done" }[] = [
  { text: "$ infralens rank --top 3", type: "cmd" },
  { text: "", type: "blank" },
  { text: "  #1  Qwen/Qwen2.5-72B        0.94", type: "result" },
  { text: "  #2  meta-llama/Llama-3.1-70B 0.91", type: "result" },
  { text: "  #3  mistralai/Mixtral-8x7B   0.87", type: "result" },
  { text: "", type: "blank" },
  { text: "  \u2713 Done in 0.3s", type: "done" },
];

// ─── Component ───────────────────────────────────────────────────

export function HowItWorks() {
  const pipelineRef = useRef<HTMLDivElement>(null);

  // Individual node refs for SVG path calculation
  const nodeRef0 = useRef<HTMLDivElement>(null);
  const nodeRef1 = useRef<HTMLDivElement>(null);
  const nodeRef2 = useRef<HTMLDivElement>(null);
  const nodeRef3 = useRef<HTMLDivElement>(null);

  const [svgPaths, setSvgPaths] = useState<string[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  // Calculate cubic-bezier paths between adjacent nodes
  const calculatePaths = useCallback(() => {
    const container = pipelineRef.current;
    if (!container) return;

    const cr = container.getBoundingClientRect();
    setSvgSize({ w: cr.width, h: cr.height });

    const refs = [nodeRef0, nodeRef1, nodeRef2, nodeRef3];
    const next: string[] = [];

    for (let i = 0; i < 3; i++) {
      const from = refs[i].current;
      const to = refs[i + 1].current;
      if (!from || !to) continue;

      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();

      const x1 = fr.right - cr.left;
      const y1 = fr.top + fr.height / 2 - cr.top;
      const x2 = tr.left - cr.left;
      const y2 = tr.top + tr.height / 2 - cr.top;

      const dx = x2 - x1;
      next.push(
        `M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1}, ${x1 + dx * 0.6} ${y2}, ${x2} ${y2}`
      );
    }

    setSvgPaths(next);
  }, []);

  // Compute paths after layout and on resize / font-load
  useLayoutEffect(() => {
    calculatePaths();
  }, [calculatePaths]);

  useEffect(() => {
    const recalc = () => calculatePaths();
    window.addEventListener("resize", recalc);
    document.fonts.ready.then(recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [calculatePaths]);

  // GSAP master timeline (runs after SVG paths are in the DOM)
  usePipelineTimeline(pipelineRef);

  return (
    <section id="how-it-works" className="py-24 md:py-32 border-t border-border/50">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* ── Header ── */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-lg">
            847 models in, 3 out. Filtered by hard constraints,
            scored by weighted tradeoffs, ranked in seconds.
          </p>
        </div>

        {/* ── Pipeline ── */}
        <div ref={pipelineRef} className="relative">
          {/* SVG connectors (desktop only) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            viewBox={`0 0 ${svgSize.w || 1} ${svgSize.h || 1}`}
            style={{ overflow: "visible" }}
          >
            {svgPaths.map((d, i) => (
              <g key={i}>
                {/* Draw path */}
                <path
                  d={d}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="none"
                  data-draw-path
                  style={{
                    filter:
                      "drop-shadow(0 0 3px hsl(var(--primary) / 0.3))",
                  }}
                />
                {/* Flow dashes (faded in by GSAP after draw completes) */}
                <path
                  d={d}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="none"
                  className="pipeline-flow"
                  data-flow-path
                  opacity={0}
                />
              </g>
            ))}
          </svg>

          {/* Nodes grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            {/* ── Node 1: Define Constraints ── */}
            <div ref={nodeRef0} data-pipeline-node>
              <div className="bg-card border border-border/50 rounded-xl p-4 h-full">
                <h4 className="font-semibold text-[15px] mb-3">
                  <span className="text-primary font-mono text-xs mr-2">
                    01
                  </span>
                  Define Constraints
                </h4>

                <div className="space-y-1.5 font-mono text-xs">
                  {CONSTRAINTS.map((c) => (
                    <div
                      key={c.key}
                      data-constraint-row
                      className="flex justify-between text-muted-foreground"
                    >
                      <span>{c.key}:</span>
                      <span className="text-foreground">{c.value}</span>
                    </div>
                  ))}
                </div>

                <div
                  data-model-badge
                  className="mt-3 text-center text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary"
                >
                  847 models
                </div>
              </div>
            </div>

            {/* Mobile connector 1 */}
            <div
              data-mobile-connector
              className="md:hidden flex justify-center -my-1"
            >
              <div className="w-0.5 h-8 bg-primary/60 rounded-full" />
            </div>

            {/* ── Node 2: Hard Filter ── */}
            <div ref={nodeRef1} data-pipeline-node>
              <div className="bg-card border border-border/50 rounded-xl p-4 h-full">
                <h4 className="font-semibold text-[15px] mb-3">
                  <span className="text-primary font-mono text-xs mr-2">
                    02
                  </span>
                  Hard Filter
                </h4>

                {/* Counter */}
                <div className="text-center mb-3">
                  <span
                    data-counter
                    className="text-[40px] font-bold leading-none tabular-nums"
                  >
                    847
                  </span>
                  <span className="text-muted-foreground text-xs block mt-1">
                    models remaining
                  </span>
                </div>

                {/* Dot grid */}
                <div className="grid grid-cols-10 gap-[3px] mb-3 px-1">
                  {Array.from({ length: 100 }, (_, i) => {
                    const survives = SURVIVING.has(i);
                    return (
                      <div
                        key={i}
                        {...(!survives && { "data-dot-dim": "" })}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: "hsl(var(--primary))",
                          opacity: survives ? 1 : 0.4,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Filter labels */}
                <div className="space-y-1 font-mono text-[10px]">
                  {FILTER_STEPS.map((step) => (
                    <div
                      key={step.label}
                      data-filter-label
                      className="flex justify-between text-muted-foreground/60"
                    >
                      <span className="line-through">{step.label}</span>
                      <span className="text-destructive">
                        &minus;{step.removed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile connector 2 */}
            <div
              data-mobile-connector
              className="md:hidden flex justify-center -my-1"
            >
              <div className="w-0.5 h-8 bg-primary/60 rounded-full" />
            </div>

            {/* ── Node 3: Score & Rank ── */}
            <div ref={nodeRef2} data-pipeline-node>
              <div className="bg-card border border-border/50 rounded-xl p-4 h-full">
                <h4 className="font-semibold text-[15px] mb-3">
                  <span className="text-primary font-mono text-xs mr-2">
                    03
                  </span>
                  Score &amp; Rank
                </h4>

                <div className="space-y-2">
                  {BAR_DATA.map((model) => (
                    <div
                      key={model.name}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground w-[72px] truncate">
                        {model.name}
                      </span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          data-bar
                          data-bar-target={`${model.score}%`}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: model.top
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground) / 0.25)",
                          }}
                        />
                      </div>
                      <span
                        data-bar-score
                        className="text-[10px] font-mono w-6 text-right tabular-nums"
                      >
                        {model.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile connector 3 */}
            <div
              data-mobile-connector
              className="md:hidden flex justify-center -my-1"
            >
              <div className="w-0.5 h-8 bg-primary/60 rounded-full" />
            </div>

            {/* ── Node 4: Terminal Output ── */}
            <div ref={nodeRef3} data-pipeline-node>
              <div className="rounded-xl border border-border bg-[#0a0a0b] overflow-hidden h-full">
                <h4 className="font-semibold text-[15px] px-4 pt-4 pb-2 text-white">
                  <span className="text-primary font-mono text-xs mr-2">
                    04
                  </span>
                  Output
                </h4>

                {/* Terminal body */}
                <div className="border-t border-white/[0.06]">
                  <div className="px-4 py-3 font-mono text-[11px] leading-[1.7] min-h-[110px]">
                    {OUTPUT_LINES.map((line, i) => {
                      if (line.type === "blank") {
                        return (
                          <div
                            key={i}
                            data-output-line
                            className="h-[1.7em]"
                          />
                        );
                      }

                      let color = "text-white/40";
                      if (line.type === "result")
                        color = "text-emerald-400/90";
                      else if (line.type === "done") color = "text-white/60";

                      return (
                        <div
                          key={i}
                          data-output-line
                          className={color}
                        >
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

        {/* Note */}
        <div className="mt-16">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              No live inference.
            </span>{" "}
            Recommendations come from curated metadata, not API calls to models.
          </p>
        </div>
      </div>
    </section>
  );
}
