import type { ReactNode } from "react";
import { Reveal } from "@/components/ui-kit/Section";

export interface DocBlock {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
}

export function DocLayout({ blocks, footer }: { blocks: DocBlock[]; footer?: ReactNode }) {
  return (
    <section className="relative w-full px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="glass rounded-3xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              On this page
            </h2>
            <ol className="mt-4 space-y-2.5">
              {blocks.map((b, i) => (
                <li key={b.id}>
                  <a
                    href={`#${b.id}`}
                    className="flex gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {b.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="flex flex-col gap-5">
          {blocks.map((b, i) => (
            <Reveal key={b.id} delay={Math.min(i * 0.03, 0.2)}>
              <article
                id={b.id}
                className="glass grain relative scroll-mt-28 overflow-hidden rounded-3xl p-6 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
                />
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold tabular-nums text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-extrabold text-ink sm:text-2xl">{b.title}</h2>
                </div>
                <div className="mt-4 space-y-3.5">
                  {b.body.map((p) => (
                    <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}
                </div>
                {b.bullets && (
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {b.bullets.map((li) => (
                      <li
                        key={li}
                        className="flex gap-2.5 rounded-2xl border border-hairline bg-surface/60 px-4 py-3 text-sm text-muted-foreground"
                      >
                        <i
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                        />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
          {footer}
        </div>
      </div>
    </section>
  );
}

export function DocContact({ note }: { note: string }) {
  return (
    <Reveal>
      <div className="glass relative overflow-hidden rounded-3xl p-6 text-center sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[100px]"
        />
        <h2 className="relative text-lg font-extrabold text-ink sm:text-xl">Questions?</h2>
        <p className="relative mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
        <a
          href="mailto:contact@crosx.in"
          className="relative mt-5 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_-14px_var(--brand)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          contact@crosx.in
        </a>
      </div>
    </Reveal>
  );
}
