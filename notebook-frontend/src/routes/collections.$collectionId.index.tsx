import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/collections/$collectionId/")({
  component: CollectionIndex,
})

function CollectionIndex() {
  const { collectionId } = Route.useParams()
  return (
    <Navigate
      to="/collections/$collectionId/chat"
      params={{ collectionId }}
      replace
    />
  )
}
