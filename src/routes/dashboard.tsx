import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { useAuth, signOut } from "@/src/lib/auth";
import { supabase } from "@/src/integrations/supabase/client";
import { modules } from "@/src/lib/course-data";
import { useProgress, moduleProgress, overallProgress } from "@/src/lib/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FuelSense" }] }),
  component: DashboardPage,
});

type RemoteRow = { course_name: string; progress: number; updated_at: string };

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const overall = overallProgress(progress);
  const [remote, setRemote] = useState<RemoteRow[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const fetchRemote = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_progress")
      .select("course_name, progress, updated_at")
      .eq("user_id", user.id);
    setRemote(data ?? []);
  };

  useEffect(() => {
    fetchRemote();
  }, [user]);

  const syncProgress = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      const rows = modules.map((m) => ({
        user_id: user.id,
        course_name: m.title,
        progress: moduleProgress(progress, m.id),
        updated_at: new Date().toISOString(),
      }));
      // Also save overall under "FuelSense Course"
      rows.push({
        user_id: user.id,
        course_name: "FuelSense Course",
        progress: overall,
        updated_at: new Date().toISOString(),
      });
      const { error } = await supabase
        .from("user_progress")
        .upsert(rows, { onConflict: "user_id,course_name" });
      if (error) throw error;
      toast.success("Progress saved to your account");
      await fetchRemote();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save progress");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <CourseHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl text-foreground">Welcome, {user.email?.split("@")[0]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={syncProgress}
              disabled={syncing}
              className="rounded-full bg-[image:var(--gradient-primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-50"
            >
              {syncing ? "Saving…" : "Save progress"}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-[image:var(--gradient-card)] p-8 shadow-[var(--shadow-elegant)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall course progress</div>
          <div className="font-display text-6xl text-foreground">{overall}%</div>
          <ProgressBar value={overall} className="mt-4 h-2" />
        </div>

        <h2 className="mt-12 font-display text-2xl text-foreground">Your courses</h2>
        <div className="mt-4 space-y-3">
          {modules.map((m) => {
            const local = moduleProgress(progress, m.id);
            const saved = remote.find((r) => r.course_name === m.title);
            return (
              <Link
                key={m.id}
                to="/modules/$moduleId/$lessonId"
                params={{ moduleId: m.id, lessonId: m.lessons[0].id }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="text-2xl">{m.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">M{m.number}. {m.title}</span>
                    <span className="text-muted-foreground">
                      {local}%{saved ? ` · saved ${saved.progress}%` : ""}
                    </span>
                  </div>
                  <ProgressBar value={local} className="mt-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {remote.length > 0 && (
          <p className="mt-8 text-xs text-muted-foreground">
            Last saved: {new Date(Math.max(...remote.map((r) => +new Date(r.updated_at)))).toLocaleString()}
          </p>
        )}
      </section>
      <CourseFooter />
    </div>
  );
}
