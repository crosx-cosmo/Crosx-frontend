# Fix: live booking on crosx.in fails while preview works

## What I verified on the live site

I ran a real booking attempt against `https://www.crosx.in/book-meeting` (form filled, date and slot selected, "Confirm Meeting" clicked) and captured the actual network response.

The booking request returned **HTTP 200** with this error payload:

```text
"CrosX backend credentials are not configured."
```

That string exists in exactly one place in the codebase: `src/lib/crosx-supabase.server.ts`, in the service-role admin client factory. It throws when the server-side service-role key is absent.

## Root cause

**The live Vercel deployment is running the old build, from before the booking flow was moved off the service-role key.**

- The current source code no longer uses the service-role path for booking at all. `src/lib/meetings.functions.ts` calls the SECURITY DEFINER RPCs (`crosx_create_meeting`, `crosx_find_meeting`, `crosx_cancel_meeting`, `crosx_reschedule_meeting`, `crosx_mark_email_sent`) through the publishable key. Nothing in the current booking path can produce that error message — `getCrosxAdmin()` has zero remaining callers.
- Therefore the code that produced the live error is not the code in the project today. Production is serving a build that predates the RPC refactor.
- This also explains why adding the Supabase credentials on Vercel and redeploying did not help: the old build reads a differently named variable and a different code path, and no environment value can fix code that is stale.

Also confirmed: this is not a project-reference, RLS, RPC, or credential problem. The Supabase project is `xtprixndtsnctglngxwl` in both environments, and the preview booking succeeds against the same database and the same RPCs.

## The fix

The change needed is a deployment change, not a code change:

1. Get the current project code into the Vercel deployment. `crosx.in` is served by Vercel (confirmed by response headers) and builds from your Git repository, so Lovable's own publish does not touch it. The commits containing the RPC-based booking flow must land on the branch Vercel builds, and Vercel must rebuild from that commit.
2. After that deploy finishes, re-run the live booking test on `https://www.crosx.in/book-meeting` and confirm: slot validation passes, the row is inserted in `xtprixndtsnctglngxwl`, the Meeting ID is generated, `send-meeting-confirmation` is invoked, `email_sent_at` is stamped, and the confirmation ticket renders.

Optional, and only if you want it: delete `src/lib/crosx-supabase.server.ts`. It is now dead code with no callers, and it is the only source of that misleading error message. This is not required for the fix.

## Not doing

No migration, no new environment variables, no changes to working credentials, no schema or RLS changes, no changes to unrelated code.

## What I need from you

Confirm how the Vercel project gets its code (which Git repo/branch, and whether the Lovable project is synced to it). If the repo is not connected to this Lovable project, the current code has to be pushed there before any Vercel redeploy will change the outcome.
