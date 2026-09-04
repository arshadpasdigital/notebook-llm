# Notebook LLM Clone — Project Documentation

## 1. Project overview

This project is a learning-focused clone of Google NotebookLM. It allows a user to provide source material, ask questions about that material, and use generated learning aids to understand and recall the content more effectively.

Supported source types are:

- PDF files
- YouTube URLs
- Plain text entered or pasted by the user
- Website URLs

The product is organized around collections. A collection is a workspace containing a related group of resources, conversations, memory entries, and learning artifacts.

### Product statement

> Give learners one place to collect source material, ask grounded questions, remember important ideas, and study in multiple formats.

### Current frontend baseline

The repository is a React, TypeScript, and Vite application using TanStack Router and shadcn/ui-style components. The current codebase contains an initial chat route, sidebar, source modal, chat body, message components, and supporting UI primitives. This document defines the intended product scope; it is not a claim that every feature described here is already implemented.

Because this is an existing website, future implementation work must begin by understanding and protecting the current implementation. The default mode is **Preserve**: keep working behavior and the current product direction unless a separate, explicit approval is given for refinement or redesign.

Before changing the interface or application structure, inspect the current package configuration, routes, components, styles, design tokens, fonts, assets, API usage, authentication, tests, documentation, and uncommitted changes. Existing user changes must be preserved, and unrelated files must not be overwritten.

## 2. Goals

### Primary goals

1. Let users create and manage separate collections for different subjects or projects.
2. Let users add multiple types of source material to a collection.
3. Let users chat with an LLM using the selected collection's resources as context.
4. Help users retain knowledge through memories, mind maps, flash cards, and other study formats.
5. Keep the experience understandable for learners with different levels of technical knowledge.

### Secondary goals

- Make source-grounded answers easy to distinguish from unsupported responses.
- Make it easy to return to a previous collection and continue studying.
- Provide clear loading, empty, success, and error states for asynchronous operations.
- Keep the frontend modular so the backend, model provider, and persistence layer can change later.

### Non-goals for the current scope

- Defining final visual design, branding, color palette, typography, or animation.
- Building a full social sharing or collaboration system.
- Replacing a full learning-management system.
- Supporting every possible file format in the first version.

## 3. Target users and use cases

### Target users

- Students studying from lecture notes, books, papers, or videos.
- Professionals researching a topic or preparing for a certification.
- Self-directed learners organizing information from the web.
- Anyone who wants to ask questions of their own source material instead of searching through it manually.

### Representative use cases

- A student uploads lecture PDFs and asks for an explanation of a difficult concept.
- A learner adds a YouTube lecture and creates flash cards from it.
- A researcher saves several website URLs in a collection and asks for a comparison.
- A user pastes personal notes and asks the LLM to identify gaps or summarize them.
- A learner creates a mind map to recall the relationships between major ideas.

## 4. Product structure

The application has two levels of navigation:

1. **Application level** — landing page, authentication, and the user's collection list.
2. **Collection level** — dashboard/chat, memory, learning, and resources for one selected collection.

### Page inventory

| Page | Purpose | Main user actions |
| --- | --- | --- |
| Landing page | Explain the product and guide visitors toward sign-in | Learn about the product, start sign-in |
| Login page | Authenticate the user | Continue with Google, handle authentication states |
| Collections page | Show and manage the user's collections | Create, open, rename, and delete collections |
| Collection dashboard | Provide the primary source-grounded chat experience | View context, ask questions, read answers, add sources |
| Memory page | Manage persistent knowledge captured for a collection | Create, view, edit, and delete memories |
| Learning page | Generate and use study aids | Open mind maps, flash cards, and other learning modes |
| Resources page | Manage all resources in a collection | Add, inspect, filter, and remove resources |

## 5. Detailed page requirements

### 5.1 Landing page

**Purpose:** Introduce the application and communicate the core value: learners can bring their own resources and learn through conversation and generated study tools.

**Required content:**

- Clear product name and short description.
- Explanation of the supported resource types.
- Explanation of chat, memory, and learning features.
- Primary call to action leading to Google login.
- A way to reach the login page from the main navigation or call to action.

