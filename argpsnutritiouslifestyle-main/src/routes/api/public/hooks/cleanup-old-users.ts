import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Daily cron: deletes up to 10 oldest users whose app_users.created_at is older than 6 months.
// Triggered by pg_cron via HTTP POST. Secured with a shared CRON_SECRET header.
export const Route = createFileRoute("/api/public/hooks/cleanup-old-users")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided = request.headers.get("x-cron-secret");
        const expected = process.env.CRON_SECRET;
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const url = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) {
          return new Response("Server misconfigured", { status: 500 });
        }

        const admin = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Find up to 10 oldest users older than 6 months
        const { data: candidates, error: selErr } = await admin
          .from("app_users")
          .select("id, created_at")
          .lt("created_at", new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6).toISOString())
          .order("created_at", { ascending: true })
          .limit(10);

        if (selErr) {
          return new Response(JSON.stringify({ error: selErr.message }), { status: 500 });
        }

        const deleted: string[] = [];
        const failed: { id: string; error: string }[] = [];

        for (const u of candidates ?? []) {
          // Safety: re-check age before deleting
          const age = Date.now() - new Date(u.created_at).getTime();
          const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;
          if (age < sixMonthsMs) continue;

          const { error } = await admin.auth.admin.deleteUser(u.id);
          if (error) failed.push({ id: u.id, error: error.message });
          else deleted.push(u.id);
        }

        return new Response(
          JSON.stringify({
            scanned: candidates?.length ?? 0,
            deleted: deleted.length,
            failed,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
