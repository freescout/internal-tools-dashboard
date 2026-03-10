import { useQuery } from "@tanstack/react-query";
import { fetchRecentTools } from "../lib/api";
import { sanitizeTools } from "../utils/formatters";

export const useRecentTools = () => {
  return useQuery({
    queryKey: ["recentTools"],
    queryFn: async () => {
      const tools = await fetchRecentTools();
      return sanitizeTools(tools).slice(0, 8);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
