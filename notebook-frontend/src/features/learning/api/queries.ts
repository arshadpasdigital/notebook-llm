import { useQuery } from "@tanstack/react-query"
import { listArtifacts } from "@/lib/demo-database"

export const artifactKeys = {
  list: (collectionId: string) => ["artifacts", collectionId] as const,
}

export function useArtifactsQuery(collectionId: string) {
  return useQuery({
    queryKey: artifactKeys.list(collectionId),
    queryFn: () => listArtifacts(collectionId),
  })
}
