import { AlertCircle, BookOpen, LoaderCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageStateProps {
  kind: "loading" | "empty" | "error"
  title?: string
  description?: string
  onRetry?: () => void
  action?: React.ReactNode
}

const defaults = {
  loading: {
    title: "Opening your study desk",
    description: "Gathering notes and sources…",
  },
  empty: {
    title: "Nothing here yet",
    description: "Add your first item to begin.",
  },
  error: {
    title: "This page could not be loaded",
    description: "Try again. Your saved work is still here.",
  },
}

export function PageState({
  kind,
  title = defaults[kind].title,
  description = defaults[kind].description,
  onRetry,
  action,
}: PageStateProps) {
  const Icon =
    kind === "loading"
      ? LoaderCircle
      : kind === "error"
        ? AlertCircle
        : BookOpen

  return (
    <div
      className="grid min-h-72 place-items-center border border-dashed border-border bg-card/60 p-8 text-center"
      role={kind === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="max-w-sm">
        <Icon
          className={`mx-auto mb-4 size-6 text-muted-foreground ${kind === "loading" ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        <h2 className="text-2xl font-medium">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {(onRetry || action) && (
          <div className="mt-5 flex justify-center gap-2">
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                <RotateCcw aria-hidden="true" />
                Try again
              </Button>
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="border border-border bg-card p-5">
          <div className="h-3 w-24 animate-pulse bg-muted" />
          <div className="mt-4 h-5 w-2/3 animate-pulse bg-muted" />
          <div className="mt-3 h-3 w-full animate-pulse bg-muted" />
          <div className="mt-2 h-3 w-4/5 animate-pulse bg-muted" />
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}
