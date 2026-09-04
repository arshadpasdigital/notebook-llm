import { useMemo, useState, type FormEvent } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { BookmarkPlus, BookOpen, Plus, Search, Trash2 } from "lucide-react"
import {
  useCreateMemoryMutation,
  useMemoriesQuery,
  useRemoveMemoryMutation,
} from "@/features/memory/api/queries"
import { getDemoState, retryDemoState } from "@/lib/demo-state"
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

export const Route = createFileRoute("/collections/$collectionId/memory")({
  component: MemoryPage,
})

function MemoryPage() {
  const { collectionId } = Route.useParams()
  const demoState = getDemoState()
  const memoriesQuery = useMemoriesQuery(collectionId)
  const createMutation = useCreateMemoryMutation(collectionId)
  const removeMutation = useRemoveMemoryMutation(collectionId)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const memories = useMemo(() => {
    if (demoState === "empty") return []
    const query = search.trim().toLowerCase()
    const base = memoriesQuery.data ?? []
    if (!query) return base
    return base.filter(
      (memory) =>
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query) ||
        memory.sourceLabel?.toLowerCase().includes(query)
    )
  }, [demoState, memoriesQuery.data, search])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !content.trim()) return
    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      })
      setTitle("")
      setContent("")
      setCreateOpen(false)
    } catch {
      // Keep the draft visible so the user can retry.
    }
  }

  const handleRemove = (memoryId: string) => {
    if (window.confirm("Delete this saved memory? This cannot be undone.")) {
      removeMutation.mutate(memoryId)
    }
  }

  const showLoading = memoriesQuery.isPending || demoState === "loading"
  const showError = memoriesQuery.isError || demoState === "error"

  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"
    >
      <header className="grid gap-6 border-b border-border pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow">Memory shelf</p>
          <h2 className="mt-2 text-4xl font-medium">
            Ideas worth returning to
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Keep concise claims in your own words. Each memory should be useful
            after the original source has left the screen.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <BookmarkPlus aria-hidden="true" />
          Save a memory
        </Button>
      </header>

      <div className="my-7 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search memories"
            aria-label="Search memories"
          />
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {memories.length} saved
        </p>
      </div>

      {showLoading ? (
        <ListSkeleton rows={3} />
      ) : showError ? (
        <PageState
          kind="error"
          onRetry={() => retryDemoState(() => memoriesQuery.refetch())}
        />
      ) : memories.length === 0 ? (
        <PageState
          kind="empty"
          title={search ? "No memories match" : "Your memory shelf is open"}
          description={
            search
              ? "Try another search term."
              : "Save the first idea you want to retrieve without reopening the source."
          }
          action={
            !search ? (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus aria-hidden="true" />
                Save a memory
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {memories.map((memory, index) => (
            <article
              key={memory.id}
              className="mb-4 break-inside-avoid border border-border bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-foreground/35 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="eyebrow text-sienna">
                  Memory {String(index + 1).padStart(2, "0")}
                </p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(memory.id)}
                  disabled={removeMutation.isPending}
                  aria-label={`Delete ${memory.title}`}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <h3
                className="mt-5 text-2xl leading-tight font-medium [overflow-wrap:anywhere]"
                dir="auto"
              >
                {memory.title}
              </h3>
              <p
                className="reading-copy mt-4 text-base leading-7 [overflow-wrap:anywhere] text-foreground/85"
                dir="auto"
              >
                {demoState === "long"
                  ? `${memory.content} This saved explanation is intentionally extended to verify that longer notes preserve a readable measure, stable card layout, and usable actions across responsive widths.`
                  : memory.content}
              </p>
              {memory.sourceLabel && (
                <p className="mt-6 flex items-start gap-2 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                  <BookOpen
                    className="mt-0.5 size-3.5 shrink-0 text-teal"
                    aria-hidden="true"
                  />
                  {memory.sourceLabel}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Save a memory</DialogTitle>
            <DialogDescription>
              Write one durable idea in language you will recognise later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="memory-title">Short title</Label>
              <Input
                id="memory-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Retrieval strengthens access"
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memory-content">Explanation</Label>
              <Textarea
                id="memory-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Explain the idea in your own words…"
                className="min-h-32"
                required
              />
            </div>
            {createMutation.isError && (
              <p className="text-sm text-destructive" role="alert">
                This memory could not be saved. Try again.
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
                disabled={
                  !title.trim() || !content.trim() || createMutation.isPending
                }
              >
                {createMutation.isPending ? "Saving…" : "Save memory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
