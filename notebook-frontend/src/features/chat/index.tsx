// @purpose: it is the body of the chat where if we don't upload any file then it show noting if we upload the any source then show the chat body and used the shadcn components like 'Bubble', 'Marker' and the 'Message Scroller' 
// @Goal:  it is the component when we upload the source then we show the chat and used to chat based on the source uploaded

import { useState } from "react"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { SendIcon } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Source {
  id: string
  type: "youtube" | "pdf" | "vvt" | "text"
  name: string
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I've analyzed your uploaded sources. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  
  // Demo sources - in production, this would come from app state/context
  const [sources] = useState<Source[]>([
    { id: "1", type: "pdf", name: "document.pdf" },
    { id: "2", type: "youtube", name: "YouTube Video" },
  ])

  const hasSources = sources.length > 0

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm processing your request based on your uploaded sources...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  if (!hasSources) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyTitle>No Sources Added</EmptyTitle>
            <EmptyDescription>Add sources from the sidebar to start chatting</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sources indicator */}
      <div className="border-b px-4 py-3">
        <Marker variant="separator">
          <MarkerIcon>
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </MarkerIcon>
          <MarkerContent>
            Chatting with {sources.length} source{sources.length > 1 ? "s" : ""}: {sources.map(s => s.name).join(", ")}
          </MarkerContent>
        </Marker>
      </div>

      {/* Messages */}
      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {messages.map((message) => (
                <MessageScrollerItem key={message.id}>
                  <BubbleGroup>
                    <Bubble
                      variant={message.role === "user" ? "default" : "outline"}
                      align={message.role === "user" ? "end" : "start"}
                    >
                      <BubbleContent>{message.content}</BubbleContent>
                    </Bubble>
                  </BubbleGroup>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your sources..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <SendIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage