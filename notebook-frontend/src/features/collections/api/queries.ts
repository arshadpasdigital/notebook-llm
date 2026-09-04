import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCollection,
  deleteCollection,
  getCollection,
  listCollections,
} from "@/lib/demo-database"

export const collectionKeys = {
  all: ["collections"] as const,
  detail: (collectionId: string) => ["collections", collectionId] as const,
}

export function useCollectionsQuery() {
  return useQuery({ queryKey: collectionKeys.all, queryFn: listCollections })
}

export function useCollectionQuery(collectionId: string) {
  return useQuery({
    queryKey: collectionKeys.detail(collectionId),
    queryFn: () => getCollection(collectionId),
  })
}

export function useCreateCollectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCollection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: collectionKeys.all }),
  })
}

export function useDeleteCollectionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: collectionKeys.all }),
  })
}
