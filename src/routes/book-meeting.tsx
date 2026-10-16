import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { MeetingBooking } from "@/components/meeting/MeetingBooking";
import { Eyebrow } from "@/components/ui-kit/Section";

const TITLE = "Schedule a Strategy Meeting — CrosX";
const DESCRIPTION =
  "Book a working session with the CrosX growth team. Pick your meeting type, date, time slot and timezone — confirmation is instant.";

export const Route = createFileRoute("/book-meeting")({
  component: BookMeetingPage,
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
    links: [{ rel: "canonical", href: "https://crosx.in/book-meeting" }],
  }),
});

function BookMeetingPage() {
  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
          <Eyebrow>Book a session</Eyebrow>
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-[1.08] text-ink sm:text-4xl lg:text-5xl">
            Schedule a Strategy Meeting
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thirty focused minutes with a senior CrosX strategist — not a sales pitch. Share your
            goals and current numbers, and we&apos;ll come to the call with a growth model, channel
            plan and a realistic forecast.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Already booked?</span>
            <Link
              to="/find-meeting"
              search={{ ref: "" }}
              className="group inline-flex items-center gap-1 font-semibold text-brand transition-colors hover:text-brand/80"
            >
              Find an Existing Meeting
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        <MeetingBooking />
      </div>
    </AuthShell>
  );
}
