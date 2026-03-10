import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "../lib/api";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
