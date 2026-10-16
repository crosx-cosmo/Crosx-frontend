# Admin Loader and Global Postback Alignment

## Changes
- Replace only the AdminGate session-resolution spinner with the existing landing-page `LoadingScreen`, preserving its CrosX logo, timing, animation, and responsive treatment.
- Keep the admin sign-in form, submission state, authentication calls, and publisher authentication unchanged.
- Update Admin → Postback → Global to import the publisher campaign macro source directly (`CAMPAIGN_MACROS`) instead of the separate admin-only list.
- Build the admin default postback URL from those shared publisher macros and keep Save, reset, and per-macro copy actions working.
- Preserve the current Admin Panel layout and visual components.

## Verification
- Run the TypeScript check and inspect the preview build status.
- Open the admin route while its session resolves and confirm the landing loader appears instead of a spinner.
- Compare the admin macro rows against the publisher macro source, including `{click_id}`, `{sub_id}`, event/IP/offer/payout/timestamp, and `{x1}`–`{x10}`.
