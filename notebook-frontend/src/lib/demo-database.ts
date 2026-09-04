import type {
  ChatMessage,
  FlashCard,
  MemoryEntry,
  NotebookCollection,
  Source,
  SourceDraft,
  StudyArtifact,
} from "@/types/notebook"

const now = new Date("2026-08-26T09:30:00.000Z")

const isoMinutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60_000).toISOString()

let collections: NotebookCollection[] = [
  {
    id: "demo",
    name: "Cognitive science",
    description: "Attention, memory, learning, and decision-making",
    updatedAt: isoMinutesAgo(18),
    sourceCount: 4,
    memoryCount: 3,
    accent: "teal",
  },
  {
    id: "design-history",
    name: "Design history",
    description: "Modernism, information design, and visual culture",
    updatedAt: isoMinutesAgo(1_480),
    sourceCount: 2,
    memoryCount: 1,
    accent: "sienna",
  },
]

let sources: Source[] = [
  {
    id: "source-attention",
    collectionId: "demo",
    type: "pdf",
    name: "Attention and effort — lecture notes.pdf",
    detail: "32 pages · 2.4 MB",
    status: "ready",
    addedAt: isoMinutesAgo(720),
  },
  {
    id: "source-memory",
    collectionId: "demo",
    type: "youtube",
    name: "How memory becomes durable",
    detail: "48 min lecture",
    status: "ready",
    addedAt: isoMinutesAgo(640),
  },
  {
    id: "source-testing",
    collectionId: "demo",
    type: "website",
    name: "The testing effect",
    detail: "journal.example.edu/testing-effect",
    status: "ready",
    addedAt: isoMinutesAgo(530),
  },
  {
    id: "source-working-memory",
    collectionId: "demo",
    type: "text",
    name: "Working-memory seminar notes",
    detail: "1,842 characters",
    status: "processing",
    addedAt: isoMinutesAgo(8),
  },
  {
    id: "source-bauhaus",
    collectionId: "design-history",
    type: "pdf",
    name: "Bauhaus reader.pdf",
    detail: "71 pages · 6.8 MB",
    status: "ready",
    addedAt: isoMinutesAgo(2_100),
  },
  {
    id: "source-swiss",
    collectionId: "design-history",
    type: "website",
    name: "Swiss design archive",
    detail: "archive.example.org/swiss-design",
    status: "failed",
    addedAt: isoMinutesAgo(1_900),
  },
]

let memories: MemoryEntry[] = [
  {
    id: "memory-retrieval",
    collectionId: "demo",
    title: "Retrieval strengthens access",
    content:
      "Recalling an idea changes the ease with which it can be recalled again; practice should require retrieval, not recognition alone.",
    sourceLabel: "The testing effect",
    createdAt: isoMinutesAgo(450),
    updatedAt: isoMinutesAgo(450),
  },
  {
    id: "memory-load",
    collectionId: "demo",
    title: "Working memory is a bottleneck",
    content:
      "Learning materials should manage intrinsic load and reduce avoidable demands on working memory.",
    sourceLabel: "Attention and effort — lecture notes.pdf",
    createdAt: isoMinutesAgo(320),
    updatedAt: isoMinutesAgo(310),
  },
  {
    id: "memory-spacing",
    collectionId: "demo",
    title: "Spacing changes what feels fluent",
    content:
      "A little difficulty between sessions can improve durable learning even when massed practice feels easier in the moment.",
    sourceLabel: "How memory becomes durable",
    createdAt: isoMinutesAgo(240),
    updatedAt: isoMinutesAgo(240),
  },
]

let messages: ChatMessage[] = [
  {
    id: "message-welcome",
    collectionId: "demo",
    role: "assistant",
    content:
      "Your sources distinguish between what feels easy to process and what becomes durable knowledge. Ask about a concept, compare two sources, or turn an idea into a study question.",
    createdAt: isoMinutesAgo(22),
    citations: [
      "Attention and effort — lecture notes.pdf",
      "The testing effect",
    ],
  },
]

const artifacts: StudyArtifact[] = [
  {
    id: "artifact-flashcards",
    collectionId: "demo",
    type: "flashcards",
    title: "Memory and retrieval — 8 cards",
    status: "ready",
    updatedAt: isoMinutesAgo(190),
  },
  {
    id: "artifact-mindmap",
    collectionId: "demo",
    type: "mindmap",
    title: "Learning mechanisms map",
    status: "ready",
    updatedAt: isoMinutesAgo(180),
  },
]

export const flashCards: FlashCard[] = [
  {
    id: "card-retrieval",
    prompt: "Why can retrieval practice outperform rereading?",
    answer:
      "Retrieval requires reconstructing access to an idea. That effort strengthens later access, while rereading can produce familiarity without recall.",
    sourceLabel: "The testing effect",
  },
  {
    id: "card-load",
    prompt: "What is the practical consequence of limited working memory?",
    answer:
      "Instruction should reduce avoidable processing, group related information, and avoid asking learners to hold too many new elements at once.",
    sourceLabel: "Attention and effort — lecture notes.pdf",
  },
  {
    id: "card-spacing",
    prompt: "Why can spaced practice feel worse while working better?",
    answer:
      "Spacing allows some forgetting, so retrieval feels harder. That difficulty can strengthen memory more than fluent massed practice.",
    sourceLabel: "How memory becomes durable",
  },
]

