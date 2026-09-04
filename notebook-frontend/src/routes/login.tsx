import { useState } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { AlertCircle, ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react"
import { Wordmark } from "@/components/shared/wordmark"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { getDemoState } from "@/lib/demo-state"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

type LoginStatus = "idle" | "loading" | "error"

function LoginPage() {
  const navigate = useNavigate()
  const demoState = getDemoState()
  const [status, setStatus] = useState<LoginStatus>("idle")

  const handleLogin = () => {
    setStatus("loading")
    window.setTimeout(() => {
      if (demoState === "error") {
        setStatus("error")
        return
      }
      navigate({ to: "/collections" })
    }, 650)
  }

  const handleRetry = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("demo")
    window.history.replaceState({}, "", url)
    setStatus("idle")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <aside className="hidden border-r border-border bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
        <Wordmark className="text-primary-foreground" />
        <blockquote className="mt-auto max-w-lg text-4xl leading-tight">
          “The notes worth keeping are the ones you can return to and think
          with.”
        </blockquote>
        <p className="mt-6 text-xs tracking-[0.18em] text-primary-foreground/70 uppercase">
          Notebook LLM study desk
        </p>
      </aside>

      <main id="main-content" className="flex min-h-svh flex-col bg-background">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 lg:justify-end">
          <Wordmark className="lg:hidden" />
          <ThemeToggle />
        </header>
        <div className="grid flex-1 place-items-center px-5 py-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back home
            </Link>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-3 text-4xl font-medium">
              Return to your notebooks.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in with Google to open the subjects and sources you study
              with.
            </p>

            <div className="mt-8 space-y-4">
              {status === "error" && (
                <div
                  className="border-l-2 border-destructive bg-destructive/8 p-4"
                  role="alert"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    Sign-in did not complete
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    The demo session could not be opened. Reset it and try once
                    more.
                  </p>
                  <Button
                    className="mt-3"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                  >
                    Reset demo sign-in
                  </Button>
                </div>
              )}

              <Button
                className="w-full justify-between"
                size="lg"
                onClick={handleLogin}
                disabled={status === "loading" || status === "error"}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid size-6 place-items-center border border-primary-foreground/40 text-xs font-bold"
                    aria-hidden="true"
                  >
                    G
                  </span>
                  {status === "loading"
                    ? "Opening demo session…"
                    : "Continue with Google"}
                </span>
                {status === "idle" && <ArrowRight aria-hidden="true" />}
              </Button>
              <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <LockKeyhole
                  className="mt-0.5 size-3.5 shrink-0"
                  aria-hidden="true"
                />
                This frontend uses a local demo session. No Google account is
                contacted.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
