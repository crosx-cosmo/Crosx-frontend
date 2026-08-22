import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/content";

const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Clients", href: "#clients" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Performance Marketing", href: "#services" },
      { label: "Lead Generation", href: "#services" },
      { label: "Media Buying", href: "#services" },
      { label: "Analytics", href: "#services" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Growth Strategy", href: "#solutions" },
      { label: "Customer Acquisition", href: "#about" },
      { label: "Attribution", href: "#about" },
      { label: "Automation", href: "#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Industries", href: "#industries" },
      { label: "Privacy Policy", href: "#contact" },
      { label: "Terms", href: "#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="grain relative border-t border-hairline px-4 py-16 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-5">
          <Logo withTagline />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            CrosX is an advertising and marketing agency building measurable growth systems for
            enterprise brands. Branding · Growth · Performance.
          </p>
          <a
            href={`mailto:${BRAND.email}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground underline-sweep"
          >
            <Mail className="size-4 text-brand" aria-hidden="true" />
            {BRAND.email}
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-7xl flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CrosX. All rights reserved.</p>
        <p>
          Founder {BRAND.founder} · Co-Founder {BRAND.coFounder}
        </p>
      </div>
    </footer>
  );
}
