import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { findLesson, getLessonNeighbors } from "@/src/lib/course-data";
import { useProgress, moduleProgress } from "@/src/lib/progress";

export const Route = createFileRoute("/modules/$moduleId/$lessonId")({
  component: LessonPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Link to="/modules" className="text-primary underline">Lesson not found — back to modules</Link>
    </div>
  ),
  loader: ({ params }) => {
    const found = findLesson(params.moduleId, params.lessonId);
    if (!found) throw notFound();
    return found;
  },
});

function LessonPage() {
  const { module: m, lesson } = Route.useLoaderData();
  const params = Route.useParams();
  const navigate = useNavigate();
  const { progress, markLessonComplete, setLastVisited } = useProgress();
  const { prev, next, index, total } = getLessonNeighbors(params.moduleId, params.lessonId);

  useEffect(() => {
    setLastVisited(params.moduleId, params.lessonId);
  }, [params.moduleId, params.lessonId, setLastVisited]);

  const isLastInModule = m.lessons[m.lessons.length - 1].id === lesson.id;
  const pct = moduleProgress(progress, m.id);

  const handleComplete = () => {
    markLessonComplete(params.moduleId, params.lessonId);
    if (isLastInModule) {
      navigate({ to: "/modules/$moduleId/quiz", params: { moduleId: m.id } });
    } else if (next) {
      navigate({ to: "/modules/$moduleId/$lessonId", params: { moduleId: next.moduleId, lessonId: next.lessonId } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />

      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/modules" className="text-sm text-muted-foreground hover:text-foreground">← All modules</Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-3xl">{m.icon}</span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Module {m.number} · Lesson {m.lessons.findIndex((l: { id: string }) => l.id === lesson.id) + 1} of {m.lessons.length}
            </div>
            <div className="text-sm text-muted-foreground">{m.title}</div>
          </div>
        </div>

        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{lesson.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">{lesson.intro}</p>

        <h2 className="mt-10 font-display text-2xl text-foreground">Key ideas</h2>
        <ul className="mt-4 space-y-3">
          {lesson.points.map((p: string, i: number) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
              <span className="text-foreground/90">{p}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl text-foreground">Real-life examples</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {lesson.examples.map((e: string, i: number) => (
            <div key={i} className="rounded-2xl bg-secondary/60 p-4 text-sm text-foreground/90">
              🍴 {e}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border-l-4 border-primary bg-[image:var(--gradient-card)] p-6 shadow-[var(--shadow-soft)]">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Key Takeaway</div>
          <p className="mt-2 font-display text-xl leading-snug text-foreground">{lesson.takeaway}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Lesson {index + 1} of {total} overall</span>
            <span className="font-medium text-foreground">{pct}% module</span>
          </div>
          <ProgressBar value={pct} />
        </div>

        {/* NAV */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          {prev ? (
            <Link
              to="/modules/$moduleId/$lessonId"
              params={{ moduleId: prev.moduleId, lessonId: prev.lessonId }}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              ← Previous
            </Link>
          ) : <span />}

          <button
            onClick={handleComplete}
            className="rounded-full bg-[image:var(--gradient-primary)] px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
          >
            {isLastInModule ? "Complete & take quiz" : "Mark complete & continue"} →
          </button>
        </div>
      </article>

      <CourseFooter />
    </div>
  );
}

