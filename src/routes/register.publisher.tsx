import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui-kit/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { PublisherShowcase } from "@/components/register/PublisherShowcase";
import { PublisherForm } from "@/components/register/PublisherForm";

const TITLE = "Publisher Registration — CrosX";
const DESCRIPTION =
  "Create your CrosX publisher account to promote premium campaigns, track conversions in real time and earn high payouts.";

export const Route = createFileRoute("/register/publisher")({
  component: PublisherRegisterPage,
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
    ],
  }),
});

function PublisherRegisterPage() {
  return (
    <div className="relative min-h-dvh bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 size-[32rem] rounded-full bg-brand/15 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 size-[26rem] rounded-full bg-brand/10 blur-[150px]"
      />

      <header className="relative z-10 mx-auto grid h-16 w-full max-w-[100rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
        <Link to="/" aria-label="CrosX home" className="min-w-0">
          <Logo />
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/roles"
            className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-brand/50"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[100rem] px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pb-28 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <PublisherShowcase />
          </div>
          <PublisherForm />
        </div>
      </main>

      <footer className="relative z-10 border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[100rem] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} CrosX. All rights reserved.</p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            <a
              href="/privacy"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="mailto:support@crosx.in"
              className="font-medium transition-colors duration-200 hover:text-brand"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
