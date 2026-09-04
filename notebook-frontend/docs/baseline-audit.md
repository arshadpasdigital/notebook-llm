# Existing Website Baseline Audit

**Project:** Notebook LLM Clone  
**Audit date:** 2026-08-26  
**Mode:** Preserve  
**Scope:** Existing frontend before the source-management feature, plus verification of the current worktree after implementation.

## Executive summary

The repository is a small React/Vite starter with one placeholder route and one partially implemented chat route. The chat UI renders, but its sources are hard-coded and the source modal does not communicate with the chat or sidebar. There is no authentication, backend API, persistence, collection management, memory, or learning implementation yet.

The first implementation slice was intentionally limited to local source intake and management. It adds PDF, YouTube, website, and pasted-text source drafts, renders the current source list in the sidebar, removes sources, and makes the chat context reflect the actual list. Backend processing and persistence remain future work.

## 1. Existing sitemap

```text
/
└── /chat
    ├── source modal
    ├── source list in sidebar
    └── chat interface
```

The intended product sitemap in [project.md](./project.md) is broader than the current implementation. Landing, login, collections, memory, learning, and resource-management pages do not yet exist as routes.

## 2. Existing route table

| Route | Current implementation | Status |
| --- | --- | --- |
| `/` | Renders `Hello "/"!` | Placeholder |
| `/chat` | Renders `SidebarProvider`, `AppSidebar`, and `ChatPage` | Partially functional |

TanStack Router generates `src/routeTree.gen.ts` from the route files. No collection identifier is present in the current route structure.

## 3. Existing navigation

- The chat route exposes a sidebar trigger.
- The sidebar exposes an Add source action.
- The source modal exposes source-type choices and secondary input views.
- There is no landing-page CTA, login navigation, collection navigation, or collection-level navigation yet.

## 4. Existing user workflows

### Before the feature slice

1. User opens `/chat`.
2. The page displays two hard-coded demo sources.
3. User can open the Add Source modal.
4. User can move between the YouTube and copied-text modal views.
5. Submitting YouTube or copied text only logs to the console; it does not update the UI.
6. User can send a chat message and receives a simulated delayed response.

### After the feature slice

1. User opens `/chat` and sees an empty-source state.
2. User selects Add source.
3. User adds PDF files, a YouTube URL, a website URL, or pasted text.
4. The source appears in the sidebar and the chat context indicator updates.
5. User can remove a source from the sidebar.
6. User can ask a question and receive the existing simulated response, now referencing the current source count.

## 5. Existing component system

- React 19 with TypeScript and Vite.
- TanStack Router for file-based routes.
- shadcn/ui-style components using the Base UI primitives.
- Reusable components include `Sidebar`, `Dialog`, `Button`, `Input`, `Textarea`, `Empty`, `Marker`, `Bubble`, and `MessageScroller`.
- Lucide React is available for icons.
- Feature code currently lives in `src/features/chat`; shared UI lives in `src/components/ui`.

## 6. Existing design tokens and visual language

- Base shadcn style: `base-nova`.
- Base color: neutral.
- Single primary font: Inter Variable.
- CSS variables use OKLCH values for background, foreground, primary, muted, border, ring, chart, and sidebar colors.
- Default radius is `0.625rem` with derived radius tokens from small through 4xl.
- Light and dark theme variables are defined in `src/index.css`.
- The current visual language is restrained, neutral, rounded, and component-library-led.

**Design decision:** Preserve this visual language for the source-management slice. No new palette, font, token system, or dependency was introduced.

## 7. Existing content and voice

The original content was starter/demo copy such as “Project ready!”, “Hello! I've analyzed your uploaded sources”, and “Handle adding…” comments. The feature slice replaces source-related demo copy with direct, action-oriented labels such as “Add source”, “Add website”, and “No sources added”. The simulated assistant response remains clearly marked as a placeholder for retrieval integration.

## 8. Existing API and data behavior

- No API client or backend service is present.
- `@tanstack/react-query` is listed in `package.json`, but no query usage was found in the inspected application code.
- No authentication or authorization behavior is present.
- No database or persistence layer is present.
- Before the feature, source data and chat data were local component state; source data was hard-coded.
- After the feature, source state is lifted to the `/chat` route and passed to the sidebar and chat as props.
- Source status is currently set to `ready` locally; real processing states require a backend.

## 9. Existing responsive behavior