**States:**

- Default visitor state.
- Authentication redirect in progress.
- Authentication redirect failure.

### 5.2 Login page

**Purpose:** Authenticate users using Google only.

**Functional requirements:**

- Show a single clear Google sign-in action.
- Redirect an authenticated user to the collections page or their last active collection.
- Preserve and display authentication errors without exposing sensitive provider details.
- Provide a loading state while authentication is in progress.
- Provide a way back to the landing page.

**Out of scope:** Email/password registration, password reset, and other social providers unless added later.

### 5.3 Collections page

**Purpose:** Give the user an overview of all collections and a starting point for collection-level work.

**Functional requirements:**

- Display the user's collections.
- Create a new collection with at least a name; an optional description may be supported.
- Open a collection and navigate to its dashboard.
- Rename a collection.
- Delete a collection with confirmation.
- Show the most recent activity or updated time when available.
- Provide an empty state with a prominent create-collection action.

**Collection card/list information:**

- Collection name.
- Optional description.
- Resource count.
- Recent activity or updated timestamp.
- Entry point to open the collection.
- Collection actions menu.

**States:** empty, loading, loaded, create in progress, create success, create failure, delete confirmation, delete in progress, and delete failure.

### 5.4 Collection dashboard / chat

**Purpose:** Provide the primary interface for asking questions about a collection's resources.

**Core layout responsibilities:**

- Identify the active collection.
- Show the conversation history.
- Show the active or available sources used for context.
- Provide a composer for the user's question.
- Provide access to adding resources.
- Provide access to memory, learning, and resource management.

**Functional requirements:**

- Send a user question to the LLM with the selected collection context.
- Render user and assistant messages in order.
- Preserve conversation history for the collection.
- Support starting a new conversation or clearing the current conversation when persistence is available.
- Show source references or citations when the backend provides them.
- Prevent accidental submission of empty questions.
- Allow submission by button and, where appropriate, keyboard shortcut.
- Keep the composer usable while responses stream or are being generated.
- Provide a stop/cancel action for a response if streaming is supported.

**Chat states:**

- No resources: explain that the user must add a resource before asking grounded questions.
- Resources available, no messages: show suggested prompts or examples.
- Waiting for input.
- Sending question.
- Streaming/generating response.
- Response complete.
- Response failed or timed out.
- Resource processing still in progress.
- No relevant information found in the collection.

**Expected answer behavior:**

- Prefer answers grounded in the collection's resources.
- Make uncertainty visible when the sources do not contain an answer.
- Avoid presenting invented details as facts from the user's resources.
- Keep the conversation associated with the active collection.

### 5.5 Memory page

**Purpose:** Let users inspect and maintain persistent knowledge associated with a collection.

The memory feature represents information the user or system wants to retain for future conversations or study sessions. A memory may be a fact, preference, definition, summary, question, or other useful note.

**Functional requirements:**

- List memories for the active collection.
- Create a memory manually.
- Allow the system to suggest or create a memory from a chat interaction if supported.
- View the full memory content and metadata.
- Edit a memory.
- Delete a memory with confirmation.
- Search or filter memories when the list becomes large.
- Show when a memory was created and last updated when available.

**Memory fields:**

- `id`
- `collectionId`
- `title` or short label
- `content`
- `sourceMessageId` or source reference, if generated from chat
- `createdAt`
- `updatedAt`

**States:** no memories, loading, loaded, create/edit form, saving, saved, delete confirmation, and error.

### 5.6 Learning page

**Purpose:** Convert collection knowledge into formats that support understanding and recall.

**Initial learning modes:**

- **Mind map:** Visual hierarchy of the main concepts and relationships in the collection.
- **Flash cards:** Prompt/answer cards for active recall.

Additional modes may be added later, such as quizzes, summaries, timelines, or study guides.

**Functional requirements:**

- Let the user choose a learning mode.
- Generate an artifact from the active collection or selected resources.
- Show generation progress and failure states.
- Allow the user to revisit an existing artifact.
- Allow regeneration when the underlying resources change or the result is not useful.
- Preserve the artifact under the collection when persistence is available.
- Clearly distinguish generated content from source content.

