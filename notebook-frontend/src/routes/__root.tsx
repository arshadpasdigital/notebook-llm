import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-24 border border-foreground bg-background px-4 py-2 text-sm font-semibold text-foreground transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Outlet />
    </>
  )
}
