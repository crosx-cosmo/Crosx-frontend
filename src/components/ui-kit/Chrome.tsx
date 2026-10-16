import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { EASE_LUX } from "@/lib/motion-presets";

/** Thin brand progress bar pinned to the top of the viewport. GPU transform only. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand/40 via-brand to-brand-soft will-change-transform"
    />
  );
}

/** Floating back-to-top control, appears after the first viewport. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.9);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE_LUX }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          className="glass group fixed bottom-5 right-4 z-50 grid size-12 place-items-center rounded-full text-foreground shadow-lux transition-colors duration-300 hover:border-brand/50 sm:bottom-8 sm:right-8"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-brand/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
          />
          <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Desktop-only pointer spotlight — writes CSS vars, never re-renders React. */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
        el.style.opacity = "1";
        raf = 0;
      });
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden size-[600px] rounded-full opacity-0 blur-[110px] transition-opacity duration-500 will-change-transform lg:block"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--brand) 13%, transparent), transparent 62%)",
      }}
    />
  );
}

/** Brief brand curtain on first paint — dismisses on load or after a hard cap. */
export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const cap = window.setTimeout(() => setDone(true), 1100);
    const onLoad = () => window.setTimeout(() => setDone(true), 320);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="curtain"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_LUX }}
          className="grain fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_LUX }}
            className="relative flex flex-col items-center gap-5"
          >
            <Logo className="scale-125" />
            <span className="h-px w-40 overflow-hidden bg-hairline">
              <motion.span
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1, ease: EASE_LUX }}
                className="block h-px w-full bg-gradient-to-r from-transparent via-brand to-transparent"
              />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Loading
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
