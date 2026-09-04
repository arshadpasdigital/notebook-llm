import { Link, Outlet } from "@tanstack/react-router"
import {
  ArrowLeft,
  BookCopy,
  Brain,
  LibraryBig,
  MessageSquareText,
  PanelLeftClose,
} from "lucide-react"
import { useCollectionQuery } from "@/features/collections/api/queries"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Wordmark } from "@/components/shared/wordmark"
import { PageState } from "@/components/shared/page-state"
import { cn } from "@/lib/utils"

interface CollectionShellProps {
  collectionId: string
}

const navItems = [
  { label: "Ask", suffix: "chat", icon: MessageSquareText },
  { label: "Memory", suffix: "memory", icon: Brain },
  { label: "Learn", suffix: "learning", icon: BookCopy },
  { label: "Sources", suffix: "resources", icon: LibraryBig },
] as const

export function CollectionShell({ collectionId }: CollectionShellProps) {
  const collectionQuery = useCollectionQuery(collectionId)

  if (collectionQuery.isPending) {
    return (
      <main id="main-content" className="grid min-h-svh place-items-center p-5">
        <PageState kind="loading" />
      </main>
    )
  }

  if (collectionQuery.isError) {
    return (
      <main id="main-content" className="grid min-h-svh place-items-center p-5">
        <PageState kind="error" onRetry={() => collectionQuery.refetch()} />
      </main>
    )
  }

  const collection = collectionQuery.data

  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <h1 className="sr-only">{collection.name} notebook</h1>
      <aside className="hidden border-r border-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Wordmark />
          <ThemeToggle />
        </div>
        <div className="px-5 py-6">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All notebooks
          </Link>
          <p className="eyebrow mt-8">Current notebook</p>
          <p
            className="reading-copy mt-2 text-2xl leading-tight font-medium [overflow-wrap:anywhere]"
            dir="auto"
          >
            {collection.name}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {collection.sourceCount} sources · {collection.memoryCount} memories
          </p>
        </div>
        <nav className="mt-2 px-3" aria-label="Notebook navigation">
          {navItems.map(({ label, suffix, icon: Icon }) => (
            <Link
              key={suffix}
              to={`/collections/$collectionId/${suffix}`}
              params={{ collectionId }}
              className="mb-1 flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-[color,background-color,border-color] hover:bg-accent/60 hover:text-foreground"
              activeProps={{
                className: "border-primary bg-accent text-foreground",
              }}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-5 text-xs leading-5 text-muted-foreground">
          <PanelLeftClose className="mb-2 size-4" aria-hidden="true" />
          Your demo work stays in this browser session.
        </div>
      </aside>

      <div className="min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:hidden">
          <Link
            to="/collections"
            aria-label="Back to all notebooks"
            className="grid size-10 place-items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="eyebrow">Notebook</p>
            <p className="truncate text-sm font-semibold">{collection.name}</p>
          </div>
          <ThemeToggle />
        </header>
        <Outlet />
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] grid-cols-4 border-t border-border bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
        aria-label="Notebook navigation"
      >
        {navItems.map(({ label, suffix, icon: Icon }) => (
          <Link
            key={suffix}
            to={`/collections/$collectionId/${suffix}`}
            params={{ collectionId }}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-1 text-[0.68rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            )}
            activeProps={{ className: "text-primary" }}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
