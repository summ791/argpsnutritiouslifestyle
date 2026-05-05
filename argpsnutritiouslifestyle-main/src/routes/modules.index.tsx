import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { modules } from "@/src/lib/course-data";
import { useProgress, moduleProgress, isModuleComplete, isModuleUnlocked, overallProgress, getBadges } from "@/src/lib/progress";

export const Route = createFileRoute("/modules/")({
  head: () => ({
    meta: [
      { title: "Course Modules — FuelSense" },
      { name: "description", content: "All 8 modules of the Tamil Nadu nutrition course. Track progress and continue where you left off." },
    ],
  }),
  component: ModulesPage,
});

function ModulesPage() {
  const { progress } = useProgress();
  const overall = overallProgress(progress);
  const badges = getBadges(progress);

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Course modules</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">Learn step by step</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eight modules, each with focused lessons and a quiz. Complete a module to unlock the next.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Overall progress</span>
            <span className="text-muted-foreground">{overall}% complete</span>
          </div>
          <ProgressBar value={overall} />
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  b.earned
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "bg-secondary text-muted-foreground"
                }`}
                title={b.description}
              >
                <span>{b.emoji}</span> {b.name} {b.earned && "✓"}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((m) => {
            const pct = moduleProgress(progress, m.id);
            const unlocked = isModuleUnlocked(progress, m.id);
            const done = isModuleComplete(progress, m.id);
            const firstLesson = m.lessons[0];
            return (
              <div
                key={m.id}
                className={`relative overflow-hidden rounded-3xl border bg-card p-7 shadow-[var(--shadow-soft)] transition-all ${
                  unlocked ? "border-border hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]" : "border-border opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
                      done ? "bg-[image:var(--gradient-primary)]" : "bg-secondary"
                    }`}>
                      {done ? "✓" : m.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Module {m.number}
                      </div>
                      <h3 className="mt-0.5 font-display text-xl text-foreground">{m.title}</h3>
                    </div>
                  </div>
                  {!unlocked && <span className="text-xl text-muted-foreground">🔒</span>}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">{m.description}</p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.lessons.length} lesson{m.lessons.length > 1 ? "s" : ""} · quiz</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  {unlocked ? (
                    <Link
                      to="/modules/$moduleId/$lessonId"
                      params={{ moduleId: m.id, lessonId: firstLesson.id }}
                      className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
                    >
                      {pct === 0 ? "Start module" : pct === 100 ? "Review" : "Continue"} →
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Complete previous module to unlock</span>
                  )}
                  {pct === 100 && (
                    <Link
                      to="/modules/$moduleId/quiz"
                      params={{ moduleId: m.id }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Retake quiz
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CourseFooter />
    </div>
  );
}
