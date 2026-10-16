import { motion, useReducedMotion } from "motion/react";
import { EASE_LUX } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

/**
 * Cinematic looping slapstick scene: two original CrosX mascots chase each
 * other, collide with the electrified middle "0", get zapped into glowing
 * skeleton silhouettes, bounce away and recover — then it loops.
 *
 * Everything is transform/opacity only (GPU-accelerated) and driven by a
 * single shared loop duration so all layers stay perfectly in sync.
 */

const D = 9; // seconds per full loop

/* Shared timeline keys (fractions of D) */
const T = {
  start: 0,
  hit: 0.2,
  flash: 0.225,
  bounce: 0.34,
  settle: 0.55,
  dizzy: 0.85,
  end: 1,
};

const loop = (duration = D) =>
  ({ duration, repeat: Infinity, ease: "easeInOut", repeatDelay: 0 }) as const;

/* --------------------------------- Mascot --------------------------------- */

type MascotProps = { flip?: boolean; className?: string };

/** Original character: a rounded "pixel-drift" blob with an antenna. */
function MascotBody({ flip, className }: MascotProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-full", className)}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      {/* antenna */}
      <path
        d="M50 22 L50 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="50" cy="7" r="4.5" fill="var(--brand)" />
      {/* body */}
      <rect x="16" y="22" width="68" height="56" rx="20" fill="currentColor" />
      {/* visor */}
      <rect x="27" y="35" width="46" height="22" rx="11" fill="var(--background)" opacity="0.92" />
      <circle cx="41" cy="46" r="5" fill="currentColor" />
      <circle cx="59" cy="46" r="5" fill="currentColor" />
      <circle cx="42.6" cy="44.4" r="1.6" fill="var(--background)" />
      <circle cx="60.6" cy="44.4" r="1.6" fill="var(--background)" />
      {/* grin */}
      <path
        d="M40 65 Q50 72 60 65"
        stroke="var(--background)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* arms */}
      <path d="M16 46 L4 38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M84 46 L96 38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {/* legs */}
      <path d="M36 78 L32 94" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M64 78 L68 94" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}

/** X-ray flash frame: black silhouette + glowing skeleton outline. */
function MascotSkeleton({ flip }: MascotProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 0 10px var(--brand))",
      }}
      aria-hidden="true"
    >
      <rect x="16" y="22" width="68" height="56" rx="20" fill="#000" />
      <g stroke="var(--brand)" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M50 22 L50 10" />
        <path d="M50 30 L50 70" />
        <path d="M34 40 L66 40" />
        <path d="M36 50 L64 50" />
        <path d="M38 60 L62 60" />
        <path d="M16 46 L4 38 M84 46 L96 38" />
        <path d="M36 78 L32 94 M64 78 L68 94" />
        <circle cx="41" cy="34" r="3" />
        <circle cx="59" cy="34" r="3" />
      </g>
    </svg>
  );
}

/* --------------------------------- Effects -------------------------------- */

const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + 0.3;
  const r = 90 + ((i * 23) % 70);
  return {
    id: i,
    x: +(Math.cos(a) * r).toFixed(2),
    y: +(Math.sin(a) * r * 0.75).toFixed(2),
    s: 0.5 + ((i * 7) % 5) / 6,
  };
});

const ARCS = [
  "M-52 -34 L-30 -12 L-46 -6 L-24 16",
  "M52 -30 L30 -10 L46 -2 L26 20",
  "M-14 -56 L-2 -34 L-18 -30 L-6 -8",
  "M18 54 L6 32 L22 28 L10 8",
];

function ImpactBurst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      {/* white-hot flash */}
      <motion.span
        className="absolute left-1/2 top-1/2 block size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand blur-2xl"
        animate={{ opacity: [0, 0, 0.85, 0.25, 0], scale: [0.4, 0.4, 1.6, 2.1, 2.4] }}
        transition={{ ...loop(), times: [0, T.hit, T.flash, 0.27, 0.36] }}
      />
      {/* shock rings */}
      {[0, 0.05].map((off, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 block size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand"
          animate={{ opacity: [0, 0, 0.55, 0], scale: [0.3, 0.3, 1.2, 2.1] }}
          transition={{ ...loop(), times: [0, T.hit + off, T.flash + off, 0.42 + off] }}
        />
      ))}
      {/* comic impact lines */}
      <svg
        viewBox="-120 -120 240 240"
        className="absolute left-1/2 top-1/2 size-[16rem] -translate-x-1/2 -translate-y-1/2"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <motion.line
              key={i}
              x1={(Math.cos(a) * 46).toFixed(2)}
              y1={(Math.sin(a) * 40).toFixed(2)}
              x2={(Math.cos(a) * 104).toFixed(2)}
              y2={(Math.sin(a) * 90).toFixed(2)}
              stroke="var(--brand)"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ opacity: [0, 0, 0.75, 0], pathLength: [0.2, 0.2, 1, 1] }}
              transition={{ ...loop(), times: [0, T.hit, T.flash + 0.01, 0.31] }}
            />
          );
        })}
      </svg>
      {/* sparks */}
      {SPARKS.map((s) => (
        <motion.span
          key={s.id}
          className="absolute left-1/2 top-1/2 block h-1 w-2 rounded-full bg-brand"
          style={{ boxShadow: "0 0 10px var(--brand)" }}
          animate={{
            opacity: [0, 0, 1, 0],
            x: [0, 0, s.x, s.x * 1.35],
            y: [0, 0, s.y, s.y * 1.3 + 40],
            scale: [0, 0, s.s, 0.2],
          }}
          transition={{ ...loop(), times: [0, T.hit, T.flash + 0.02, 0.4] }}
        />
      ))}
      {/* smoke puffs */}
      {[-70, 0, 70].map((x, i) => (
        <motion.span
          key={x}
          className="absolute left-1/2 top-1/2 block size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 blur-xl"
          animate={{
            opacity: [0, 0, 0.5, 0],
            x: [x * 0.3, x * 0.3, x, x * 1.2],
            y: [0, 0, -40, -90],
            scale: [0.4, 0.4, 1, 1.7],
          }}
          transition={{ ...loop(), times: [0, T.hit, 0.3 + i * 0.02, 0.52 + i * 0.03] }}
        />
      ))}
    </div>
  );
}

function ElectricArcs() {
  return (
    <svg
      viewBox="-90 -90 180 180"
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-[18rem] -translate-x-1/2 -translate-y-1/2 sm:size-[24rem]"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 0 6px var(--brand))" }}
    >
      {ARCS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            opacity: [0.18, 0.5, 0.1, 1, 0.9, 0.28, 0.12, 0.4, 0.18],
            scale: [1, 1.04, 0.98, 1.12, 1.05, 1, 1.03, 0.99, 1],
          }}
          transition={{
            ...loop(),
            times: [0, 0.1, T.hit, T.flash, 0.26, 0.4, 0.6, 0.82, 1],
            delay: i * 0.06,
          }}
        />
      ))}
    </svg>
  );
}

