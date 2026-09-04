import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Wordmark } from "@/components/shared/wordmark"

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <nav
          className="flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>
          <Button
            className="hidden sm:inline-flex"
            variant="ghost"
            render={<Link to="/login" />}
          >
            Sign in
          </Button>
          <Button render={<Link to="/collections" />}>
            <span className="sm:hidden">Open</span>
            <span className="hidden sm:inline">Open workspace</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