const pause = (duration = 380) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

const makeId = (prefix: string) =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`

export async function listCollections() {
  await pause()
  return collections.map((collection) => ({ ...collection }))
}

export async function getCollection(collectionId: string) {
  await pause(160)
  const collection = collections.find((item) => item.id === collectionId)
  if (!collection) throw new Error("Notebook not found")
  return { ...collection }
}

export async function createCollection(input: {
  name: string
  description: string
}) {
  await pause(520)
  const collection: NotebookCollection = {
    id: makeId("notebook"),
    name: input.name,
    description: input.description,
    updatedAt: new Date().toISOString(),
    sourceCount: 0,
    memoryCount: 0,
    accent: "ink",
  }
  collections = [collection, ...collections]
  return collection
}

export async function deleteCollection(collectionId: string) {
  await pause(420)
  collections = collections.filter((item) => item.id !== collectionId)
  sources = sources.filter((item) => item.collectionId !== collectionId)
  memories = memories.filter((item) => item.collectionId !== collectionId)
  messages = messages.filter((item) => item.collectionId !== collectionId)
}

export async function listSources(collectionId: string) {
  await pause(240)
  return sources
    .filter((source) => source.collectionId === collectionId)
    .map((source) => ({ ...source }))
}

export async function addSources(collectionId: string, drafts: SourceDraft[]) {
  await pause(580)
  const added = drafts.map<Source>((draft) => ({
    ...draft,
    id: makeId("source"),
    collectionId,
    status: "ready",
    addedAt: new Date().toISOString(),
  }))
  sources = [...added, ...sources]
  collections = collections.map((collection) =>
    collection.id === collectionId
      ? {
          ...collection,
          sourceCount: collection.sourceCount + added.length,
          updatedAt: new Date().toISOString(),
        }
      : collection
  )
  return added
}

export async function removeSource(sourceId: string) {
  await pause(360)
  const source = sources.find((item) => item.id === sourceId)
  sources = sources.filter((item) => item.id !== sourceId)
  if (source) {
    collections = collections.map((collection) =>
      collection.id === source.collectionId
        ? {
            ...collection,
            sourceCount: Math.max(0, collection.sourceCount - 1),
          }
        : collection
    )
  }
}

export async function retrySource(sourceId: string) {
  sources = sources.map((source) =>
    source.id === sourceId ? { ...source, status: "processing" } : source
  )
  await pause(760)
  sources = sources.map((source) =>
    source.id === sourceId ? { ...source, status: "ready" } : source
  )
}

export async function listMemories(collectionId: string) {
  await pause(260)
  return memories
    .filter((memory) => memory.collectionId === collectionId)
    .map((memory) => ({ ...memory }))
}

export async function createMemory(
  collectionId: string,
  input: { title: string; content: string }
) {
  await pause(520)
  const memory: MemoryEntry = {
    id: makeId("memory"),
    collectionId,
    title: input.title,
    content: input.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  memories = [memory, ...memories]
  collections = collections.map((collection) =>
    collection.id === collectionId
      ? { ...collection, memoryCount: collection.memoryCount + 1 }
      : collection
  )
  return memory
}

export async function removeMemory(memoryId: string) {
  await pause(360)
  const memory = memories.find((item) => item.id === memoryId)
  memories = memories.filter((item) => item.id !== memoryId)
  if (memory) {
    collections = collections.map((collection) =>
      collection.id === memory.collectionId
        ? {
            ...collection,
            memoryCount: Math.max(0, collection.memoryCount - 1),
          }
        : collection
    )
  }
}

export async function listMessages(collectionId: string) {
  await pause(210)
  return messages
    .filter((message) => message.collectionId === collectionId)
    .map((message) => ({ ...message }))
}

export async function sendQuestion(collectionId: string, question: string) {
  const userMessage: ChatMessage = {
    id: makeId("message"),
    collectionId,
    role: "user",
    content: question,
    createdAt: new Date().toISOString(),
  }
  messages = [...messages, userMessage]
  await pause(920)
  const availableSources = sources.filter(
    (source) =>
      source.collectionId === collectionId && source.status === "ready"
  )
  const answer: ChatMessage = {
    id: makeId("message"),
    collectionId,
    role: "assistant",
    content:
      "The material points to a useful distinction: fluent processing can feel like learning, but durable learning usually requires retrieval, spacing, and deliberate connections between ideas. This is a local demonstration response until retrieval is connected.",
    createdAt: new Date().toISOString(),
    citations: availableSources.slice(0, 2).map((source) => source.name),
  }
  messages = [...messages, answer]
  return { userMessage, answer }
}

export async function listArtifacts(collectionId: string) {
  await pause(320)
  return artifacts
    .filter((artifact) => artifact.collectionId === collectionId)
    .map((artifact) => ({ ...artifact }))
}
