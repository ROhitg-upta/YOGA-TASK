"use client";

// High-Performance 3D Perspective Works Wheel
// Built with continuous requestAnimationFrame physics, smooth inertia dampening,
// non-blocking event handling, and luxury editorial card presentation.

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  title: string;
  image: string;
  href?: string;
  subtitle?: string;
  wing?: string;
  category?: string;
  description?: string;
  highlights?: string[];
  skills?: string[];
  deliverable?: string;
  domain?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
  enableScroll?: boolean;
  globalScroll?: boolean;
  initialIndex?: number;
  onActiveChange?: (index: number) => void;
  targetIndex?: number;
  hideSideDetails?: boolean;
}

/* Luxury Card Geometry: Sized relative to the stage with ample breathing room */
const CARD_H = 0.44; // Card height as fraction of stage height
const CARD_MAX_W = 0.62; // Maximum card width as fraction of stage width
const CARD_RATIO = 1.40; // Aspect ratio (width / height)
const STEP = 36; // Angular separation in degrees between cards on the drum
const DRUM = 2.40; // Drum radius in card heights
const LENS = 2.75; // 3D Perspective camera distance
const RING_R = 1.15; // Ring radius
const BOW = 1.65; // Horizontal arc bow
const TITLE = 0.11; // Ring label font ratio
const INDEX = 0.038; // Index list font ratio
const CULL = 1.8; // Distance past which cards are culled for GPU efficiency