- `SidebarProvider` includes mobile behavior through the existing `use-mobile` hook and sheet primitives.
- The chat route now uses a flexible main column with `min-w-0`, `min-h-0`, and `flex-1` to reduce overflow risk.
- The source modal uses a responsive max width.
- Browser screenshots at desktop and mobile widths were **not verified** because the environment rejected Vite's local port binding with `EPERM`.

## 10. Existing loading, empty, error, and success states

### Before the feature slice

- Chat empty state existed in code but was unreachable because demo sources were always present.
- No source-processing state existed.
- No source validation error state existed.
- No network, API, authentication, or persistence state existed.
- Chat response used a fixed one-second timeout and a generic simulated response.

### After the feature slice

- Empty source state is reachable and instructs the user to add a source.
- YouTube and website URLs show validation errors.
- Empty pasted text shows validation errors.
- PDF input rejects selections without a PDF extension or MIME type.
- Added sources render in the sidebar with type/status information available to assistive technology.
- No real loading or processing state is claimed because no backend exists.

## 11. Existing accessibility issues

### Findings addressed

- The send control now has an accessible name and is disabled for empty input or while a response is pending.
- Source choices are explicit `button` elements with `type="button"`.
- Form submission is handled through a real form, preserving keyboard submission.
- Source removal controls have accessible names and titles.
- The source context icon is marked decorative.
- Empty and validation messages use readable text rather than console-only feedback.

### Remaining issues

- The root route is not a useful product page and has no meaningful page heading.
- The full application has not yet been tested with a screen reader or keyboard-only browser session.
- No automated accessibility tool is configured.

## 12. Existing console and network issues

- Static source inspection found `console.log` calls in the original source submission handlers; those were removed from the implemented flow.
- The app has no intentional network requests or API calls yet.
- Real-browser console and network verification was attempted but could not run because the Vite server could not bind to `127.0.0.1:5173` in this environment (`EPERM`).

## 13. Existing visual inconsistencies

- The root route is still a generic Vite starter screen while the chat route uses the shadcn application shell.
- Original source options used raw inline SVGs and inconsistent colored icon containers; the implemented source options use the existing Lucide icon system and shared neutral component vocabulary.
- Original labels used inconsistent capitalization (“Add Source”, “VVT File”, “Copied Text”); source-related labels now use consistent sentence case.
- The app title and favicon still identify the starter (`vite-app` and `/vite.svg`).

## 14. Existing AI-slop patterns

- Generic starter copy and a placeholder button on `/`.
- Demo data presented as if it were user data.
- Comments such as “Handle adding…” instead of actual behavior.
- Placeholder assistant text that does not explain its limitations.
- Generic rounded controls and default neutral styling are inherited from the component starter, not yet shaped around the learner workflow.

The feature slice removes the misleading hard-coded source presentation and makes the simulated response limitation explicit. A broader visual or content refinement requires a separate approved design pass.

## 15. Existing regressions and broken interactions

| Severity | Finding | Status |
| --- | --- | --- |
| High | Source modal submissions did not update the sidebar or chat | Fixed in this slice |
| High | Chat always showed demo sources, so the no-source state could not be reached | Fixed in this slice |
| Medium | Website URL intake was missing; a non-product “VVT File” option was shown instead | Replaced with website URL intake |
| Medium | No source removal behavior existed | Fixed in this slice |
| Medium | Root route is still a placeholder | Remaining |
| Medium | No persistence, authentication, backend retrieval, or collection context | Remaining product scope |

## 16. Verification record

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript typecheck | Pass | `bun run typecheck` |
| Prettier on changed files | Pass | `bunx prettier --check ...` |
| Impeccable detector | Pass | `detect.mjs --json` returned `[]` for changed UI files |
| Full lint | Fail, pre-existing baseline issues remain | Existing shadcn Fast Refresh rules, React effect rules, sparse Vite config array, plus route-file Fast Refresh rule |
| Production build | Fail, pre-existing baseline issue remains | `src/components/ui/scroll-area.tsx`: unused `React` import |
| Real-browser baseline/after screenshots | Not verified | Local Vite server rejected with `EPERM` on port binding |

## 17. Remaining limitations

- Source state is in-memory and resets on refresh.
- Source processing is not implemented; all locally added sources are marked ready.
- Chat responses are simulated and do not retrieve or cite source content.
- The app still lacks authentication, collections, memory, learning modes, resource detail pages, and backend integration.
- Full browser, screen-reader, and automated accessibility verification remains outstanding.
