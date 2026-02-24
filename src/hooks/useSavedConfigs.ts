import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSavedConfigs,
  createSavedConfig,
  deleteSavedConfig,
  type SavedConfig,
} from "@/lib/api";
import { useAuth } from "./useAuth";
import { queryKeys } from "@/lib/queryKeys";
import type { RecommendationConfig } from "@/lib/schemas";

export type { SavedConfig };

export function useSavedConfigs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.savedConfigs(),
    queryFn: () => fetchSavedConfigs().then((r) => r.configs),
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: RecommendationConfig & { name: string }) =>
      createSavedConfig(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.savedConfigs() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSavedConfig(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.savedConfigs() }),
  });

  return {
    configs: query.data ?? [],
    isLoading: query.isLoading,
    saveConfig: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deleteConfig: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
