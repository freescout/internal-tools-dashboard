import { useTools } from "../hooks/useTools";

export default function ToolsPage() {
  const { data: tools = [], isLoading, isError } = useTools();

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-text-primary">Tools Page</h1>
      <p className="text-sm text-text-muted mt-1">
        {isLoading && "Loading…"}
        {isError && "Error fetching tools."}
        {!isLoading && !isError && `${tools.length} tools loaded ✓`}
      </p>
    </main>
  );
}