**Flash-card requirements:**

- Show one prompt at a time.
- Reveal or flip to the answer.
- Navigate forward and backward.
- Track optional progress such as known, uncertain, or review later.
- Handle empty or insufficient source content.

**Mind-map requirements:**

- Show a central topic and related concepts.
- Support readable expansion of nodes.
- Handle large maps without making the page unusable.
- Provide a loading, empty, and generation-error state.

### 5.7 Resources / documents page

**Purpose:** Provide a complete view of the resources attached to the active collection.

**Functional requirements:**

- List resources of all supported types.
- Add a PDF, YouTube URL, text input, or website URL.
- Show resource type, title/name, processing status, and added time when available.
- Open resource details or a preview when supported.
- Remove a resource with confirmation.
- Filter resources by type and status.
- Report invalid input and processing errors clearly.
- Show whether a resource is ready to be used for chat.

**Resource processing lifecycle:**

`added` → `processing` → `ready`

Failure path:

`processing` → `failed`

Possible user actions for a failed resource are retry, edit the source, or remove it.

## 6. Resource requirements

### PDF

- Accept a supported PDF file through upload.
- Validate file type and configurable file-size limits.
- Upload and process the file asynchronously.
- Show processing progress or an indeterminate loading state.
- Make the resource available to chat only after processing succeeds.

### YouTube URL

- Accept and validate a YouTube URL.
- Extract available video metadata and transcript through the backend or integration layer.
- Show a useful error if the video is unavailable or has no usable transcript.
- Keep the original URL visible in the resource details.

### Plain text

- Accept pasted or typed text.
- Require non-empty content after trimming whitespace.
- Allow the user to provide a title or derive one automatically.
- Store the text securely and make it available after processing.

### Website URL

- Accept and validate an HTTP(S) URL.
- Fetch and process the page through a backend service.
- Handle blocked pages, dynamic pages, invalid URLs, and unavailable content.
- Preserve the original URL for later reference.

## 7. Primary user flows

### First-time user flow

1. Visitor opens the landing page.
2. Visitor selects the Google sign-in action.
3. Authentication succeeds.
4. User arrives at the collections page.
5. User creates a collection.
6. User opens the collection dashboard.
7. User adds one or more resources.
8. Resources finish processing.
9. User asks a question in chat.
10. User opens a learning mode or saves useful information to memory.

### Returning user flow

1. User signs in with Google.
2. User sees existing collections.
3. User opens a collection.
4. User continues chatting, manages resources, reviews memories, or studies with saved artifacts.

### Add-resource flow

1. User chooses Add resource.
2. User selects PDF, YouTube, text, or website.
3. User enters or selects the source.
4. Frontend validates the input.
5. Frontend submits the source.
6. UI shows processing status.
7. Resource becomes ready or reports a recoverable failure.
8. Chat and learning features use the resource only when it is ready.

### Chat flow

1. User enters a question.
2. Frontend validates that the question is not empty.
3. Frontend sends the question and collection identifier.
4. Backend retrieves relevant source context and generates a response.
5. Frontend renders the response and any source references.
6. User may ask a follow-up, save a memory, or create a learning artifact.

## 8. Information architecture and route proposal

The following route structure is recommended. Exact URLs may change during implementation.

```text
/
├── /login
└── /app
    ├── /collections
    └── /collections/:collectionId
        ├── /chat
        ├── /memory
        ├── /learning
        └── /resources
```

The current repository already includes a chat route. New routes should preserve a clear collection context and avoid duplicating collection identifiers in client state when the URL can be the source of truth.

## 9. Domain model

### User

Represents an authenticated Google account.

Suggested fields: `id`, `googleId`, `displayName`, `email`, `avatarUrl`, `createdAt`, `updatedAt`.

### Collection

Represents an independent learning workspace.

Suggested fields: `id`, `userId`, `name`, `description`, `createdAt`, `updatedAt`.

### Resource

Represents source material attached to a collection.

