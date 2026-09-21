// @lovable.dev/vite-tanstack-config already includes the framework plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { CROSX_SUPABASE_PUBLISHABLE_KEY, CROSX_SUPABASE_URL } from "./src/lib/crosx-config";

export default defineConfig({
  vite: {
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(CROSX_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        CROSX_SUPABASE_PUBLISHABLE_KEY,
      ),
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