const WHEEL_UNITS = 240; // Calibrated for responsive, natural mousewheel turns (1 notch ≈ 1 card)
const DRAG_UNITS = 300; // Calibrated for smooth, 1:1 mouse drag tracking
const SETTLE_MS = 140; // Quiet time before snapping squarely to the front card
const EASE = 0.12; // Inertia interpolation fraction per frame

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Why SYC // '25",
  action = "Explore & Apply",
  enableScroll = true,
  globalScroll = true,
  initialIndex = 0,
  onActiveChange,
  targetIndex,
  hideSideDetails = true,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Drum mode starts with card at front (turn = 1)
  const initialPos = initialIndex >= 0 ? initialIndex + 1 : 1;
  const turn = React.useRef(initialPos);
  const target = React.useRef(initialPos);
  const [active, setActive] = React.useState(initialIndex >= 0 ? initialIndex : 0);
  const activeRef = React.useRef(initialIndex >= 0 ? initialIndex : 0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const onActiveChangeRef = React.useRef(onActiveChange);
  React.useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.85) / (cardW || 1), 0.18, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  // Synchronous DOM Transform update
  const renderTransforms = React.useCallback(
    (t: number) => {
      if (!stageRef.current) return;
      const { ringR, ringScale, drumR, bow } = metrics;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          // High-fidelity culling for crisp performance
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 3));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);

      const near = clamp(Math.round(pos), 0, last);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
        onActiveChangeRef.current?.(near);
      }
    },
    [metrics, count, last],
  );

  // Continuous physics loop: uses physical inertia interpolation
  React.useEffect(() => {
    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0004) {
        if (turn.current !== target.current) {
          turn.current = target.current;
          renderTransforms(turn.current);
        }
      } else {
        turn.current += gap * (reduced ? 1 : EASE);
        renderTransforms(turn.current);
      }
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [renderTransforms, reduced]);

  // Navigate to target position
  const to = React.useCallback(
    (next: number) => {
      // Keep within valid 3D drum card indices [1 .. count]
      target.current = clamp(next, 1, count);
    },
    [count],
  );

  // Sync external targetIndex when user clicks quick jump pills
  React.useEffect(() => {
    if (typeof targetIndex === "number" && targetIndex >= 0) {
      to(targetIndex + 1);
    }
  }, [targetIndex, to]);

  // Mouse Wheel listener with smooth physical accumulation and gentle settle
  const settlingRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!enableScroll) return;
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Directly adjust target with delta
      const delta = e.deltaY / WHEEL_UNITS;
      to(target.current + delta);

      if (settlingRef.current) window.clearTimeout(settlingRef.current);
      settlingRef.current = window.setTimeout(() => {
        to(Math.round(target.current));
      }, SETTLE_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (settlingRef.current) window.clearTimeout(settlingRef.current);
    };
  }, [enableScroll, to]);

  // Optional Global scroll on window (when cursor is anywhere in stage container)
  React.useEffect(() => {
    if (!globalScroll) return;

    const onWindowWheel = (e: WheelEvent) => {
      // Only capture if user is not in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      // Check if mouse is within experience page bounds
      if (Math.abs(e.deltaY) > 5) {
        const delta = (e.deltaY > 0 ? 1 : -1) * 0.8;
        to(target.current + delta);

        if (settlingRef.current) window.clearTimeout(settlingRef.current);
        settlingRef.current = window.setTimeout(() => {
          to(Math.round(target.current));
        }, SETTLE_MS);
      }
    };

    window.addEventListener("wheel", onWindowWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWindowWheel);
    };
  }, [globalScroll, to]);

  const drag = React.useRef<number | null>(null);

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-transparent text-foreground relative h-full min-h-[26rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          const delta = (drag.current - event.clientY) / DRAG_UNITS;
          to(target.current + delta);
          drag.current = event.clientY;
        }}
        onPointerUp={() => {
          drag.current = null;
          to(Math.round(target.current));
        }}
        onPointerCancel={() => {
          drag.current = null;
          to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            to(Math.round(target.current) + 1);
            event.preventDefault();
          } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            to(Math.round(target.current) - 1);
            event.preventDefault();
          }
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const isCurrent = i === active;
            const Tag = (item.href ? "a" : "div") as "a";

            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={isCurrent}
                  href={item.href}
                  onClick={(e) => {
                    // Clicking non-active card smoothly rotates it to the front
                    if (i !== active) {
                      e.preventDefault();
                      to(i + 1);
                    }
                  }}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className={cn(
                    "group absolute [backface-visibility:hidden] [will-change:transform] cursor-pointer transition-shadow duration-300",
                    isCurrent ? "z-30" : "z-10",
                  )}
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span
                    className={cn(
                      "relative block size-full overflow-hidden rounded-[26px] transition-all duration-300",
                      isCurrent
                        ? "shadow-[0_28px_65px_-12px_rgba(28,29,26,0.38)] ring-2 ring-emerald-500/50 border-2 border-white/70"
                        : "shadow-[0_16px_36px_-14px_rgba(0,0,0,0.22)] border border-white/20 opacity-80 hover:opacity-100",
                    )}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Editorial multi-stop gradient for clear text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15 pointer-events-none" />

                    {/* TOP BADGE STRIP */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                      <span className="font-mono text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                        0{i + 1} / 0{count}
                      </span>
                      {item.wing && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#A8D5BA] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 truncate max-w-[200px]">
                          {item.wing}
                        </span>
                      )}
                    </div>

                    {/* BOTTOM EDITORIAL DETAILS (PRISTINE TYPOGRAPHY & SPACING) */}
                    <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none z-10 space-y-1.5">
                      {item.category && (
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#D2E3D8]/80 font-mono">
                          {item.category}
                        </p>
                      )}

                      <h3 className="font-editorial text-base sm:text-lg md:text-xl font-bold leading-tight drop-shadow-md text-white line-clamp-2">
                        {item.title}
                      </h3>

                      {item.subtitle && (
                        <p className="text-[11px] sm:text-xs text-zinc-300 font-light line-clamp-1 drop-shadow-sm">
                          {item.subtitle}
                        </p>
                      )}

                      {/* Deliverable info strip */}
                      {item.deliverable && (
                        <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-300 border-t border-white/10">
                          <span className="truncate max-w-[220px] font-mono text-[9px] text-[#A8D5BA]">
                            {item.deliverable}
                          </span>
                          <span className="shrink-0 text-white font-semibold group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                            <span>{action}</span>
                            <span>↗</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring center label (only visible if turn is 0) */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-editorial font-bold text-[#1C1D1A] z-10"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>

      {/* Desktop Index List (when hideSideDetails is false) */}
      {!hideSideDetails && (
        <ol
          className="hidden md:block text-[#787670] absolute top-[7.5%] right-[2.5%] text-right leading-[1.75] z-10 font-sans"
          style={{ fontSize: metrics.index }}
        >
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => to(i + 1)}
                className={cn(
                  "focus-visible:outline-foreground cursor-pointer transition-colors outline-none focus-visible:outline-1 text-xs",
                  i === active ? "text-[#2D4A3E] font-bold" : "hover:text-[#1C1D1A]",
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      )}

      {/* Navigation Controls Bar */}
      <div className="absolute bottom-5 right-5 sm:right-6 z-20 flex items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-[#787670] bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E8E4DC] shadow-sm">
          0{active + 1} / 0{count}
        </span>
        <button
          type="button"
          onClick={() => to(Math.max(1, target.current - 1))}
          className="w-9 h-9 rounded-full bg-white/95 hover:bg-[#2D4A3E] hover:text-white text-[#1C1D1A] border border-[#E8E4DC] shadow-md transition-all flex items-center justify-center cursor-pointer pointer-events-auto active:scale-95"
          aria-label="Previous card"
          title="Previous Pillar"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => to(Math.min(count, target.current + 1))}
          className="w-9 h-9 rounded-full bg-white/95 hover:bg-[#2D4A3E] hover:text-white text-[#1C1D1A] border border-[#E8E4DC] shadow-md transition-all flex items-center justify-center cursor-pointer pointer-events-auto active:scale-95"
          aria-label="Next card"
          title="Next Pillar"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default WorksWheel;
