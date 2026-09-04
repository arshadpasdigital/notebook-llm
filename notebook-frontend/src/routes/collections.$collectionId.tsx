import { createFileRoute } from "@tanstack/react-router"
import { CollectionShell } from "@/components/shared/collection-shell"

export const Route = createFileRoute("/collections/$collectionId")({
  component: CollectionLayout,
})

function CollectionLayout() {
  const { collectionId } = Route.useParams()
  return <CollectionShell collectionId={collectionId} />
}
