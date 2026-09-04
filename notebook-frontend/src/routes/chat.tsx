import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/chat")({
  component: ChatCompatibilityRoute,
})

function ChatCompatibilityRoute() {
  return (
    <Navigate
      to="/collections/$collectionId/chat"
      params={{ collectionId: "demo" }}
      replace
    />
  )
}
