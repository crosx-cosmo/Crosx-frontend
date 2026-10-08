import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { EASE_LUX } from "@/lib/motion-presets";

const TITLE = "Coming Soon — CrosX";
const DESCRIPTION =
  "This CrosX experience is being crafted. Partner onboarding for advertisers, publishers and influencers opens shortly.";

export const Route = createFileRoute("/coming-soon")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: typeof search.role === "string" ? search.role : undefined,
  }),
  component: ComingSoonPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ComingSoonPage() {
  const { role } = Route.useSearch();

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-16 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[150px]"
      />

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUX }}
        className="grain glass relative w-full max-w-2xl overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-lux sm:px-12 sm:py-16"
      >
        <div className="relative flex flex-col items-center gap-6">
          <Logo />

          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Clock3 className="size-3.5 text-brand" aria-hidden="true" />
            Coming Soon
          </span>

          <h1 className="text-balance text-3xl font-extrabold leading-[1.08] text-ink sm:text-5xl">
            {role ? `${role} onboarding` : "This experience"}
            <span className="mt-2 block text-brand-gradient">is launching soon.</span>
          </h1>

          <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            We&apos;re building a partner experience worthy of the brands we work with. Until it
            opens, our team is handling every engagement personally.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/roles"
              className="glass group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Choose another role
            </Link>
            <Link
              to="/"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_var(--brand)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
