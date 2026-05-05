import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { ProgressBar } from "@/src/components/course/ProgressBar";
import { modules } from "@/src/lib/course-data";
import { useProgress, overallProgress } from "@/src/lib/progress";
import heroImg from "@/src/assets/hero-nutrition.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Art of Human FuelSense — Tamil Nadu Nutrition Course" },
      { name: "description", content: "Practical Tamil Nadu-based nutrition course. Learn calories, balanced meals, and smart eating with real local food." },
      { property: "og:title", content: "The Art of Human FuelSense" },
      { property: "og:description", content: "Fuel your body right — a guided nutrition journey rooted in Tamil Nadu food." },
    ],
  }),
  component: Home,
});

function Home() {
  const { progress } = useProgress();
  const overall = overallProgress(progress);
  const last = progress.lastVisited;

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute right-[-8%] top-[20%] -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
        <div className="absolute left-[-6%] bottom-[-10%] -z-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl animate-float-slow" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              🌱 A Tamil Nadu Nutrition Course
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-foreground md:text-6xl">
              The Art of <em className="italic text-primary">Human FuelSense</em>
            </h1>
            <p className="mt-5 text-xl text-foreground/80">Fuel your body right.</p>
            <p className="mt-3 max-w-lg text-base text-muted-foreground">
              Learn practical Tamil Nadu-based nutrition in a simple, realistic way. No diets, no restrictions — just understanding the food you already love.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={last ? "/modules/$moduleId/$lessonId" : "/modules"}
                params={last ? { moduleId: last.moduleId, lessonId: last.lessonId } : undefined as never}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-glow)]"
              >
                {last ? "Resume Learning" : "Start Learning"} →
              </Link>
              <Link to="/about" className="rounded-full border border-border bg-card/60 px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-card">
                About the authors
              </Link>
            </div>

            {overall > 0 && (
              <div className="mt-8 max-w-sm rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Your progress</span>
                  <span className="text-foreground">{overall}%</span>
                </div>
                <ProgressBar value={overall} />
              </div>
            )}
          </div>

          <div className="relative animate-fade-up [animation-delay:0.15s]">
            <div className="absolute -inset-4 rounded-[2rem] bg-[image:var(--gradient-primary)] opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="Tamil Nadu nutritious meal flat lay with idli, dosa, sambar, fruits and greens"
              width={1600}
              height={1200}
              className="relative rounded-[2rem] shadow-[var(--shadow-elegant)]"
            />
          </div>
        </div>
      </section>

      {/* WHY UNIQUE */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why this course</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Built around the food on your plate.</h2>
          <p className="mt-4 text-muted-foreground">
            Most nutrition guides talk about foods you've never seen. This one is about idli, dosa, sambar, rasam, poriyal, biryani — the real Tamil Nadu kitchen.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "🍛", title: "Real Tamil Nadu food", body: "Idli, dosa, sambar, kuzhambu, biryani — measured in cups, ladles, and plates you actually use." },
            { icon: "📐", title: "Practical & realistic", body: "No weighing scales. Estimate any meal using household measures and your hand." },
            { icon: "🧠", title: "Science meets tradition", body: "Modern nutrition principles applied to traditional, time-tested local foods." },
          ].map((f) => (
            <div key={f.title} className="group rounded-3xl border border-border bg-[image:var(--gradient-card)] p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">{f.icon}</div>
              <h3 className="font-display text-xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-[var(--shadow-soft)] md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Who this is for</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Anyone who eats. Especially you.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { e: "🎓", t: "Students", d: "Learn fuel for focus and energy" },
              { e: "💼", t: "Working adults", d: "Eat well on a busy schedule" },
              { e: "🏠", t: "Homemakers", d: "Build healthier family meals" },
              { e: "💪", t: "Fitness lovers", d: "Hit protein goals with local food" },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl bg-secondary/60 p-5">
                <div className="text-3xl">{p.e}</div>
                <div className="mt-2 font-semibold text-foreground">{p.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-4xl text-foreground">What you'll walk away with</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { t: "Understand calories", d: "Read any meal — home or hotel — like a nutritionist." },
            { t: "Build balanced meals", d: "A simple framework that fits the Tamil Nadu plate." },
            { t: "Improve daily health", d: "Small habits that compound into long-term wellness." },
            { t: "Eat smart without restriction", d: "Enjoy biryani, mango, ghee dosa — with awareness." },
          ].map((b, i) => (
            <div key={b.t} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
                {i + 1}
              </div>
              <div>
                <div className="font-display text-lg text-foreground">{b.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{b.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">8 Modules</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">Your learning journey</h2>
          </div>
          <Link to="/modules" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View all modules →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.slice(0, 4).map((m) => (
            <Link
              key={m.id}
              to="/modules"
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="mb-3 text-3xl">{m.icon}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Module {m.number}</div>
              <div className="mt-1 font-display text-lg text-foreground group-hover:text-primary">{m.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <CourseFooter />
    </div>
  );
}
