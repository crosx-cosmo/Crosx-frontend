import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { MeetingLookup } from "@/components/meeting/MeetingLookup";
import { Eyebrow } from "@/components/ui-kit/Section";

const TITLE = "Find My Meeting — CrosX";
const DESCRIPTION =
  "Retrieve a scheduled CrosX meeting securely with your Meeting ID and booking email. View details, reschedule or cancel in seconds.";

export const Route = createFileRoute("/find-meeting")({
  component: FindMeetingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"].slice(0, 24) : "",
  }),
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
    links: [{ rel: "canonical", href: "https://crosx.in/find-meeting" }],
  }),
});

function FindMeetingPage() {
  const { ref } = Route.useSearch();

  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col items-start gap-4 lg:items-center lg:text-center">
          <Eyebrow>Meeting lookup</Eyebrow>
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-[1.08] text-ink sm:text-4xl lg:text-5xl">
            Find My Meeting
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Enter the Meeting ID from your confirmation together with the email address used while
            booking. We verify both before showing any details — then you can reschedule or cancel.
          </p>
        </header>

        <MeetingLookup initialRef={ref} />
      </div>
    </AuthShell>
  );
}