Suggested fields: `id`, `collectionId`, `type`, `title`, `sourceUrl`, `fileName`, `textContent`, `status`, `errorMessage`, `createdAt`, `updatedAt`.

Allowed initial `type` values: `pdf`, `youtube`, `text`, `website`.

Allowed initial `status` values: `added`, `processing`, `ready`, `failed`.

### Conversation

Represents a chat session within a collection.

Suggested fields: `id`, `collectionId`, `title`, `createdAt`, `updatedAt`.

### Message

Represents one user or assistant message.

Suggested fields: `id`, `conversationId`, `role`, `content`, `citations`, `createdAt`.

Allowed initial `role` values: `user`, `assistant`.

### Memory

Represents retained knowledge associated with a collection.

Suggested fields: `id`, `collectionId`, `title`, `content`, `sourceMessageId`, `createdAt`, `updatedAt`.

### Learning artifact

Represents a generated study aid.

Suggested fields: `id`, `collectionId`, `type`, `title`, `content`, `sourceResourceIds`, `createdAt`, `updatedAt`.

Allowed initial `type` values: `mind-map`, `flash-cards`.

## 10. Frontend behavior and architecture guidelines

### Component responsibilities

Components should make their purpose, interactions, state, dependencies, and edge cases explicit. For example, a source modal should own source-type selection and input validation, while the collection/resource layer should own persistence and processing status.

Recommended boundaries include:

- `AppShell` — authenticated application layout and navigation.
- `CollectionList` — collection loading, creation, selection, and deletion.
- `SourceModal` — source-type selection and source submission.
- `ResourceList` — resources, filters, status, and resource actions.
- `ChatPage` — conversation display and question submission.
- `MemoryList` and `MemoryForm` — memory CRUD.
- `LearningModeSelector` — study-mode selection and artifact launch.
- `MindMap` and `FlashCardDeck` — learning artifact presentation.

### State categories

- **Session state:** authenticated user and login status.
- **Navigation state:** active collection, active page, and active conversation.
- **Server state:** collections, resources, messages, memories, and learning artifacts.
- **Transient UI state:** modal visibility, form values, selected filters, and expanded items.
- **Async operation state:** loading, processing, success, failure, and retry status.

Server state should not be treated as permanently local UI state. The frontend should be able to refresh collection data and recover after navigation or a failed request.

### Error handling

Errors should be actionable and user-readable. Each async feature should define behavior for:

- Network failure.
- Unauthorized or expired session.
- Invalid user input.
- Unsupported or unavailable resource.
- LLM timeout or provider failure.
- Empty or insufficient context.
- Delete or update failure.

## 11. Authentication, privacy, and security requirements

- Google is the only supported login provider in the initial scope.
- Unauthenticated users should not access collection data.
- Every collection, resource, message, memory, and learning artifact must be authorized against its owning user.
- Do not expose provider tokens or secrets in frontend code.
- Validate uploads and URLs on both the frontend and backend.
- Avoid rendering untrusted resource content as executable HTML.
- Do not log full private source content or private conversations unnecessarily.
- Make delete actions explicit and require confirmation for material data removal.
- Define retention and deletion behavior for uploaded files and processed content before production release.

## 12. Accessibility and responsive behavior

These are functional quality requirements, not visual design decisions.

- All actions must be keyboard accessible.
- Form controls must have usable labels and validation messages.
- Dialogs must manage focus correctly and close predictably.
- Status changes such as processing, success, and errors should be announced where appropriate.
- Chat messages must remain readable at different text sizes.
- Learning artifacts must provide an accessible alternative when their visual presentation cannot communicate all information.
- The collection workspace must remain usable on narrow screens and touch devices.
- Color must not be the only way to communicate resource status or errors.

## 13. Performance and reliability expectations

- Load the initial landing and login experiences quickly.
- Avoid loading all collection content when only the collection list is needed.
- Paginate or virtualize long resource, message, memory, or flash-card lists as needed.
- Use streaming responses only when the backend supports reliable cancellation and reconnection.
- Preserve user input during recoverable request failures.
- Make resource processing asynchronous so large files do not block the entire interface.

