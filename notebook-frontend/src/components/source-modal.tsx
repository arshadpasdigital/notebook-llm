import { useRef, useState, type ChangeEvent } from "react"
import { ArrowLeft, FileText, Globe2, Link2, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SourceDraft } from "@/features/chat/types"

interface SourceModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSourceAdded: (sources: SourceDraft[]) => void
}

type SourceView = "main" | "youtube" | "website" | "copiedText"

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function SourceModal({
  open,
  setOpen,
  onSourceAdded,
}: SourceModalProps) {
  const [view, setView] = useState<SourceView>("main")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [copiedText, setCopiedText] = useState("")
  const [error, setError] = useState("")
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const youtubeInputRef = useRef<HTMLInputElement>(null)
  const websiteInputRef = useRef<HTMLInputElement>(null)
  const copiedTextRef = useRef<HTMLTextAreaElement>(null)

  const handleClose = () => {
    setOpen(false)
    setView("main")
    setYoutubeUrl("")
    setWebsiteUrl("")
    setCopiedText("")
    setError("")
  }

  const addSources = (sources: SourceDraft[]) => {
    onSourceAdded(sources)
    handleClose()
  }

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    )

    if (files.length === 0) {
      setError("Choose at least one PDF file to add.")
      return
    }

    addSources(
      files.map((file) => ({
        type: "pdf",
        name: file.name,
        detail: `${Math.max(1, Math.round(file.size / 1024))} KB PDF`,
      }))
    )
  }

  const handleYouTubeSubmit = () => {
    const value = youtubeUrl.trim()
    if (!isHttpUrl(value) || !/youtube\.com|youtu\.be/i.test(value)) {
      setError("Enter a valid YouTube URL.")
      requestAnimationFrame(() => youtubeInputRef.current?.focus())
      return
    }

    addSources([
      {
        type: "youtube",
        name: "YouTube video",
        detail: value,
      },
    ])
  }

  const handleWebsiteSubmit = () => {
    const value = websiteUrl.trim()
    if (!isHttpUrl(value)) {
      setError("Enter a valid website URL starting with http:// or https://.")
      requestAnimationFrame(() => websiteInputRef.current?.focus())
      return
    }

    addSources([
      {
        type: "website",
        name: new URL(value).hostname,
        detail: value,
      },
    ])
  }

  const handleTextSubmit = () => {
    const value = copiedText.trim()
    if (!value) {
      setError("Paste or type some text before adding it.")
      requestAnimationFrame(() => copiedTextRef.current?.focus())
      return
    }

    addSources([
      {
        type: "text",
        name: "Pasted text",
        detail: `${value.length.toLocaleString()} characters`,
        content: value,
      },
    ])
  }

  const setSourceView = (nextView: SourceView) => {
    setError("")
    setView(nextView)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {view === "main" && "Add source"}
            {view === "youtube" && "Add YouTube video"}
            {view === "website" && "Add website"}
            {view === "copiedText" && "Add copied text"}
          </DialogTitle>
          <DialogDescription>
            {view === "main"
              ? "Choose the material this notebook should use."
              : "The source will begin processing as soon as you add it."}
          </DialogDescription>
        </DialogHeader>

        {view === "main" && (
          <div className="space-y-3 py-4">
            <button
              type="button"
              onClick={() => setSourceView("youtube")}
              className="flex w-full items-center gap-3 rounded-sm border p-4 text-left transition-[background-color,border-color] duration-150 hover:border-foreground/30 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
            >
              <Link2
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">YouTube video</p>
                <p className="text-sm text-muted-foreground">
                  Add a YouTube video URL
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-sm border p-4 text-left transition-[background-color,border-color] duration-150 hover:border-foreground/30 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
            >
              <FileText
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">PDF files</p>
                <p className="text-sm text-muted-foreground">
                  Upload one or more PDF files
                </p>
              </div>
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handlePdfChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setSourceView("website")}
              className="flex w-full items-center gap-3 rounded-sm border p-4 text-left transition-[background-color,border-color] duration-150 hover:border-foreground/30 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
            >
              <Globe2
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">Website</p>
                <p className="text-sm text-muted-foreground">
                  Add a public website URL
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSourceView("copiedText")}
              className="flex w-full items-center gap-3 rounded-sm border p-4 text-left transition-[background-color,border-color] duration-150 hover:border-foreground/30 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none"
            >
              <Type
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">Copied text</p>
                <p className="text-sm text-muted-foreground">
                  Paste or type copied text
                </p>
              </div>
            </button>
            {error && (
              <p
                id="source-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}

        {view === "youtube" && (
          <form
            className="space-y-4 py-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleYouTubeSubmit()
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setSourceView("main")}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                ref={youtubeInputRef}
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "source-error" : undefined}
                onChange={(event) => {
                  setError("")
                  setYoutubeUrl(event.target.value)
                }}
              />
            </div>
            {error && (
              <p
                id="source-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button className="w-full" type="submit">
              Add video
            </Button>
          </form>
        )}

        {view === "website" && (
          <form
            className="space-y-4 py-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleWebsiteSubmit()
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setSourceView("main")}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                ref={websiteInputRef}
                id="website-url"
                placeholder="https://example.com/article"
                value={websiteUrl}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "source-error" : undefined}
                onChange={(event) => {
                  setError("")
                  setWebsiteUrl(event.target.value)
                }}
              />
            </div>
            {error && (
              <p
                id="source-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button className="w-full" type="submit">
              Add website
            </Button>
          </form>
        )}

        {view === "copiedText" && (
          <form
            className="space-y-4 py-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleTextSubmit()
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setSourceView("main")}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
            <div className="space-y-2">
              <Label htmlFor="copied-text">Text content</Label>
              <Textarea
                ref={copiedTextRef}
                id="copied-text"
                placeholder="Paste your text here..."
                value={copiedText}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "source-error" : undefined}
                onChange={(event) => {
                  setError("")
                  setCopiedText(event.target.value)
                }}
                rows={6}
              />
            </div>
            {error && (
              <p
                id="source-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button className="w-full" type="submit">
              Add text
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
