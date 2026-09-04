import { useMemo, useState, type FormEvent } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Globe2,
  Link2,
  LoaderCircle,
  Plus,
  Send,
  Sparkles,
  Type,
} from "lucide-react"
import { SourceModal } from "@/components/source-modal"
import { PageState } from "@/components/shared/page-state"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  useMessagesQuery,
  useSendQuestionMutation,
} from "@/features/chat/api/queries"
import {
  useAddSourcesMutation,
  useSourcesQuery,
} from "@/features/resources/api/queries"
import { getDemoState, retryDemoState } from "@/lib/demo-state"
import type { ChatMessage, SourceDraft, SourceType } from "@/types/notebook"

export const Route = createFileRoute("/collections/$collectionId/chat")({
  component: ChatPage,
})

const sourceIcon: Record<SourceType, typeof FileText> = {
  pdf: FileText,
  youtube: Link2,
  website: Globe2,
  text: Type,
}

const suggestions = [
  "Compare retrieval and rereading",
  "What should I review first?",
  "Turn the main ideas into questions",
]

function ChatPage() {
  const { collectionId } = Route.useParams()
  const demoState = getDemoState()
  const messagesQuery = useMessagesQuery(collectionId)
  const sourcesQuery = useSourcesQuery(collectionId)
  const sendMutation = useSendQuestionMutation(collectionId)
  const addSourcesMutation = useAddSourcesMutation(collectionId)
  const [question, setQuestion] = useState("")
  const [sourceModalOpen, setSourceModalOpen] = useState(false)

  const messages = useMemo(() => {
    if (demoState === "empty") return []
    const base = messagesQuery.data ?? []
    if (demoState !== "long") return base
    const longMessage: ChatMessage = {
      id: "long-demo",
      collectionId,
      role: "assistant",
      createdAt: new Date().toISOString(),
      content:
        "Across these materials, durable learning is described as an active reconstruction process rather than passive exposure. Retrieval practice makes learners rebuild access to an idea; spacing introduces enough delay to make that reconstruction effortful; and comparison helps distinguish closely related concepts. The immediate experience may be slower and less fluent, yet the later result can be more stable because the learner has practised the act they will eventually need: producing the idea without the source directly in view. A useful study plan would therefore alternate brief reading with closed-book recall, revisit the same concepts after increasing intervals, and use feedback to repair gaps rather than simply repeat correct material.",
      citations: ["The testing effect", "How memory becomes durable"],
    }
    return [...base, longMessage]
  }, [collectionId, demoState, messagesQuery.data])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = question.trim()
    if (!value || sendMutation.isPending) return
    setQuestion("")
    try {
      await sendMutation.mutateAsync(value)
    } catch {
      setQuestion(value)
    }
  }

  const handleSourceAdded = (drafts: SourceDraft[]) => {
    addSourcesMutation.mutate(drafts)
  }

  const isLoading =
    messagesQuery.isPending || sourcesQuery.isPending || demoState === "loading"
  const isError =
    messagesQuery.isError || sourcesQuery.isError || demoState === "error"

  if (isLoading) {
    return (
      <main id="main-content" className="p-5 sm:p-8">
        <PageState kind="loading" title="Preparing your conversation" />
      </main>
    )
  }

  if (isError) {
    return (
      <main id="main-content" className="p-5 sm:p-8">
        <PageState
          kind="error"
          onRetry={() => {
            retryDemoState(() => {
              messagesQuery.refetch()
              sourcesQuery.refetch()
            })
          }}
        />
      </main>
    )
  }

  const readySources = (sourcesQuery.data ?? []).filter(
    (source) => source.status === "ready"
  )

  return (
    <main id="main-content" className="min-h-[calc(100svh-4rem)] lg:min-h-svh">
      <div className="mx-auto grid max-w-[1500px] xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex min-h-[calc(100svh-4rem)] min-w-0 flex-col lg:min-h-svh">
          <header className="border-b border-border px-5 py-5 sm:px-8">
            <div className="mx-auto flex max-w-3xl items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Ask your notebook</p>
                <h2 className="mt-1 text-3xl font-medium">
                  A conversation with the material
                </h2>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {readySources.length} ready sources
              </p>
            </div>
          </header>

          <div className="flex-1 px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-3xl space-y-7">
              {messages.length === 0 ? (
                <div className="border border-dashed border-border bg-card/60 px-5 py-14 text-center">
                  <Sparkles
                    className="mx-auto size-6 text-sienna"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-3xl font-medium">
                    What are you trying to understand?
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                    Ask a specific question, request a comparison, or turn your
                    sources into a short study plan.
                  </p>
                  <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[88%] border-r-2 border-sienna bg-muted px-4 py-3 sm:max-w-[75%]"
                        : "max-w-2xl"
                    }
                  >
                    <p
                      className={`eyebrow ${message.role === "assistant" ? "text-teal" : "text-sienna"}`}
                    >
                      {message.role === "assistant" ? "Notebook LLM" : "You"}
                    </p>
                    <p
                      dir="auto"
                      className={
                        message.role === "assistant"
                          ? "reading-copy mt-3 text-lg leading-8 [overflow-wrap:anywhere]"
                          : "mt-2 text-sm leading-6 [overflow-wrap:anywhere]"
                      }
                    >
                      {message.content}
                    </p>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-5 border-l-2 border-teal bg-accent/45 px-4 py-3">
                        <p className="eyebrow">Demo source references</p>
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {message.citations.map((citation) => (
                            <li
                              key={citation}
                              className="flex items-center gap-2"
                            >
                              <BookOpenCheck
                                className="size-3.5 text-teal"
                                aria-hidden="true"
                              />
                              {citation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))
              )}

              {sendMutation.isPending && (
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  role="status"
                >
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Reading across your sources…
                </div>
              )}
              {sendMutation.isError && (
                <p className="text-sm text-destructive" role="alert">
                  The question was not sent. It is back in the composer so you
                  can try again.
                </p>
              )}
            </div>
          </div>

          <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] border-t border-border bg-background/95 px-5 py-4 backdrop-blur-sm sm:px-8 lg:bottom-0">
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
              <label htmlFor="question" className="sr-only">
                Ask a question about your sources
              </label>
              <div className="flex items-end gap-2 border border-input bg-card p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
                <Textarea
                  id="question"
                  className="max-h-40 min-h-12 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      event.preventDefault()
                      event.currentTarget.form?.requestSubmit()
                    }
                  }}
                  placeholder={
                    readySources.length > 0
                      ? "Ask about an idea in these sources…"
                      : "Add a source before asking a grounded question"
                  }
                  disabled={readySources.length === 0 || sendMutation.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    !question.trim() ||
                    readySources.length === 0 ||
                    sendMutation.isPending
                  }
                  aria-label="Send question"
                >
                  <Send aria-hidden="true" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Demo answers are generated locally and are not verified AI
                retrieval. Press Ctrl/⌘ + Enter to send.
              </p>
            </form>
          </div>
        </section>

        <aside className="hidden border-l border-border bg-card/45 p-5 xl:block">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">In this answer</p>
              <h2 className="mt-1 text-xl font-medium">Sources</h2>
            </div>
            <Button
              size="icon-sm"
              onClick={() => setSourceModalOpen(true)}
              aria-label="Add source"
            >
              <Plus aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            {(sourcesQuery.data ?? []).slice(0, 6).map((source) => {
              const Icon = sourceIcon[source.type]
              return (
                <div
                  key={source.id}
                  className="border border-border bg-background p-3"
                >
                  <div className="flex gap-3">
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold" dir="auto">
                        {source.name}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                        {source.status === "ready" ? (
                          <CheckCircle2
                            className="size-3 text-teal"
                            aria-hidden="true"
                          />
                        ) : (
                          <LoaderCircle
                            className="size-3 animate-spin"
                            aria-hidden="true"
                          />
                        )}
                        {source.status}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Button
            className="mt-4 w-full"
            variant="outline"
            render={
              <Link
                to="/collections/$collectionId/resources"
                params={{ collectionId }}
              />
            }
          >
            Manage all sources
          </Button>
        </aside>
      </div>

      <SourceModal
        open={sourceModalOpen}
        setOpen={setSourceModalOpen}
        onSourceAdded={handleSourceAdded}
      />
    </main>
  )
}
