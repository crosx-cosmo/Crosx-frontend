import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "crosx-theme";

function setThemeClass(theme: Theme) {
  const root = document.documentElement;
  const list = root.classList;
  if (theme === "light") {
    list.remove("dark");
    list.add("light");
  } else {
    list.remove("light");
    list.add("dark");
  }
  root.style.colorScheme = theme;
}

/**
 * Swap the theme in a single GPU-composited crossfade of one page snapshot
 * (View Transitions API) instead of animating thousands of element paints.
 * Falls back to an instant class flip, which never flickers.
 */
function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = (document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }).startViewTransition;

  if (!animate || reduced || typeof start !== "function") {
    setThemeClass(theme);
    return;
  }

  root.classList.add("cx-theme-switch");
  const transition = start.call(document, () => {
    setThemeClass(theme);
  });
  transition.finished.finally(() => {
    root.classList.remove("cx-theme-switch");
  });
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial, false);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Update the knob state first so the control responds in the same frame,
    // then run the theme swap as one composited crossfade.
    setTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    applyTheme(next, true);
  }, [theme]);


  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      className={cn(
        "group relative inline-flex h-11 w-[4.75rem] shrink-0 items-center rounded-full p-1",
        "glass overflow-hidden transition-colors duration-500 hover:border-brand/50",
        className,
      )}
    >
      {/* brand glow that follows the knob */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/2 rounded-full opacity-60 blur-lg"
        style={{ background: "var(--gradient-brand)" }}
        animate={{ x: isLight ? "92%" : "4%" }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      />

      {/* icons rail */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[0.85rem]">
        <Moon
          className={cn(
            "size-[0.95rem] transition-all duration-500",
            isLight ? "text-muted-foreground opacity-50" : "text-foreground opacity-100",
          )}
        />
        <Sun
          className={cn(
            "size-[0.95rem] transition-all duration-500",
            isLight ? "text-foreground opacity-100" : "text-muted-foreground opacity-50",
          )}
        />
      </span>

      {/* knob */}
      <motion.span
        className="relative z-10 grid size-9 place-items-center rounded-full bg-brand text-primary-foreground glow-brand"
        animate={{ x: isLight ? "calc(2.75rem - 0.25rem)" : 0, rotate: isLight ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
      >
        <motion.span
          key={theme}
          initial={mounted ? { opacity: 0, scale: 0.6, rotate: -90 } : false}
          animate={{ opacity: 1, scale: 1, rotate: isLight ? -180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {isLight ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </motion.span>
      </motion.span>
    </button>
  );
}
