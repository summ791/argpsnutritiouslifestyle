import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Art of Human FuelSense" },
      { name: "description", content: "Meet the authors and the mission behind this Tamil Nadu nutrition course." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About the course</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">A practical guide, born from real practice.</h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground/85">
          The Art of Human FuelSense was created to give Tamil Nadu a practical, scientific, everyday
          nutrition guide — one that respects culture but follows science. A guide that helps people
          eat smart without giving up taste.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-[image:var(--gradient-card)] p-7 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Author</div>
            <h2 className="mt-1 font-display text-2xl text-foreground">G. Subashini</h2>
            <p className="mt-1 text-sm text-muted-foreground">Dietician</p>
            <p className="mt-3 text-sm text-foreground/80">Years of hands-on experience guiding individuals through real-life dietary planning and wellness support.</p>
          </div>

          <div className="rounded-3xl border border-border bg-[image:var(--gradient-card)] p-7 shadow-[var(--shadow-soft)]">
            
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Co-author</div>
            <h2 className="mt-1 font-display text-2xl text-foreground">Rithanya Gopinathan</h2>
            <p className="mt-1 text-sm text-muted-foreground">Wellness Consultant</p>
            <p className="mt-3 text-sm text-foreground/80">Brought structure, clarity and accessibility to make this guide reader-friendly for everyone.</p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-l-4 border-primary bg-card p-7">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mission</div>
          <p className="mt-3 font-display text-2xl leading-snug text-foreground">
            To provide a practical, realistic, and culturally relevant nutrition guide based on
            Tamil Nadu food habits.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/modules" className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
            Begin the course →
          </Link>
        </div>
      </section>
      <CourseFooter />
    </div>
  );
}
