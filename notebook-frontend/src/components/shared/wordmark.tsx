import { Link } from "@tanstack/react-router"
import { BookOpenText } from "lucide-react"
import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  compact?: boolean
}

export function Wordmark({ className, compact = false }: WordmarkProps) {
  return (
    <Link
      to="/"
      aria-label="Notebook LLM home"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-[-0.02em] text-foreground",
        className
      )}
    >
      <span className="grid size-8 place-items-center border border-foreground bg-foreground text-background">
        <BookOpenText className="size-4" aria-hidden="true" />
      </span>
      {!compact && <span className="reading-copy text-xl">Notebook LLM</span>}
    </Link>
  )
}
