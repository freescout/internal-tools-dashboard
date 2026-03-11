import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkDeleteTools,
  createTool,
  deleteTool,
  fetchAllTools,
  updateTool,
} from "../lib/api";

export const TOOLS_KEY = ["tools"];

export const useTools = () => {
  return useQuery({
    queryKey: TOOLS_KEY,
    queryFn: fetchAllTools,
    staleTime: 1000 * 60 * 2,
  });
};

export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTool,
    onSuccess: () => qc.invalidateQueries({ queryKey: TOOLS_KEY }),
  });
}

export function useUpdateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTool(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TOOLS_KEY }),
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTool,
    onSuccess: () => qc.invalidateQueries({ queryKey: TOOLS_KEY }),
  });
}

export function useBulkDeleteTools() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteTools,
    onSuccess: () => qc.invalidateQueries({ queryKey: TOOLS_KEY }),
  });
}
