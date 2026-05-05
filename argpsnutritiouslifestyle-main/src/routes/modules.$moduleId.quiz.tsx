import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { modules } from "@/src/lib/course-data";
import { useProgress } from "@/src/lib/progress";

export const Route = createFileRoute("/modules/$moduleId/quiz")({
  component: QuizPage,
  loader: ({ params }) => {
    const m = modules.find((x) => x.id === params.moduleId);
    if (!m) throw notFound();
    return m;
  },
});

function QuizPage() {
  const m = Route.useLoaderData();
  const { saveQuiz, progress } = useProgress();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  const q = m.quiz[step];
  const total = m.quiz.length * 10;

  const select = (idx: number) => {
    if (revealed[q.id]) return;
    setAnswers({ ...answers, [q.id]: idx });
    setRevealed({ ...revealed, [q.id]: true });
  };

  const nextQuestion = () => {
    if (step < m.quiz.length - 1) setStep(step + 1);
    else {
      const score = m.quiz.reduce((acc: number, qq: { id: string; answer: number }) => acc + (answers[qq.id] === qq.answer ? 10 : 0), 0);
      saveQuiz(m.id, score, total);
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0); setAnswers({}); setRevealed({}); setDone(false);
  };

  if (done) {
    const score = m.quiz.reduce((acc: number, qq: { id: string; answer: number }) => acc + (answers[qq.id] === qq.answer ? 10 : 0), 0);
    const pct = Math.round((score / total) * 100);
    const msg = pct >= 90 ? { t: "Excellent! 🎉", d: "You've truly absorbed this module." }
              : pct >= 70 ? { t: "Good job 👍", d: "Solid understanding — review tricky points anytime." }
              : { t: "Try again 🔁", d: "Re-read the lesson and give it another go." };

    return (
      <div className="min-h-screen bg-background">
        <CourseHeader />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-4xl shadow-[var(--shadow-glow)]">
            {pct >= 70 ? "🌟" : "🌱"}
          </div>
          <h1 className="mt-6 font-display text-4xl text-foreground">{msg.t}</h1>
          <p className="mt-2 text-muted-foreground">{msg.d}</p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <div className="font-display text-6xl text-foreground">
              {score}<span className="text-2xl text-muted-foreground">/{total}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{pct}% correct</div>
            <ProgressBar value={pct} className="mt-5" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={reset} className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium hover:bg-secondary">Retake quiz</button>
            <Link to="/modules" className="rounded-full bg-[image:var(--gradient-primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
              Back to modules →
            </Link>
          </div>
        </div>
        <CourseFooter />
      </div>
    );
  }

  const userAnswer = answers[q.id];
  const isRevealed = revealed[q.id];

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/modules" className="text-sm text-muted-foreground hover:text-foreground">← All modules</Link>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Check your knowledge</p>
          <h1 className="mt-2 font-display text-3xl text-foreground">{m.title}</h1>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {step + 1} of {m.quiz.length}</span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-wider">{q.type === "tf" ? "True / False" : q.type === "scenario" ? "Scenario" : "Multiple choice"}</span>
        </div>
        <ProgressBar value={((step + (isRevealed ? 1 : 0)) / m.quiz.length) * 100} className="mt-3" />

        <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl text-foreground">{q.question}</h2>
          <div className="mt-6 space-y-3">
            {q.options.map((opt: string, i: number) => {
              const correct = i === q.answer;
              const chosen = userAnswer === i;
              let cls = "border-border bg-background hover:border-primary/50 hover:bg-secondary/40";
              if (isRevealed) {
                if (correct) cls = "border-[oklch(0.65_0.15_150)] bg-[oklch(0.65_0.15_150)]/10 text-foreground";
                else if (chosen) cls = "border-destructive bg-destructive/10 text-foreground";
                else cls = "border-border bg-background opacity-60";
              }
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={isRevealed}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all ${cls}`}
                >
                  <span>{opt}</span>
                  {isRevealed && correct && <span className="text-[oklch(0.55_0.18_150)]">✓ Correct</span>}
                  {isRevealed && chosen && !correct && <span className="text-destructive">✗</span>}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div className="mt-5 rounded-2xl bg-secondary/60 p-4 text-sm text-foreground/90">
              <span className="font-semibold">Why: </span>{q.explanation}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={nextQuestion}
            disabled={!isRevealed}
            className="rounded-full bg-[image:var(--gradient-primary)] px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {step < m.quiz.length - 1 ? "Next question" : "Finish quiz"} →
          </button>
        </div>

        {progress.quizScores[m.id] && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Best score: {progress.quizScores[m.id].score}/{progress.quizScores[m.id].total}
          </p>
        )}
      </div>
      <CourseFooter />
    </div>
  );
}
