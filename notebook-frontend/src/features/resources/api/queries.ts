import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addSources,
  listSources,
  removeSource,
  retrySource,
} from "@/lib/demo-database"
import { collectionKeys } from "@/features/collections/api/queries"
import type { SourceDraft } from "@/types/notebook"

export const sourceKeys = {
  list: (collectionId: string) => ["sources", collectionId] as const,
}

export function useSourcesQuery(collectionId: string) {
  return useQuery({
    queryKey: sourceKeys.list(collectionId),
    queryFn: () => listSources(collectionId),
  })
}

export function useAddSourcesMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (drafts: SourceDraft[]) => addSources(collectionId, drafts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.list(collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.all })
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(collectionId),
      })
    },
  })
}

export function useRemoveSourceMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeSource,
    onMutate: async (sourceId) => {
      await queryClient.cancelQueries({
        queryKey: sourceKeys.list(collectionId),
      })
      const previous = queryClient.getQueryData(sourceKeys.list(collectionId))
      queryClient.setQueryData(
        sourceKeys.list(collectionId),
        (current: Awaited<ReturnType<typeof listSources>> | undefined) =>
          current?.filter((source) => source.id !== sourceId) ?? []
      )
      return { previous }
    },
    onError: (_error, _sourceId, context) => {
      queryClient.setQueryData(sourceKeys.list(collectionId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.list(collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.all })
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(collectionId),
      })
    },
  })
}

export function useRetrySourceMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: retrySource,
    onMutate: async (sourceId) => {
      await queryClient.cancelQueries({
        queryKey: sourceKeys.list(collectionId),
      })
      queryClient.setQueryData(
        sourceKeys.list(collectionId),
        (current: Awaited<ReturnType<typeof listSources>> | undefined) =>
          current?.map((source) =>
            source.id === sourceId
              ? { ...source, status: "processing" as const }
              : source
          ) ?? []
      )
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: sourceKeys.list(collectionId),
      }),
  })
}
