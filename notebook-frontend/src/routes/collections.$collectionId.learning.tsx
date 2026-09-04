import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Layers3,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { useArtifactsQuery } from "@/features/learning/api/queries"
import { flashCards } from "@/lib/demo-database"
import { getDemoState, retryDemoState } from "@/lib/demo-state"
import { PageState } from "@/components/shared/page-state"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export const Route = createFileRoute("/collections/$collectionId/learning")({
  component: LearningPage,
})

type StudyView = "flashcards" | "mindmap"

function LearningPage() {
  const { collectionId } = Route.useParams()
  const demoState = getDemoState()
  const artifactsQuery = useArtifactsQuery(collectionId)
  const [view, setView] = useState<StudyView>("flashcards")
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [knownCards, setKnownCards] = useState<string[]>([])

  const cards = demoState === "empty" ? [] : flashCards
  const currentCard = cards[cardIndex]

  const moveCard = (direction: -1 | 1) => {
    if (cards.length === 0) return
    setCardIndex(
      (current) => (current + direction + cards.length) % cards.length
    )
    setRevealed(false)
  }

  const markKnown = () => {
    if (!currentCard) return
    setKnownCards((current) =>
      current.includes(currentCard.id) ? current : [...current, currentCard.id]
    )
    moveCard(1)
  }

  if (artifactsQuery.isPending || demoState === "loading") {
    return (
      <main id="main-content" className="p-5 sm:p-8">
        <PageState kind="loading" title="Preparing your study set" />
      </main>
    )
  }

  if (artifactsQuery.isError || demoState === "error") {
    return (
      <main id="main-content" className="p-5 sm:p-8">
        <PageState
          kind="error"
          onRetry={() => retryDemoState(() => artifactsQuery.refetch())}
        />
      </main>
    )
  }

  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"
    >
      <header className="grid gap-7 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Learning studio</p>
          <h2 className="mt-2 text-4xl font-medium">
            Practise the shape of the ideas
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Use recall for individual claims, then step back to inspect the
            relationships between them.
          </p>
        </div>
        <div
          className="flex border border-border bg-card p-1"
          role="group"
          aria-label="Study view"
        >
          <Button
            variant={view === "flashcards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("flashcards")}
            aria-pressed={view === "flashcards"}
          >
            <Layers3 aria-hidden="true" />
            Flashcards
          </Button>
          <Button
            variant={view === "mindmap" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("mindmap")}
            aria-pressed={view === "mindmap"}
          >
            <BrainCircuit aria-hidden="true" />
            Mind map
          </Button>
        </div>
      </header>

      {view === "flashcards" ? (
        cards.length === 0 ? (
          <div className="mt-8">
            <PageState
              kind="empty"
              title="No practice set yet"
              description="Add ready sources, then return here to generate questions."
              action={
                <Button disabled>
                  <Sparkles aria-hidden="true" />
                  Generate cards
                </Button>
              }
            />
          </div>
        ) : (
          <section
            className="mx-auto mt-10 max-w-3xl"
            aria-labelledby="flashcard-heading"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow" id="flashcard-heading">
                  Recall practice
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Card {cardIndex + 1} of {cards.length}
                </p>
              </div>
              <div className="w-32 sm:w-44">
                <p className="mb-2 text-right text-xs text-muted-foreground">
                  {knownCards.length} known
                </p>
                <Progress
                  value={(knownCards.length / cards.length) * 100}
                  aria-label={`${knownCards.length} of ${cards.length} cards known`}
                />
              </div>
            </div>

            <div className="paper-surface relative min-h-[360px] border border-border p-6 sm:min-h-[410px] sm:p-10">
              <div className="absolute top-8 left-0 h-24 w-1 bg-sienna" />
              <p className="eyebrow text-sienna">
                {revealed ? "Answer" : "Prompt"}
              </p>
              <div className="grid min-h-60 place-items-center py-8 text-center sm:min-h-72">
                <p className="reading-copy max-w-2xl text-2xl leading-9 sm:text-3xl sm:leading-[1.35]">
                  {revealed ? currentCard.answer : currentCard.prompt}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{currentCard.sourceLabel}</span>
                <span>
                  {revealed ? "Answer visible" : "Think before revealing"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveCard(-1)}
                aria-label="Previous card"
              >
                <ArrowLeft aria-hidden="true" />
              </Button>
              <div className="flex flex-1 justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRevealed((current) => !current)}
                >
                  {revealed ? "Hide answer" : "Reveal answer"}
                </Button>
                <Button onClick={markKnown} disabled={!revealed}>
                  <Check aria-hidden="true" />I knew this
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveCard(1)}
                aria-label="Next card"
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
            {knownCards.length === cards.length && (
              <div
                className="mt-6 flex items-center justify-between border-l-2 border-teal bg-accent/50 p-4"
                role="status"
              >
                <p className="text-sm">You recalled every card in this set.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setKnownCards([])
                    setCardIndex(0)
                    setRevealed(false)
                  }}
                >
                  <RotateCcw aria-hidden="true" />
                  Restart
                </Button>
              </div>
            )}
          </section>
        )
      ) : (
        <section className="mt-8" aria-labelledby="mindmap-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow" id="mindmap-heading">
                Concept map
              </p>
              <h3 className="mt-2 text-2xl font-medium">Learning mechanisms</h3>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Demo relationship view
            </p>
          </div>
          <div
            className="overflow-x-auto border border-border bg-card p-5 sm:p-10"
            tabIndex={0}
            role="region"
            aria-label="Scrollable learning mechanisms mind map"
          >
            <div className="mx-auto max-w-4xl min-w-[650px]">
              <div className="mx-auto w-56 border-2 border-teal bg-accent px-5 py-4 text-center">
                <p className="eyebrow text-teal">Central idea</p>
                <p className="reading-copy mt-2 text-xl">Durable learning</p>
              </div>
              <div className="mx-auto h-10 w-px bg-border" />
              <div className="mx-auto h-px w-[68%] bg-border" />
              <div className="grid grid-cols-3 gap-8">
                {[
                  ["Retrieval", "Rebuild access", "Feedback repairs gaps"],
                  ["Spacing", "Allow some forgetting", "Increase intervals"],
                  ["Connection", "Compare concepts", "Organise relationships"],
                ].map(([title, first, second]) => (
                  <div key={title} className="text-center">
                    <div className="mx-auto h-8 w-px bg-border" />
                    <div className="border border-border bg-background p-4">
                      <p className="reading-copy text-lg font-semibold">
                        {title}
                      </p>
                    </div>
                    <div className="mx-auto h-5 w-px bg-border" />
                    <div className="space-y-2">
                      <div className="border-l-2 border-sienna bg-muted px-3 py-2 text-xs">
                        {first}
                      </div>
                      <div className="border-l-2 border-sienna bg-muted px-3 py-2 text-xs">
                        {second}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
