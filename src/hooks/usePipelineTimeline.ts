import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Orchestrates the 4-phase pipeline animation via a single GSAP ScrollTrigger
 * timeline (~4.5 s total, plays once when the section enters the viewport).
 *
 * Phase timing (matches plan):
 *   0.0 s  Node 1 fades in, constraint rows stagger
 *   0.5 s  Path 1 draws, Node 2 enters
 *   1.0 s  Counter 847→23, dots dim, filter labels
 *   2.4 s  Path 2 draws, Node 3 enters
 *   2.8 s  Bar chart fills
 *   3.6 s  Path 3 draws, Node 4 enters
 *   4.0 s  Output lines appear
 *
 * Elements are found via data-* attributes set in HowItWorks.tsx.
 * prefers-reduced-motion: skips to final state immediately.
 */
export function usePipelineTimeline(
  containerRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ── Query animated elements ──────────────────────────────────
    const nodes = el.querySelectorAll<HTMLElement>("[data-pipeline-node]");
    const drawPaths = el.querySelectorAll<SVGPathElement>("[data-draw-path]");
    const flowPaths = el.querySelectorAll<SVGPathElement>("[data-flow-path]");
    const constraintRows = el.querySelectorAll<HTMLElement>(
      "[data-constraint-row]"
    );
    const counterEl = el.querySelector<HTMLElement>("[data-counter]");
    const dimDots = el.querySelectorAll<HTMLElement>("[data-dot-dim]");
    const filterLabels = el.querySelectorAll<HTMLElement>(
      "[data-filter-label]"
    );
    const bars = el.querySelectorAll<HTMLElement>("[data-bar]");
    const barScores = el.querySelectorAll<HTMLElement>("[data-bar-score]");
    const outputLines = el.querySelectorAll<HTMLElement>("[data-output-line]");
    const mobileConnectors = el.querySelectorAll<HTMLElement>(
      "[data-mobile-connector]"
    );
    const modelBadge = el.querySelector<HTMLElement>("[data-model-badge]");

    // Prepare SVG draw-path dash arrays
    drawPaths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    // ── Reduced motion: skip to final state ──────────────────────
    if (prefersReduced) {
      gsap.set(nodes, { opacity: 1, y: 0 });
      gsap.set(constraintRows, { opacity: 1, x: 0 });
      if (counterEl) counterEl.textContent = "23";
      gsap.set(dimDots, { opacity: 0.08, scale: 0.5 });
      gsap.set(filterLabels, { opacity: 1 });
      bars.forEach((bar) =>
        gsap.set(bar, { width: bar.dataset.barTarget || "0%" })
      );
      gsap.set(barScores, { opacity: 1 });
      gsap.set(outputLines, { opacity: 1 });
      gsap.set(mobileConnectors, { opacity: 0.6 });
      if (modelBadge) gsap.set(modelBadge, { opacity: 1 });
      drawPaths.forEach((p) => (p.style.strokeDashoffset = "0"));
      gsap.set(flowPaths, { opacity: 0.6 });
      return;
    }

    // ── Set initial hidden states ────────────────────────────────
    gsap.set(nodes, { opacity: 0, y: 20 });
    gsap.set(constraintRows, { opacity: 0, x: -10 });
    gsap.set(filterLabels, { opacity: 0 });
    gsap.set(outputLines, { opacity: 0 });
    gsap.set(mobileConnectors, { opacity: 0 });
    gsap.set(barScores, { opacity: 0 });
    gsap.set(flowPaths, { opacity: 0 });
    if (modelBadge) gsap.set(modelBadge, { opacity: 0 });
    bars.forEach((bar) => gsap.set(bar, { width: 0 }));

    // ── Counter tween object ─────────────────────────────────────
    const counterObj = { val: 847 };

    // ── Master timeline ──────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        once: true,
      },
    });

    // 0.0 s — Node 1: Define Constraints
    tl.to(
      nodes[0],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0
    );
    tl.to(
      constraintRows,
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.3 },
      0.2
    );
    if (modelBadge) tl.to(modelBadge, { opacity: 1, duration: 0.3 }, 0.6);

    // 0.5 s — Path 1 draws → Node 2 enters
    if (drawPaths[0]) {
      tl.to(
        drawPaths[0],
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        0.5
      );
    }
    if (mobileConnectors[0]) {
      tl.to(mobileConnectors[0], { opacity: 0.6, duration: 0.3 }, 0.5);
    }
    tl.to(
      nodes[1],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.7
    );

    // 1.0 s — Counter 847→23, dots dim, filter labels
    tl.to(
      counterObj,
      {
        val: 23,
        duration: 1.4,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => {
          if (counterEl) counterEl.textContent = String(counterObj.val);
        },
      },
      1.0
    );
    tl.to(
      dimDots,
      {
        opacity: 0.08,
        scale: 0.5,
        stagger: { amount: 0.8, from: "random" },
        duration: 0.3,
      },
      1.0
    );
    tl.to(
      filterLabels,
      { opacity: 1, stagger: 0.3, duration: 0.3 },
      1.6
    );
    if (flowPaths[0]) {
      tl.to(flowPaths[0], { opacity: 0.6, duration: 0.3 }, 1.5);
    }

    // 2.4 s — Path 2 draws → Node 3 enters
    if (drawPaths[1]) {
      tl.to(
        drawPaths[1],
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        2.4
      );
    }
    if (mobileConnectors[1]) {
      tl.to(mobileConnectors[1], { opacity: 0.6, duration: 0.3 }, 2.4);
    }
    tl.to(
      nodes[2],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      2.6
    );

    // 2.8 s — Bar chart fills
    bars.forEach((bar, i) => {
      tl.to(
        bar,
        {
          width: bar.dataset.barTarget || "0%",
          duration: 0.6,
          ease: "power2.out",
        },
        2.8 + i * 0.15
      );
    });
    barScores.forEach((score, i) => {
      tl.to(score, { opacity: 1, duration: 0.2 }, 3.0 + i * 0.15);
    });
    if (flowPaths[1]) {
      tl.to(flowPaths[1], { opacity: 0.6, duration: 0.3 }, 3.4);
    }

    // 3.6 s — Path 3 draws → Node 4 enters
    if (drawPaths[2]) {
      tl.to(
        drawPaths[2],
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        3.6
      );
    }
    if (mobileConnectors[2]) {
      tl.to(mobileConnectors[2], { opacity: 0.6, duration: 0.3 }, 3.6);
    }
    tl.to(
      nodes[3],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      3.8
    );

    // 4.0 s — Output lines appear one by one
    tl.to(
      outputLines,
      { opacity: 1, stagger: 0.2, duration: 0.2 },
      4.0
    );
    if (flowPaths[2]) {
      tl.to(flowPaths[2], { opacity: 0.6, duration: 0.3 }, 4.6);
    }

    return () => {
      tl.kill();
    };
  }, [containerRef]);
}
