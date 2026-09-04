import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createMemory, listMemories, removeMemory } from "@/lib/demo-database"
import { collectionKeys } from "@/features/collections/api/queries"

export const memoryKeys = {
  list: (collectionId: string) => ["memories", collectionId] as const,
}

export function useMemoriesQuery(collectionId: string) {
  return useQuery({
    queryKey: memoryKeys.list(collectionId),
    queryFn: () => listMemories(collectionId),
  })
}

export function useCreateMemoryMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { title: string; content: string }) =>
      createMemory(collectionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoryKeys.list(collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.all })
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(collectionId),
      })
    },
  })
}

export function useRemoveMemoryMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoryKeys.list(collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.all })
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(collectionId),
      })
    },
  })
}
