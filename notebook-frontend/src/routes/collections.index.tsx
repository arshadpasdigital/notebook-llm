import { useMemo, useState, type FormEvent } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import {
  useCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from "@/features/collections/api/queries"
import { getDemoState, retryDemoState } from "@/lib/demo-state"
import { Wordmark } from "@/components/shared/wordmark"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { ListSkeleton, PageState } from "@/components/shared/page-state"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { NotebookCollection } from "@/types/notebook"

export const Route = createFileRoute("/collections/")({
  component: CollectionsPage,
})

const accentClass: Record<NotebookCollection["accent"], string> = {
  teal: "bg-teal",
  sienna: "bg-sienna",
  ink: "bg-foreground",
}

const formatUpdated = (value: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(value)
  )

function CollectionsPage() {
  const navigate = useNavigate()
  const demoState = getDemoState()
  const collectionsQuery = useCollectionsQuery()
  const createMutation = useCreateCollectionMutation()
  const deleteMutation = useDeleteCollectionMutation()
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<NotebookCollection | null>(
    null
  )
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const collections = useMemo(() => {
    const base = demoState === "empty" ? [] : (collectionsQuery.data ?? [])
    const query = search.trim().toLowerCase()
    if (!query) return base
    return base.filter(
      (collection) =>
        collection.name.toLowerCase().includes(query) ||
        collection.description.toLowerCase().includes(query)
    )
  }, [collectionsQuery.data, demoState, search])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    try {
      const collection = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || "A focused notebook",
      })
      setCreateOpen(false)
      setName("")
      setDescription("")
      navigate({
        to: "/collections/$collectionId/chat",
        params: { collectionId: collection.id },
      })
    } catch {
      // The mutation state renders the actionable error in the open dialog.
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      // Keep the confirmation open so the user can retry or cancel.
    }
  }

  const showLoading = collectionsQuery.isPending || demoState === "loading"
  const showError = collectionsQuery.isError || demoState === "error"

  return (
    <div className="min-h-svh">
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" render={<Link to="/" />}>
              Home
            </Button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14"
      >
        <div className="grid gap-8 border-b border-border pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Your study desk</p>
            <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Notebooks</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Keep each subject self-contained, so every answer, memory, and
              practice set stays grounded in the right material.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden="true" />
            New notebook
          </Button>
        </div>

        <div className="my-8 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notebooks"
              aria-label="Search notebooks"
            />
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {collections.length}{" "}
            {collections.length === 1 ? "notebook" : "notebooks"}
          </p>
        </div>

        {showLoading ? (
          <ListSkeleton rows={3} />
        ) : showError ? (
          <PageState
            kind="error"
            onRetry={() => retryDemoState(() => collectionsQuery.refetch())}
          />
        ) : collections.length === 0 ? (
          <PageState
            kind="empty"
            title={search ? "No notebooks match" : "Begin with one notebook"}
            description={
              search
                ? "Try a different word or clear the search."
                : "Create a notebook for a class, project, or line of inquiry."
            }
            action={
              !search ? (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus aria-hidden="true" />
                  New notebook
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection, index) => (
              <article
                key={collection.id}
                className="group relative flex min-h-64 flex-col border border-border bg-card p-5 transition-[border-color,box-shadow,transform] duration-200 hover:border-foreground/35 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
              >
                <div className={`h-1 w-12 ${accentClass[collection.accent]}`} />
                <div className="mt-7 flex items-start justify-between gap-4">
                  <p className="eyebrow">
                    Notebook {String(index + 1).padStart(2, "0")}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(collection)}
                    aria-label={`Delete ${collection.name}`}
                    title={`Delete ${collection.name}`}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
                <h2
                  className="mt-3 text-2xl leading-tight font-medium [overflow-wrap:anywhere]"
                  dir="auto"
                >
                  {collection.name}
                </h2>
                <p
                  className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground"
                  dir="auto"
                >
                  {collection.description}
                </p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpenText className="size-3.5" aria-hidden="true" />
                      {collection.sourceCount} sources
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Brain className="size-3.5" aria-hidden="true" />
                      {collection.memoryCount}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={
                      <Link
                        to="/collections/$collectionId/chat"
                        params={{ collectionId: collection.id }}
                        aria-label={`Open ${collection.name}`}
                      />
                    }
                  >
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
                <p className="mt-4 border-t border-border pt-3 text-[0.68rem] text-muted-foreground">
                  Updated {formatUpdated(collection.updatedAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create a notebook</DialogTitle>
            <DialogDescription>
              Give one subject a clear boundary. You can add sources next.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="notebook-name">Name</Label>
              <Input
                id="notebook-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Molecular biology"
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notebook-description">Description</Label>
              <Textarea
                id="notebook-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What are you trying to understand?"
              />
            </div>
            {createMutation.isError && (
              <p className="text-sm text-destructive" role="alert">
                The notebook could not be created. Try again.
              </p>
            )}
            <DialogFooter className="mx-0 mb-0 px-0 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating…" : "Create notebook"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Delete this notebook?
            </DialogTitle>
            <DialogDescription>
              {deleteTarget?.name} and its demo sources will be removed for this
              session.
            </DialogDescription>
          </DialogHeader>
          {deleteMutation.isError && (
            <p className="text-sm text-destructive" role="alert">
              The notebook could not be deleted. Try again or keep it.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Keep notebook
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete notebook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
