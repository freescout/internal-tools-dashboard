export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center gap-4 flex-col">
      <h1 className="text-text-primary text-3xl font-bold">
        TechCorp Dashboard
      </h1>
      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-text-secondary">Surface card test</p>
      </div>
      <div className="flex gap-2">
        <span className="bg-accent-purple px-3 py-1 rounded text-white text-sm">
          Purple
        </span>
        <span className="bg-accent-blue px-3 py-1 rounded text-white text-sm">
          Blue
        </span>
        <span className="bg-accent-pink px-3 py-1 rounded text-white text-sm">
          Pink
        </span>
        <span className="bg-accent-green px-3 py-1 rounded text-white text-sm">
          Green
        </span>
      </div>
      <div className="flex gap-2">
        <span className="bg-status-active px-3 py-1 rounded text-white text-sm">
          Active
        </span>
        <span className="bg-status-expiring px-3 py-1 rounded text-white text-sm">
          Expiring
        </span>
        <span className="bg-status-unused px-3 py-1 rounded text-white text-sm">
          Unused
        </span>
      </div>
    </div>
  );
}
