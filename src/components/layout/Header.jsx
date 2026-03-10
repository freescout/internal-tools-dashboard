import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  Zap,
  Sun,
  Settings,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", path: "/", active: true },
  { label: "Tools", path: "/tools", active: false },
  { label: "Analytics", path: "/analytics", active: false },
  { label: "Settings", path: "/settings", active: false },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-dark">
      <div className="mx-auto max-w-6xl w-full flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-linear-to-r from-accent-purple to-accent-blue flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-text-primary">
              TechCorp
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.active
                    ? "bg-accent-purple/10 text-accent-purple"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-surface border border-border/50 rounded-lg px-3 py-2 w-64">
            <Search size={14} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search tools..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
            />
          </div>

          {/* Theme toggle */}
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Sun size={18} className="text-yellow-400" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell size={18} className="text-text-secondary" />
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Settings size={18} className="text-text-secondary" />
          </button>

          {/* Avatar */}
          <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <div className="h-8 w-8 rounded-full bg-slate-300" />
            <ChevronDown
              size={14}
              className="text-text-muted hidden md:block"
            />
          </button>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                link.active
                  ? "bg-accent-purple/10 text-accent-purple font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
