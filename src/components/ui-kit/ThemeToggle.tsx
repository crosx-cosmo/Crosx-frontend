import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "crosx-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

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
