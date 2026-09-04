import { useState } from "react"
import { SendIcon } from "lucide-react"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Button } from "@/components/ui/button"
import type { Source } from "./types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatPageProps {
  sources: Source[]
}

function ChatPage({ sources }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isResponding, setIsResponding] = useState(false)

  const hasSources = sources.length > 0

  const handleSend = () => {
    const question = input.trim()
    if (!question || isResponding) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((previousMessages) => [...previousMessages, userMessage])
    setInput("")
    setIsResponding(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I’ll use ${sources.length} source${sources.length === 1 ? "" : "s"} in this notebook to answer “${question}”. Connect the retrieval service to replace this demo response with grounded source analysis.`,
        timestamp: new Date(),
      }
      setMessages((previousMessages) => [...previousMessages, assistantMessage])
      setIsResponding(false)
    }, 1000)
  }

  if (!hasSources) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyTitle>No sources added</EmptyTitle>
            <EmptyDescription>
              Add a source from the sidebar to start asking questions about your
              material.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <Marker variant="separator">
          <MarkerIcon>
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </MarkerIcon>
          <MarkerContent className="min-w-0 truncate">
            Chatting with {sources.length} source
            {sources.length === 1 ? "" : "s"}:{" "}
            {sources.map((source) => source.name).join(", ")}
          </MarkerContent>
        </Marker>
      </div>

      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {messages.length === 0 ? (
                <MessageScrollerItem>
                  <Empty className="min-h-48 border-0">
                    <EmptyHeader>
                      <EmptyTitle>Your notebook is ready</EmptyTitle>
                      <EmptyDescription>
                        Ask a question and use your {sources.length} source
                        {sources.length === 1 ? "" : "s"} as context.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </MessageScrollerItem>
              ) : (
                messages.map((message) => (
                  <MessageScrollerItem key={message.id}>
                    <BubbleGroup>
                      <Bubble
                        variant={
                          message.role === "user" ? "default" : "outline"
                        }
                        align={message.role === "user" ? "end" : "start"}
                      >
                        <BubbleContent>{message.content}</BubbleContent>
                      </Bubble>
                    </BubbleGroup>
                  </MessageScrollerItem>
                ))
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      <form
        className="border-t p-4"
        onSubmit={(event) => {
          event.preventDefault()
          handleSend()
        }}
      >
        <div className="flex gap-2">
          <Input
            aria-label="Ask a question about your sources"
            placeholder="Ask a question about your sources..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isResponding}
            aria-label={isResponding ? "Generating answer" : "Send question"}
          >
            <SendIcon className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatPage
