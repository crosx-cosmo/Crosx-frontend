import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  Headset,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit/Section";
import { TESTIMONIALS, AWARDS } from "@/lib/content";
import { EASE_LUX } from "@/lib/motion-presets";

const AWARD_ICONS = [ShieldCheck, HeartHandshake, BadgeCheck, Award, Headset];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    timer.current = setInterval(() => go(1), 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go]);

  const active = TESTIMONIALS[index];

  return (
    <Section ariaLabel="Client testimonials">
      <SectionHeading eyebrow="Testimonials" title="What enterprise teams say after quarter one." />

      <div className="mx-auto mt-14 max-w-3xl">
        <div className="glass relative overflow-hidden rounded-3xl p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 size-52 rounded-full bg-brand/10 blur-[90px]"
          />
          <div className="relative min-h-[15rem] sm:min-h-[12rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE_LUX }}
              >
                <div className="flex gap-1" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-brand text-brand" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-5 text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  “{active.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-brand/40 bg-surface-2 font-display text-sm font-bold text-brand">
                    {active.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {active.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {active.role}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="relative mt-6 flex items-center justify-between gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Select testimonial">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial from ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-brand" : "w-3 bg-surface-2 hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-brand/60 hover:text-brand"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-brand/60 hover:text-brand"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Awards() {
  return (
    <Section ariaLabel="Awards and standards" className="pt-0">
      <SectionHeading eyebrow="Recognition" title="Enterprise standards, independently verified." />
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {AWARDS.map((award, i) => {
          const Icon = AWARD_ICONS[i % AWARD_ICONS.length];
          return (
            <Reveal as="li" key={award.title} delay={i * 0.05}>
              <article className="group h-full rounded-3xl border border-hairline bg-surface/40 p-6 transition-transform duration-500 will-change-transform hover:-translate-y-1 hover:border-brand/40">
                <Icon
                  className="size-6 text-brand transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-base font-bold text-foreground">{award.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{award.copy}</p>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
