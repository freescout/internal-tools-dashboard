import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  );
}
