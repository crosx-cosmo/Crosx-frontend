import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowLeft, Bot, Compass, Home, LifeBuoy, Search, Sparkles, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { LuxButton, LuxLink } from "@/components/ui-kit/LuxButton";
import { Chase404Scene } from "@/components/notfound/Chase404Scene";

import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Oops! This page skipped the conversion funnel.",
  "This URL bounced before it could convert.",
  "Our tracker is still looking for this destination.",
  "Someone optimized this page out of existence.",
  "Campaign Status: Lost in Production.",
  "Conversion Failed Successfully.",
  "Even AI couldn't predict this URL.",
  "Looks like this page rage quit.",
  "404% confidence this page isn't here.",
  "Your click deserves a better landing page.",
];

const KPI_CARDS = [
  { label: "CTR", value: "0.00%", delta: "-100%", up: false, x: "6%", y: "14%", d: 0 },
  { label: "Impressions", value: "404", delta: "+404%", up: true, x: "78%", y: "10%", d: 0.6 },
  { label: "Bounce Rate", value: "100%", delta: "+∞", up: true, x: "82%", y: "66%", d: 1.2 },
  { label: "Pipeline", value: "$0", delta: "-∞", up: false, x: "3%", y: "70%", d: 1.8 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 61) % 100,
  size: 3 + ((i * 7) % 5),
  delay: (i % 9) * 0.7,
  duration: 9 + ((i * 3) % 7),
}));

function randomOf<T>(arr: readonly T[], not?: T): T {
  const pool = not === undefined ? arr : arr.filter((x) => x !== not);
  return pool[Math.floor(Math.random() * pool.length)] ?? arr[0];
}

/* --------------------------------- Confetti -------------------------------- */

function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 420,
        y: -120 - Math.random() * 220,
        r: Math.random() * 360,
        delay: Math.random() * 0.12,
        brand: i % 3 !== 0,
      })),
    [show],
  );

  return (
    <AnimatePresence>
      {show && (
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.r, scale: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE_LUX, delay: p.delay }}
              className={cn(
                "absolute block h-2 w-1.5 rounded-[1px] will-change-transform",
                p.brand ? "bg-brand" : "bg-foreground/70",
              )}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- Robot helper ------------------------------ */

function PeekingRobot() {
  const reduced = useReducedMotion();
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let hide: ReturnType<typeof setTimeout>;
    const show = setInterval(() => {
      setPeek(true);
      hide = setTimeout(() => setPeek(false), 3200);
    }, 9000);
    return () => {
      clearInterval(show);
      clearTimeout(hide);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {peek && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_LUX }}
          className="glass pointer-events-none absolute bottom-0 right-3 z-20 flex items-center gap-2 rounded-t-2xl px-3 py-2 shadow-lux sm:right-8"
        >
          <motion.span
            animate={{ rotate: [0, 18, -8, 18, 0] }}
            transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
            className="grid size-8 place-items-center rounded-full bg-brand/12 text-brand"
          >
            <Bot className="size-4" />
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground">
            Indexing bot here — nothing to report.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Scanning cursor ---------------------------- */

function ScanningCursor() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 hidden items-center gap-1 md:flex"
      initial={{ x: "8%", y: "18%" }}
      animate={{ x: ["8%", "72%", "40%", "84%", "8%"], y: ["18%", "34%", "72%", "56%", "18%"] }}
      transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
    >
      <Search className="size-4 text-brand drop-shadow-[0_0_8px_var(--brand)]" />
      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
        scanning…
      </span>
    </motion.div>
  );
}

/* ---------------------------------- Main ----------------------------------- */

