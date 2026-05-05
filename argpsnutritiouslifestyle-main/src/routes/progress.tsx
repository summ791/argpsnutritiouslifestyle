import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { modules } from "@/src/lib/course-data";
import { useProgress, moduleProgress, overallProgress, getBadges } from "@/src/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress — FuelSense" },
      { name: "description", content: "Track lessons, modules, quiz scores and earned badges." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { progress } = useProgress();
  const overall = overallProgress(progress);
  const badges = getBadges(progress);
  const message =
    overall === 0 ? "Start your journey — your first lesson is waiting."
    : overall < 50 ? "Great start! Keep learning, one lesson at a time."
    : overall < 100 ? "You're improving your nutrition knowledge — keep going!"
    : "🎉 Course complete. You're a Tamil Nadu nutrition pro.";

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your journey</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">Progress</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        <div className="mt-8 rounded-3xl border border-border bg-[image:var(--gradient-card)] p-8 shadow-[var(--shadow-elegant)]">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall</div>
              <div className="font-display text-6xl text-foreground">{overall}%</div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {Object.values(progress.completedLessons).filter(Boolean).length} lessons completed
            </div>
          </div>
          <ProgressBar value={overall} className="mt-4 h-2" />
        </div>

        <h2 className="mt-12 font-display text-2xl text-foreground">Badges</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {badges.map((b) => (
            <div key={b.id} className={`rounded-2xl border p-5 text-center ${b.earned ? "border-primary/40 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]" : "border-border bg-card text-muted-foreground"}`}>
              <div className={`text-4xl ${b.earned ? "" : "opacity-40"}`}>{b.emoji}</div>
              <div className="mt-2 font-display text-lg">{b.name}</div>
              <div className="mt-1 text-xs opacity-80">{b.description}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl text-foreground">Modules</h2>
        <div className="mt-4 space-y-3">
          {modules.map((m) => {
            const pct = moduleProgress(progress, m.id);
            const score = progress.quizScores[m.id];
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
                    <span className="text-muted-foreground">{pct}%{score && ` · quiz ${score.score}/${score.total}`}</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <CourseFooter />
    </div>
  );
}
