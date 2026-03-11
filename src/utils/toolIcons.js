import {
  MessageSquare,
  Palette,
  Zap,
  FileText,
  Brush,
  Video,
  Wrench,
  Briefcase,
  Box,
  Shield,
  Building2,
  Terminal,
  Layout,
} from "lucide-react";

const toolIconMap = {
  slack: {
    icon: MessageSquare,
    bg: "bg-purple-500/10",
    color: "text-purple-400",
  },
  figma: { icon: Palette, bg: "bg-pink-500/10", color: "text-pink-400" },
  github: { icon: Zap, bg: "bg-yellow-500/10", color: "text-yellow-400" },
  notion: { icon: FileText, bg: "bg-gray-500/10", color: "text-gray-400" },
  "adobe cc": { icon: Brush, bg: "bg-red-500/10", color: "text-red-400" },
  zoom: { icon: Video, bg: "bg-blue-500/10", color: "text-blue-400" },
  jira: { icon: Wrench, bg: "bg-blue-600/10", color: "text-blue-500" },
  salesforce: { icon: Briefcase, bg: "bg-cyan-500/10", color: "text-cyan-400" },
  "mueller security": {
    icon: Shield,
    bg: "bg-green-500/10",
    color: "text-green-400",
  },
  "johnston inc securite": {
    icon: Building2,
    bg: "bg-orange-500/10",
    color: "text-orange-400",
  },
  nvim: { icon: Terminal, bg: "bg-emerald-500/10", color: "text-emerald-400" },
  "office 365": { icon: Layout, bg: "bg-red-500/10", color: "text-red-400" },
};

export const getToolIcon = (name) => {
  const key = name?.toLowerCase().trim();
  return (
    toolIconMap[key] ?? {
      icon: Box,
      bg: "bg-accent-purple/10",
      color: "text-accent-purple",
    }
  );
};