export function NotFoundExperience() {
  const reduced = useReducedMotion();
  const [message, setMessage] = useState(MESSAGES[0]);
  const [wobbleKey, setWobbleKey] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState<{
    id: number;
    icon: "trophy" | "sparkles" | "search";
    text: string;
  } | null>(null);

  const clicksRef = useRef(0);
  const achievedRef = useRef(false);
  const logoClicksRef = useRef(0);
  const lastTapRef = useRef(0);

  const showToast = useCallback((icon: "trophy" | "sparkles" | "search", text: string) => {
    setToast({ id: Date.now(), icon, text });
    setTimeout(() => setToast((t) => (t && Date.now() - t.id > 3800 ? null : t)), 4200);
  }, []);

  // Random message per page load.
  useEffect(() => {
    setMessage(randomOf(MESSAGES));
  }, []);

  // Idle easter egg.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => showToast("search", "Still searching? Even Google gave up 😅"),
        10000,
      );
    };
    reset();
    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [showToast]);

  // 5 clicks anywhere achievement.
  useEffect(() => {
    const onClick = () => {
      clicksRef.current += 1;
      if (clicksRef.current === 5 && !achievedRef.current) {
        achievedRef.current = true;
        showToast("trophy", "Achievement Unlocked: Professional Page Hunter 🏆");
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [showToast]);

  // 3D tilt on the 404 numerals.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleNumberClick = () => {
    setWobbleKey((k) => k + 1);
    setMessage((m) => randomOf(MESSAGES, m));
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1000);
    }
    lastTapRef.current = now;
  };

  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current === 5) {
      showToast("sparkles", "Hidden Debug Mode Activated.");
      logoClicksRef.current = 0;
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background grain">
      {/* Ambient light + grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--brand) 22%, transparent), transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 right-0 size-[34rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--brand) 18%, transparent), transparent 70%)",
        }}
      />

      {/* Particles */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-brand/50 will-change-transform"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <ScanningCursor />
      <PeekingRobot />

      {/* Floating KPI cards */}
      {KPI_CARDS.map((k) => (
        <motion.div
          key={k.label}
          aria-hidden="true"
          className="glass pointer-events-none absolute hidden rounded-xl px-3 py-2 shadow-lux lg:block"
          style={{ left: k.x, top: k.y }}
          animate={reduced ? undefined : { y: [0, -14, 0], x: [0, 8, 0] }}
          transition={{ duration: 9 + k.d, delay: k.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {k.label}
          </p>
          <p className="mt-0.5 font-display text-lg font-bold text-foreground">{k.value}</p>
          <p
            className={cn(
              "text-[10px] font-semibold",
              k.up ? "text-brand" : "text-muted-foreground",
            )}
          >
            {k.delta}
          </p>
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="CrosX"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <Logo className="opacity-90 transition-opacity hover:opacity-100" title="CrosX" />
        </button>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_LUX, delay: 0.1 }}
          className="glass mt-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-brand pulse-ring" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
          </span>
          Error 404 · Route Untracked
        </motion.span>

        {/* 404 numerals */}
        <div
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mt-6 [perspective:1200px]"
        >
          <Confetti show={confetti} />
          <motion.button
            type="button"
            onClick={handleNumberClick}
            aria-label="Shuffle error message"
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            className="block cursor-pointer select-none rounded-3xl px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <Chase404Scene wobbleKey={wobbleKey} />
          </motion.button>
        </div>

        {/* Rotating humorous message */}
        <div className="mt-4 h-auto min-h-16 text-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={message}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE_LUX }}
              className="mx-auto max-w-2xl text-balance text-xl font-bold text-foreground sm:text-3xl"
            >
              {message}
            </motion.h1>
          </AnimatePresence>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            The page is missing, but the strategy isn't. Tap the numbers for another take — or let
            us route you somewhere that actually converts.
          </p>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_LUX, delay: 0.2 }}
          className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
        >
          <Link to="/" className="contents">
            <LuxButton size="lg" className="w-full sm:w-auto">
              <Home className="size-4" />
              Back to Homepage
            </LuxButton>
          </Link>
          <a href="/#services" className="contents">
            <LuxButton variant="ghostGlass" size="lg" className="w-full sm:w-auto">
              <Compass className="size-4" />
              Explore Services
            </LuxButton>
          </a>
          <LuxLink
            variant="ghostGlass"
            size="lg"
            href="mailto:support@crosx.in"
            className="w-full sm:w-auto"
          >
            <LifeBuoy className="size-4" />
            Contact Support
          </LuxLink>
          <LuxButton
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Return to Previous Page
          </LuxButton>
        </motion.div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          CrosX · Branding • Growth • Performance
        </p>
      </div>

      {/* Easter-egg toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE_LUX }}
            className="glass fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 shadow-lux"
            role="status"
          >
            {toast.icon === "trophy" && <Trophy className="size-4 text-brand" />}
            {toast.icon === "sparkles" && <Sparkles className="size-4 text-brand" />}
            {toast.icon === "search" && <Search className="size-4 text-brand" />}
            <span className="whitespace-nowrap text-xs font-semibold text-foreground sm:text-sm">
              {toast.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
