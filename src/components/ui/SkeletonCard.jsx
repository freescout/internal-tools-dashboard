export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 h-32 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded bg-border" />
        <div className="h-8 w-8 rounded-lg bg-border" />
      </div>
      <div className="h-6 w-32 rounded bg-border mb-2" />
      <div className="h-3 w-16 rounded bg-border" />
    </div>
  );
}
