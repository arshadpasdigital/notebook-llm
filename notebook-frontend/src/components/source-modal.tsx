// @Goal: this Modal is open when we click the source button in app-sidebar.tsx file and it has the youtube video, file uploads for pdf where we upload multiple files, upload file for vvt files, copied text. and when we click the youtube video then another model open which has the back button with youtube input url similar for copied text.

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SourceModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

type SourceView = "main" | "youtube" | "copiedText"

export function SourceModal({ open, setOpen }: SourceModalProps) {
  const [view, setView] = useState<SourceView>("main")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [copiedText, setCopiedText] = useState("")
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [vvtFile, setVvtFile] = useState<File | null>(null)

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const vvtInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setOpen(false)
    setView("main")
    setYoutubeUrl("")
    setCopiedText("")
    setPdfFiles([])
    setVvtFile(null)
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files))
    }
  }

  const handleVvtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVvtFile(e.target.files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {view === "main" && "Add Source"}
            {view === "youtube" && "Add YouTube Video"}
            {view === "copiedText" && "Add Copied Text"}
          </DialogTitle>
        </DialogHeader>

        {view === "main" && (
          <div className="space-y-4 py-4">
            {/* YouTube Video */}
            <button
              onClick={() => setView("youtube")}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">YouTube Video</p>
                <p className="text-sm text-muted-foreground">Add a YouTube video URL</p>
              </div>
            </button>

            {/* PDF Files Upload */}
            <div className="space-y-2">
              <button
                onClick={() => pdfInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">PDF Files</p>
                  <p className="text-sm text-muted-foreground">
                    {pdfFiles.length > 0 ? `${pdfFiles.length} file(s) selected` : "Upload multiple PDF files"}
                  </p>
                </div>
              </button>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePdfChange}
                className="hidden"
              />
              {pdfFiles.length > 0 && (
                <div className="text-sm text-muted-foreground pl-13">
                  {pdfFiles.map((file) => (
                    <span key={file.name} className="mr-2">• {file.name}</span>
                  ))}
                </div>
              )}
            </div>

            {/* VVT File Upload */}
            <div className="space-y-2">
              <button
                onClick={() => vvtInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">VVT File</p>
                  <p className="text-sm text-muted-foreground">
                    {vvtFile ? vvtFile.name : "Upload a VVT file"}
                  </p>
                </div>
              </button>
              <input
                ref={vvtInputRef}
                type="file"
                accept=".vvt"
                onChange={handleVvtChange}
                className="hidden"
              />
            </div>

            {/* Copied Text */}
            <button
              onClick={() => setView("copiedText")}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Copied Text</p>
                <p className="text-sm text-muted-foreground">Paste or type copied text</p>
              </div>
            </button>
          </div>
        )}

        {view === "youtube" && (
          <div className="space-y-4 py-4">
            <Button variant="outline" onClick={() => setView("main")}>
              ← Back
            </Button>
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={() => {
              if (youtubeUrl) {
                // Handle adding YouTube source
                console.log("Adding YouTube:", youtubeUrl)
                handleClose()
              }
            }}>
              Add Video
            </Button>
          </div>
        )}

        {view === "copiedText" && (
          <div className="space-y-4 py-4">
            <Button variant="outline" onClick={() => setView("main")}>
              ← Back
            </Button>
            <div className="space-y-2">
              <Label htmlFor="copied-text">Text Content</Label>
              <Textarea
                id="copied-text"
                placeholder="Paste your text here..."
                value={copiedText}
                onChange={(e) => setCopiedText(e.target.value)}
                rows={6}
              />
            </div>
            <Button className="w-full" onClick={() => {
              if (copiedText) {
                // Handle adding copied text source
                console.log("Adding copied text:", copiedText)
                handleClose()
              }
            }}>
              Add Text
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}