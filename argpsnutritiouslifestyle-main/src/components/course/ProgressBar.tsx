type Props = { value: number; className?: string };
export function ProgressBar({ value, className = "" }: Props) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
