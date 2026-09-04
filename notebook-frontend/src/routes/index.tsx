import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BookMarked,
  Check,
  FileText,
  Highlighter,
  MessageSquareText,
  Sparkles,
} from "lucide-react"
import { PublicHeader } from "@/components/shared/public-header"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

const steps = [
  {
    number: "01",
    title: "Bring the material",
    copy: "Add PDFs, lectures, articles, or rough notes to one focused notebook.",
  },
  {
    number: "02",
    title: "Ask for understanding",
    copy: "Question your sources and keep the answer tied to the material you chose.",
  },
  {
    number: "03",
    title: "Turn insight into recall",
    copy: "Save durable notes, reveal flashcards, and connect ideas before they fade.",
  },
]

function LandingPage() {
  return (
    <div className="min-h-svh">
      <PublicHeader />
      <main id="main-content">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-32">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-12 bg-sienna" />
              <p className="eyebrow text-sienna">A quieter way to study</p>
            </div>
            <h1 className="max-w-3xl text-5xl leading-[0.96] font-medium tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
              Read deeply. Remember what matters.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Notebook LLM turns your own sources into a focused study desk—one
              place to ask, preserve, and practise the ideas you want to keep.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link to="/login" />}>
                Start a notebook
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/login" />}>
                Sign in
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="size-3.5 text-teal" aria-hidden="true" />
              Local demo · no account required
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="absolute top-8 -left-5 hidden h-[82%] w-px bg-sienna lg:block" />
            <p className="absolute top-8 -left-10 hidden origin-top-left -rotate-90 text-[0.62rem] font-semibold tracking-[0.2em] text-sienna uppercase lg:block">
              Study desk · 08:42
            </p>
            <div className="paper-surface border border-border">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <p className="eyebrow">Cognitive science</p>
                  <p className="mt-1 text-sm font-semibold">
                    4 sources in view
                  </p>
                </div>
                <Sparkles className="size-4 text-sienna" aria-hidden="true" />
              </div>
              <div className="grid sm:grid-cols-[124px_1fr]">
                <div className="hidden border-r border-border bg-muted/45 p-3 sm:block">
                  {[MessageSquareText, BookMarked, FileText].map(
                    (Icon, index) => (
                      <div
                        key={index}
                        className={`mb-2 flex items-center gap-2 border-l-2 px-2 py-2 text-xs ${index === 0 ? "border-primary bg-accent text-foreground" : "border-transparent text-muted-foreground"}`}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {index === 0
                          ? "Ask"
                          : index === 1
                            ? "Memory"
                            : "Sources"}
                      </div>
                    )
                  )}
                </div>
                <div className="p-5 sm:p-7">
                  <p className="eyebrow">Question</p>
                  <p className="reading-copy mt-2 text-lg leading-7">
                    Why can difficult practice produce stronger learning?
                  </p>
                  <div className="my-5 h-px bg-border" />
                  <p className="eyebrow text-teal">Answer from your sources</p>
                  <p className="reading-copy mt-3 text-[1.05rem] leading-7 text-foreground/90">
                    Practice that requires retrieval can strengthen the path
                    back to an idea. The effort feels less fluent, but it makes
                    later recall more durable.
                  </p>
                  <div className="mt-5 flex items-center gap-2 border-l-2 border-sienna bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    <Highlighter
                      className="size-3.5 text-sienna"
                      aria-hidden="true"
                    />
                    The testing effect · lecture note 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/70">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="eyebrow">The method</p>
                <h2 className="mt-3 max-w-sm text-4xl leading-tight font-medium">
                  From source to working knowledge.
                </h2>
              </div>
              <div className="grid border-t border-border sm:grid-cols-3 lg:border-t-0">
                {steps.map((step) => (
                  <article
                    key={step.number}
                    className="border-b border-border py-6 sm:border-b-0 sm:border-l sm:px-6 sm:py-1"
                  >
                    <p className="text-xs font-semibold tracking-[0.16em] text-sienna">
                      {step.number}
                    </p>
                    <h3 className="mt-8 text-xl font-medium">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {step.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-8 border-l-2 border-teal pl-6 sm:pl-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Open your desk</p>
              <h2 className="mt-3 max-w-2xl text-4xl leading-tight font-medium sm:text-5xl">
                Give your reading somewhere to become useful.
              </h2>
            </div>
            <Button size="lg" render={<Link to="/collections" />}>
              Explore the demo
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        Notebook LLM · A local product demonstration
      </footer>
    </div>
  )
}
