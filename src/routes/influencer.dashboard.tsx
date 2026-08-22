import { createFileRoute } from "@tanstack/react-router";
import { NotFoundExperience } from "@/components/notfound/NotFoundExperience";

export const Route = createFileRoute("/influencer/dashboard")({
  ssr: false,
  component: NotFoundExperience,
  head: () => ({
    meta: [
      { title: "Page not found — CrosX" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
