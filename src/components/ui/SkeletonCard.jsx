export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 rounded bg-border" />
        <div className="h-8 w-8 rounded-lg bg-border" />
      </div>
      <div className="h-8 w-32 rounded bg-border mb-2" />
      <div className="h-3 w-20 rounded bg-border" />
    </div>
  );
}
