import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Eyebrow } from "@/components/ui-kit/Section";
import { EASE_LUX } from "@/lib/motion-presets";
import { ScrollProgress, BackToTop } from "@/components/ui-kit/Chrome";

export function PageShell({
  eyebrow,
  title,
  highlight,
  intro,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <ScrollProgress />
      <SiteHeader />

      <main className="relative z-10">
        <header className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-lines opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[150px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_LUX }}
            className="relative mx-auto flex w-full max-w-7xl flex-col gap-5"
          >
            <Link
              to="/"
              className="group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to home
            </Link>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              {title}
              {highlight && <span className="mt-2 block text-brand-gradient">{highlight}</span>}
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {intro}
            </p>
            {meta && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {meta}
              </p>
            )}
          </motion.div>
        </header>

        {children}
      </main>

      <SiteFooter />
      <BackToTop />
    </div>
  );
}
