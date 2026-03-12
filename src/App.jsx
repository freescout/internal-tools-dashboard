import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import ToolsPage from "./pages/ToolsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
