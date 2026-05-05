import { Link } from "@tanstack/react-router";
import { useAuth, signOut } from "@/src/lib/auth";

export function CourseHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-lg shadow-[var(--shadow-soft)]">
            🌿
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-foreground">FuelSense</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Tamil Nadu Nutrition
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/modules" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">
            Modules
          </Link>
          <Link to="/meal-builder" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">
            Meal Builder
          </Link>
          <Link to="/progress" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">
            Progress
          </Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">
            About
          </Link>
        </nav>
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary md:inline-flex"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export function CourseFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="font-display text-lg text-foreground">The Art of Human FuelSense</div>
            <div>By G. Subashini (Dietician) & Rithanya Gopinathan</div>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} FuelSense. Eat smart, live well.</div>
        </div>
      </div>
    </footer>
  );
}
