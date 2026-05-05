import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CourseHeader, CourseFooter } from "@/src/components/course/CourseLayout";
import { foodItems, type FoodItem } from "@/src/lib/course-data";

const CATEGORIES = ["All", "Breakfast", "Grains", "Curries & Dals", "Non-Veg", "Vegetables", "Fruits", "Snacks", "Dairy", "Beverages"] as const;

export const Route = createFileRoute("/meal-builder")({
  head: () => ({
    meta: [
      { title: "Meal Builder — FuelSense" },
      { name: "description", content: "Build a Tamil Nadu meal and see calories, protein, carbs and fat instantly." },
    ],
  }),
  component: MealBuilder,
});

function MealBuilder() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const visibleFoods: FoodItem[] = useMemo(() => {
    return foodItems.filter((f) => {
      const matchesCat = category === "All" || f.category === category;
      const matchesQuery = !query.trim() || f.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [category, query]);

  const totals = useMemo(() => {
    return foodItems.reduce(
      (acc, f) => {
        const n = counts[f.name] || 0;
        acc.calories += f.calories * n;
        acc.protein += f.protein * n;
        acc.carbs += f.carbs * n;
        acc.fat += f.fat * n;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [counts]);

  const set = (name: string, delta: number) => {
    setCounts((c) => ({ ...c, [name]: Math.max(0, (c[name] || 0) + delta) }));
  };

  const tip = totals.calories === 0 ? "Add foods to see your meal nutrition."
    : totals.calories < 300 ? "Light meal — great for a snack or breakfast."
    : totals.calories < 700 ? "Balanced meal range. Make sure you have a grain + protein + vegetable."
    : "Heavy meal — keep the next meal lighter and stay active.";

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Interactive tool</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">Meal Builder</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Add Tamil Nadu foods to your plate and see calories, protein, carbs and fat update live.
          Browse {foodItems.length}+ foods from the book, organised by category.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods (e.g. dosa, sambar, mango)…"
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  category === c
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleFoods.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
                No foods match your search.
              </p>
            )}
            {visibleFoods.map((f) => {
              const n = counts[f.name] || 0;
              return (
                <div key={f.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">{f.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{f.name}</div>
                    <div className="text-[11px] text-primary/80">{f.serving}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.calories} kcal · P {f.protein}g · C {f.carbs}g · F {f.fat}g
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => set(f.name, -1)} className="h-8 w-8 rounded-full border border-border text-muted-foreground hover:bg-secondary">−</button>
                    <span className="w-6 text-center font-medium text-foreground">{n}</span>
                    <button onClick={() => set(f.name, 1)} className="h-8 w-8 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">+</button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-[image:var(--gradient-card)] p-7 shadow-[var(--shadow-elegant)]">
              <h2 className="font-display text-xl text-foreground">Your plate</h2>
              <div className="mt-6 font-display text-5xl text-foreground">
                {Math.round(totals.calories)}
                <span className="ml-1 text-base text-muted-foreground">kcal</span>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                {[
                  { l: "Protein", v: totals.protein, c: "oklch(0.62 0.13 150)" },
                  { l: "Carbs", v: totals.carbs, c: "oklch(0.78 0.12 90)" },
                  { l: "Fat", v: totals.fat, c: "oklch(0.7 0.13 50)" },
                ].map((r) => (
                  <div key={r.l}>
                    <div className="mb-1 flex justify-between"><span className="text-muted-foreground">{r.l}</span><span className="text-foreground">{r.v.toFixed(1)} g</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, r.v * 2)}%`, background: r.c }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-secondary/60 p-4 text-xs text-foreground/80">{tip}</p>
              {totals.calories > 0 && (
                <button onClick={() => setCounts({})} className="mt-4 w-full rounded-full border border-border bg-card py-2 text-xs text-muted-foreground hover:bg-secondary">
                  Clear plate
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>

      <CourseFooter />
    </div>
  );
}
