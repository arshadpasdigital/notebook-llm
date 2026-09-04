import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Globe2,
  Link2,
  LoaderCircle,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Type,
} from "lucide-react"
import { SourceModal } from "@/components/source-modal"
import { ListSkeleton, PageState } from "@/components/shared/page-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useAddSourcesMutation,
  useRemoveSourceMutation,
  useRetrySourceMutation,
  useSourcesQuery,
} from "@/features/resources/api/queries"
import { getDemoState, retryDemoState } from "@/lib/demo-state"
import type { SourceDraft, SourceStatus, SourceType } from "@/types/notebook"

export const Route = createFileRoute("/collections/$collectionId/resources")({
  component: ResourcesPage,
})

const typeMeta: Record<SourceType, { label: string; icon: typeof FileText }> = {
  pdf: { label: "PDF", icon: FileText },
  youtube: { label: "YouTube", icon: Link2 },
  website: { label: "Website", icon: Globe2 },
  text: { label: "Text", icon: Type },
}

const statusMeta: Record<
  SourceStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  ready: { label: "Ready", icon: CheckCircle2, className: "text-teal" },
  processing: {
    label: "Processing",
    icon: LoaderCircle,
    className: "text-sienna",
  },
  failed: {
    label: "Needs attention",
    icon: AlertTriangle,
    className: "text-destructive",
  },
}

type Filter = "all" | SourceType

function ResourcesPage() {
  const { collectionId } = Route.useParams()
  const demoState = getDemoState()
  const sourcesQuery = useSourcesQuery(collectionId)
  const addMutation = useAddSourcesMutation(collectionId)
  const removeMutation = useRemoveSourceMutation(collectionId)
  const retryMutation = useRetrySourceMutation(collectionId)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const sources = useMemo(() => {
    if (demoState === "empty") return []
    const query = search.trim().toLowerCase()
    return (sourcesQuery.data ?? []).filter((source) => {
      const matchesFilter = filter === "all" || source.type === filter
      const matchesQuery =
        !query ||
        source.name.toLowerCase().includes(query) ||
        source.detail?.toLowerCase().includes(query)
      return matchesFilter && matchesQuery
    })
  }, [demoState, filter, search, sourcesQuery.data])

  const handleSourceAdded = (drafts: SourceDraft[]) => {
    addMutation.mutate(drafts)
  }

  const handleRemove = (sourceId: string) => {
    if (
      window.confirm(
        "Remove this source? It will no longer be available to this notebook."
      )
    ) {
      removeMutation.mutate(sourceId)
    }
  }

  const showLoading = sourcesQuery.isPending || demoState === "loading"
  const showError = sourcesQuery.isError || demoState === "error"

  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"
    >
      <header className="grid gap-6 border-b border-border pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow">Source library</p>
          <h2 className="mt-2 text-4xl font-medium">
            The material on your desk
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Add only the material this notebook should reason from. Processing
            state is shown before a source becomes available to chat.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus aria-hidden="true" />
          Add source
        </Button>
      </header>

      <div className="my-7 grid gap-4 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center">
        <div className="relative max-w-sm">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sources"
            aria-label="Search sources"
          />
        </div>
        <div
          className="flex max-w-full gap-1 overflow-x-auto border border-border bg-card p-1"
          role="group"
          aria-label="Filter sources by type"
        >
          {(["all", "pdf", "youtube", "website", "text"] as const).map(
            (value) => (
              <Button
                key={value}
                variant={filter === value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className="capitalize"
              >
                {value}
              </Button>
            )
          )}
        </div>
      </div>

      {showLoading ? (
        <ListSkeleton rows={4} />
      ) : showError ? (
        <PageState
          kind="error"
          onRetry={() => retryDemoState(() => sourcesQuery.refetch())}
        />
      ) : sources.length === 0 ? (
        <PageState
          kind="empty"
          title={
            search || filter !== "all"
              ? "No sources match"
              : "Bring in your first source"
          }
          description={
            search || filter !== "all"
              ? "Clear the search or choose another source type."
              : "Add a PDF, YouTube lecture, website, or copied text to ground this notebook."
          }
          action={
            !search && filter === "all" ? (
              <Button onClick={() => setModalOpen(true)}>
                <Plus aria-hidden="true" />
                Add source
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="border-t border-border">
          {sources.map((source) => {
            const TypeIcon = typeMeta[source.type].icon
            const StatusIcon = statusMeta[source.status].icon
            return (
              <article
                key={source.id}
                className="grid gap-4 border-b border-border bg-card/45 px-4 py-5 transition-colors hover:bg-card sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5"
              >
                <div className="grid size-10 place-items-center border border-border bg-background">
                  <TypeIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold" dir="auto">
                      {source.name}
                    </h3>
                    <span className="eyebrow">
                      {typeMeta[source.type].label}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {demoState === "long"
                      ? `${source.detail ?? "Source"} · An intentionally long source description that verifies truncation and action stability on narrow layouts`
                      : source.detail}{" "}
                    · Added{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(source.addedAt))}
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${statusMeta[source.status].className}`}
                  >
                    <StatusIcon
                      className={`size-3.5 ${source.status === "processing" ? "animate-spin" : ""}`}
                      aria-hidden="true"
                    />
                    {statusMeta[source.status].label}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1">
                  {source.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retryMutation.mutate(source.id)}
                      disabled={retryMutation.isPending}
                    >
                      <RotateCcw aria-hidden="true" />
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(source.id)}
                    disabled={removeMutation.isPending}
                    aria-label={`Remove ${source.name}`}
                    title={`Remove ${source.name}`}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-6 min-h-5" role="status" aria-live="polite">
        {addMutation.isPending && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Adding and processing source…
          </p>
        )}
        {removeMutation.isPending && (
          <p className="text-sm text-muted-foreground">Removing source…</p>
        )}
        {(addMutation.isError ||
          removeMutation.isError ||
          retryMutation.isError) && (
          <p className="text-sm text-destructive" role="alert">
            The source update failed. Your previous list has been restored.
          </p>
        )}
      </div>

      <SourceModal
        open={modalOpen}
        setOpen={setModalOpen}
        onSourceAdded={handleSourceAdded}
      />
    </main>
  )
}