## 14. Success criteria

The first usable release should allow a new user to:

1. Sign in with Google.
2. Create a collection.
3. Add at least one supported source type.
4. See whether the source is processing, ready, or failed.
5. Ask a question about a ready source.
6. Read the answer and any available source references.
7. Create, update, and delete a memory.
8. Generate or open a mind map and flash-card learning experience.
9. Return to the collection later and find the saved data.

## 15. Testing expectations

### Unit tests

- Input validation for each source type.
- Collection, resource, memory, and learning-artifact state transitions.
- Chat composer behavior, including empty and duplicate submission handling.
- Formatting of message citations and resource statuses.

### Integration tests

- Google login success and failure paths.
- Collection creation, opening, renaming, and deletion.
- Resource submission and processing-status updates.
- Chat request and response rendering.
- Memory CRUD.
- Learning-artifact generation and retry.

### End-to-end scenarios

- New user creates a collection and asks a question about a PDF.
- User adds a YouTube URL and generates flash cards.
- User adds a website resource that fails processing and retries it.
- User navigates between chat, memory, learning, and resources without losing collection context.
- User refreshes the page and sees persisted collection data.

## 16. Assumptions and open questions

The following decisions are intentionally left open for implementation planning:

- Which backend and database will provide persistence?
- Which authentication service will handle Google OAuth?
- Which LLM provider and embedding/retrieval strategy will be used?
- Will chat responses stream to the frontend?
- Which PDF, website, and YouTube processing services are available?
- What file-size, page-count, URL, and text-length limits should apply?
- Should a collection support multiple conversations or only one conversation initially?
- Are memories created only by users, only by the system, or by both?
- Should learning artifacts update automatically when resources change?
- Should users be able to export, share, or collaborate on collections?
- What content moderation and abuse-prevention rules are required?
- What analytics are needed to measure successful learning interactions?

## 17. Design scope note

This document intentionally does not define the visual design. Layout details, component styling, colors, typography, iconography, responsive breakpoints, and motion should be decided in a separate design or implementation document after the product behavior and technical constraints are confirmed.

## 18. Existing website implementation guardrails

These guardrails apply when the product described in this document is implemented or expanded in the current repository.

### Preserve current behavior

- Preserve existing route behavior unless a route change has been approved.
- Preserve API contracts, authentication, authorization, and useful existing components.
- Do not replace dependencies, remove working features, or perform wholesale rewrites without approval.
- Keep the existing feature-based structure when it remains reasonable.
- Add feature-specific code under `src/features/<feature>/` with appropriate `components`, `hooks`, `api`, `schemas`, `types`, and `utils` folders where needed.
- Review current uncommitted changes before editing and keep unrelated changes intact.

### Baseline evidence before UI changes

Before changing the interface, create a baseline record covering:

- Existing sitemap, routes, navigation, and user workflows.
- Current component system, design tokens, fonts, assets, and global styles.
- Existing API, authentication, and data behavior.
- Current responsive behavior and loading, empty, error, and success states.
- Accessibility issues, console errors, network failures, visual inconsistencies, and broken interactions.

Visual or structural changes should only proceed after the baseline is understood and the change mode is agreed. The available modes are:

1. **Preserve** — maintain the current visual language while improving quality and usability.
2. **Refine** — maintain the product identity while improving consistency, accessibility, layout, copy, states, or motion.
3. **Redesign** — replace the visual system while preserving the product purpose, data, and approved workflows.

### Verification after implementation

Any future interface implementation should run the existing tests, exercise the affected routes in a real browser, compare behavior against the baseline, and verify that no new console errors, network failures, accessibility regressions, or layout collapses were introduced. Critical and high-severity findings must be resolved before the work is considered complete; remaining medium and low findings should be documented.

## 19. Baseline audit

The repository baseline and the first source-management implementation are recorded in [baseline-audit.md](./baseline-audit.md). The audit documents the current sitemap, routes, navigation, workflows, component system, design tokens, content, API status, responsive behavior, UI states, accessibility findings, verification results, and remaining limitations.
