export type SourceType = "pdf" | "youtube" | "text" | "website"

export type SourceStatus = "ready" | "processing" | "failed"

export interface Source {
  id: string
  collectionId: string
  type: SourceType
  name: string
  detail?: string
  content?: string
  status: SourceStatus
  addedAt: string
}

export type SourceDraft = Pick<Source, "type" | "name" | "detail" | "content">

export interface NotebookCollection {
  id: string
  name: string
  description: string
  updatedAt: string
  sourceCount: number
  memoryCount: number
  accent: "teal" | "sienna" | "ink"
}

export interface MemoryEntry {
  id: string
  collectionId: string
  title: string
  content: string
  sourceLabel?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  collectionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  citations?: string[]
}

export interface StudyArtifact {
  id: string
  collectionId: string
  type: "flashcards" | "mindmap"
  title: string
  status: "ready" | "generating" | "failed"
  updatedAt: string
}

export interface FlashCard {
  id: string
  prompt: string
  answer: string
  sourceLabel: string
}
