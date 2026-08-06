import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { LuxLink } from "@/components/ui-kit/LuxButton";
import { Eyebrow } from "@/components/ui-kit/Section";
import { Counter } from "@/components/ui-kit/Counter";
import { EASE_LUX } from "@/lib/motion-presets";

const BARS = [38, 52, 44, 66, 58, 78, 71, 92];

export function Hero() {
  const reduce = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !shellRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    shellRef.current.style.transform = `translate3d(${x * -14}px, ${y * -14}px, 0)`;
  };

  const onPointerLeave = () => {
    if (shellRef.current) shellRef.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <section
      id="home"
      aria-label="CrosX hero"
      className="grain relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-32 lg:pt-40"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-10rem] size-[34rem] rounded-full bg-brand/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-40 size-[28rem] rounded-full bg-brand/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUX }}
          className="flex flex-col items-start gap-7"
        >
          <Eyebrow>Enterprise Growth Partner</Eyebrow>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.04] sm:text-5xl lg:text-[4.1rem]">
            <span className="text-ink">Driving Performance Through Data, Strategy &amp; </span>
            <span className="text-brand-gradient">Digital Excellence.</span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            CrosX helps brands acquire users, generate revenue, optimize campaigns and scale
            marketing with measurable ROI.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LuxLink href="#contact" variant="brand" size="lg">
              Book Strategy Call
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LuxLink>
            <LuxLink href="#services" variant="ghostGlass" size="lg">
              Explore Services
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </LuxLink>
          </div>

          <dl className="grid w-full max-w-lg grid-cols-3 gap-4 pt-4">
            {[
              { label: "Median ROAS", value: 3.4, suffix: "x", decimals: 1 },
              { label: "Revenue driven", value: 1.4, prefix: "$", suffix: "B", decimals: 1 },
              { label: "Client retention", value: 96, suffix: "%" },
            ].map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                  <Counter
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    decimals={s.decimals}
                  />
                </dd>
                <p className="mt-1 truncate text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE_LUX }}
          className="relative"
        >
          <div
            ref={shellRef}
            className="relative transition-transform duration-500 ease-out will-change-transform"
          >
            <div className="glass shadow-lux relative rounded-3xl p-4 sm:p-5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"
              />
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Marketing Analytics
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="relative grid size-1.5 place-items-center">
                      <span
                        aria-hidden="true"
                        className="pulse-ring absolute inset-0 rounded-full bg-brand"
                      />
                      <span className="size-1.5 rounded-full bg-brand" />
                    </span>
                    Live · Last 30 days
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-soft">
                  <TrendingUp className="size-3.5" /> +42.8%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: "Revenue", v: 4.82, prefix: "$", suffix: "M", decimals: 2, d: "+18.4%" },
                  { k: "Ad Spend", v: 1.41, prefix: "$", suffix: "M", decimals: 2, d: "-6.2%" },
                  { k: "Leads", v: 38204, d: "+24.1%" },
                  { k: "Perf. Score", v: 94, suffix: "/100", d: "+5 pts" },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="plate sheen rounded-2xl p-3 transition-colors duration-500 hover:border-brand/30"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      {c.k}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      <Counter
                        value={c.v}
                        prefix={c.prefix}
                        suffix={c.suffix}
                        decimals={c.decimals}
                      />
                    </p>
                    <p className="text-[11px] text-brand-soft">{c.d}</p>
                  </div>
                ))}
              </div>

              <div className="plate relative mt-3 overflow-hidden rounded-2xl p-4">
                <span
                  aria-hidden="true"
                  className="scan-sweep pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand/10 to-transparent"
                />
                <div className="relative mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Campaign Growth</p>
                  <p className="text-[11px] text-muted-foreground">Conversions</p>
                </div>
                <div className="relative flex h-28 items-end gap-2">
                  {BARS.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: EASE_LUX }}
                      style={{ height: `${h}%`, transformOrigin: "bottom" }}
                      className="group/bar relative flex-1 rounded-t-md bg-gradient-to-t from-brand/20 to-brand/90 will-change-transform"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px bg-foreground/40"
                      />
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="plate mt-3 flex items-center justify-between gap-3 rounded-2xl p-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">
                    <Zap className="size-4" />
                  </span>
                  <p className="truncate text-xs text-muted-foreground">
                    Budget shifted to top cohort — <span className="text-foreground">CPA -14%</span>
                  </p>
                </div>
                <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>

            <div className="float-slow glass absolute -left-6 bottom-6 hidden rounded-2xl px-4 py-3 sm:block">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Conversion
              </p>
              <p className="font-display text-lg font-bold text-foreground">8.6%</p>
            </div>
            <div className="float-slow glass absolute -right-6 -top-10 hidden rounded-2xl px-4 py-3 sm:block [animation-delay:1.5s]">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">ROAS</p>
              <p className="font-display text-lg font-bold text-brand">3.4x</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