function DizzyStars({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute -top-7 left-1/2 z-30 size-12 -translate-x-1/2"
      animate={{ opacity: [0, 0, 0, 1, 1, 0, 0] }}
      transition={{
        ...loop(),
        times: [0, T.hit, T.settle - 0.03, T.settle + 0.02, T.dizzy - 0.05, T.dizzy, 1],
      }}
    >
      <motion.div
        className="size-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay }}
      >
        {[0, 120, 240].map((a) => (
          <span
            key={a}
            className="absolute left-1/2 top-1/2 block text-sm leading-none text-brand drop-shadow-[0_0_6px_var(--brand)]"
            style={{ transform: `rotate(${a}deg) translateX(22px)` }}
          >
            ★
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* --------------------------------- Runner --------------------------------- */

function Runner({ side, children }: { side: "left" | "right"; children?: React.ReactNode }) {
  const dir = side === "left" ? 1 : -1;
  const x = (v: number) => `${v * dir}%`;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-20 size-12 -translate-x-1/2 -translate-y-1/2 sm:size-16 lg:size-20"
      animate={{
        x: [x(-430), x(-58), x(-58), x(-330), x(-300), x(-312), x(-430)],
        y: ["6%", "6%", "0%", "-56%", "14%", "6%", "6%"],
      }}
      transition={{
        ...loop(),
        times: [T.start, T.hit, T.flash, T.bounce, T.settle, T.dizzy, T.end],
      }}
    >
      <motion.div
        className="size-full"
        animate={{
          rotate: [0, 0, 8 * dir, -300 * dir, -14 * dir, -4 * dir, 0],
          scaleX: [1, 1, 1.25, 1, 1, 1, 1],
          scaleY: [1, 1, 0.78, 1, 1, 1, 1],
        }}
        transition={{
          ...loop(),
          times: [T.start, T.hit, T.flash, T.bounce, T.settle, T.dizzy, T.end],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Character({
  side,
  flip,
  hue,
}: {
  side: "left" | "right";
  flip?: boolean;
  hue: "ink" | "brand";
}) {
  const dir = side === "left" ? 1 : -1;
  return (
    <Runner side={side}>
      {/* running hop + motion blur trail */}
      <motion.div
        className="relative size-full"
        animate={{ y: ["0%", "-14%", "0%", "-12%", "0%"] }}
        transition={{ duration: 0.42, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 blur-[6px]"
          style={{ color: hue === "brand" ? "var(--brand)" : "var(--foreground)" }}
          animate={{
            opacity: [0.45, 0.45, 0, 0.5, 0, 0, 0.45],
            x: [
              `${-26 * dir}%`,
              `${-26 * dir}%`,
              "0%",
              `${22 * dir}%`,
              "0%",
              "0%",
              `${-26 * dir}%`,
            ],
          }}
          transition={{
            ...loop(),
            times: [T.start, T.hit, T.flash, T.bounce, T.settle, T.dizzy, T.end],
          }}
        >
          <MascotBody flip={flip} />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ color: hue === "brand" ? "var(--brand)" : "var(--foreground)" }}
          animate={{ opacity: [1, 1, 0, 0, 1, 1, 1] }}
          transition={{
            ...loop(),
            times: [T.start, T.hit - 0.001, T.hit, T.flash + 0.03, T.flash + 0.045, T.dizzy, T.end],
          }}
        >
          <MascotBody flip={flip} />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0, 1, 0.4, 1, 0, 0], scale: [1, 1, 1.06, 1, 1.04, 1, 1] }}
          transition={{
            ...loop(),
            times: [
              T.start,
              T.hit,
              T.hit + 0.006,
              T.hit + 0.014,
              T.hit + 0.022,
              T.flash + 0.04,
              T.end,
            ],
          }}
        >
          <MascotSkeleton flip={flip} />
        </motion.div>

        <DizzyStars delay={side === "left" ? 0 : 0.4} />
      </motion.div>
    </Runner>
  );
}

/* ---------------------------------- Scene ---------------------------------- */

export function Chase404Scene({ wobbleKey }: { wobbleKey: number }) {
  const reduced = useReducedMotion();

  const numerals = (
    <motion.span
      key={wobbleKey}
      animate={wobbleKey ? { rotate: [0, -4, 4, -2, 0], scale: [1, 1.04, 0.98, 1] } : undefined}
      transition={{ duration: 0.6, ease: EASE_LUX }}
      className="relative z-10 flex items-baseline font-display text-[6rem] font-extrabold leading-none tracking-tighter sm:text-[9rem] lg:text-[12rem]"
    >
      <span className="text-ink drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)]">4</span>
      <motion.span
        className="text-brand-gradient drop-shadow-[0_0_50px_color-mix(in_oklab,var(--brand)_45%,transparent)]"
        animate={
          reduced
            ? undefined
            : {
                opacity: [1, 0.7, 1, 0.25, 1, 0.5, 1, 0.85, 1],
                scale: [1, 1.02, 1, 1.14, 1.05, 1, 1.01, 1, 1],
              }
        }
        transition={{ ...loop(), times: [0, 0.12, T.hit, T.flash, 0.26, 0.3, 0.42, 0.7, 1] }}
      >
        0
      </motion.span>
      <span className="text-ink drop-shadow-[0_24px_60px_rgba(0,0,0,0.35)]">4</span>
    </motion.span>
  );

  if (reduced) {
    return <div className="relative flex items-center justify-center">{numerals}</div>;
  }

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ x: [0, 0, -7, 6, -4, 3, -1.5, 0, 0], y: [0, 0, 4, -4, 2, -1, 0, 0, 0] }}
      transition={{
        ...loop(),
        times: [0, T.hit, T.flash, 0.235, 0.245, 0.255, 0.268, 0.29, 1],
      }}
    >
      {/* portal bloom behind the middle 0 */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:size-64"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--brand) 45%, transparent), transparent 68%)",
        }}
        animate={{
          opacity: [0.5, 0.7, 0.45, 1, 0.8, 0.55, 0.5],
          scale: [1, 1.06, 0.97, 1.35, 1.12, 1, 1],
        }}
        transition={{ ...loop(), times: [0, 0.12, T.hit, T.flash, 0.3, 0.6, 1] }}
      />

      {numerals}

      <ElectricArcs />
      <ImpactBurst />
      <Character side="left" hue="ink" />
      <Character side="right" hue="brand" flip />
    </motion.div>
  );
}
