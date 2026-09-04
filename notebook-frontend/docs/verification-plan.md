# Notebook LLM — Verification Evidence Plan

**Status:** Implementation complete; browser evidence remains incomplete. This is not a passed UX audit.  
**Audit persona:** Confirmed exam-preparation student.  
**Required verdict discipline:** No Pass or Conditional Pass without a complete interaction manifest and real browser evidence.

## Implementation verification record — 2026-08-26

| Check                                         | Result                           | Evidence note                                                                                                           |
| --------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| TypeScript                                    | Pass                             | `bun run typecheck` exited 0                                                                                            |
| ESLint                                        | Pass                             | `bun run lint` exited 0                                                                                                 |
| Production compilation                        | Pass with environment workaround | Vite transformed 2,129 modules and emitted a production build to `/private/tmp/notebook-llm-final-dist`                 |
| Impeccable deterministic scan                 | Pass                             | `detect.mjs --json src` returned `[]`                                                                                   |
| Standard `dist` cleanup                       | Environment-blocked              | Vite cannot remove the existing empty `dist/assets` directory because macOS returns `EPERM`, including after escalation |
| Browser interaction/a11y/performance evidence | Incomplete                       | Local port binding returns `EPERM`; no Playwright/browser connector is available in this environment                    |

The source-level implementation includes the required routes, keyboard labels, reduced-motion and forced-colors fallbacks, loading/empty/error/retry/long-content demo states, optimistic chat/source behavior, and mobile/desktop navigation. These are implementation facts, not substitutes for the browser evidence listed below.

## 1. Quality gates

| Gate             | Required result                                           | Evidence                                                                                            |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| TypeScript       | Exit 0                                                    | `bun run typecheck` output                                                                          |
| ESLint           | 0 errors, 0 warnings                                      | `bun run lint` output                                                                               |
| Production build | Exit 0                                                    | `bun run build` output                                                                              |
| Console          | 0 errors, 0 warnings                                      | Browser capture for every route after primary interaction                                           |
| Network          | 0 unexpected failures; 0 5xx                              | Request inventory per route                                                                         |
| Accessibility    | 0 axe Critical; 0 axe Serious                             | `axe.run()` output per route and major overlay state                                                |
| Layout           | 0 collapse or page-level overflow                         | Screenshots and bounding-box assertions at required widths                                          |
| Performance      | LCP < 4s; CLS < 0.25; INP < 500ms                         | Performance API capture on collection chat; landing additionally targets CWV-strict where practical |
| Motion           | Reduced-motion path works; no blocked properties/patterns | Code review plus browser comparison                                                                 |
| Interactions     | Complete manifest for every route                         | At least six evidence-bearing entries per route                                                     |

## 2. Evidence locations

```text
artifacts/
└── ux-audit/
    ├── screenshots/
    │   ├── 375/
    │   ├── 768/
    │   ├── 1024/
    │   ├── 1280/
    │   ├── 1440/
    │   └── 1920/
    ├── console.json
    ├── network.json
    ├── axe.json
    ├── performance.json
    ├── interaction-manifest.md
    └── final-audit.md
```

Artifacts are created only by a real run. Empty placeholder evidence files must not be committed as proof.

## 3. Route coverage matrix

| Route                         | Input to type                              | Primary action             | Overlay/detail to open                       | Expected post-action state                                             |
| ----------------------------- | ------------------------------------------ | -------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| `/`                           | N/A; use keyboard navigation instead       | Start a notebook           | How-it-works detail/anchor                   | Navigates to login; focus/scroll target is correct                     |
| `/login`                      | N/A for Google-only flow                   | Continue with Google       | Demo-session information                     | Loading appears, then collections route; error variant recovers        |
| `/collections`                | Notebook name/search                       | Create notebook            | Create dialog and notebook actions menu      | Notebook appears; input/dialog resets; route opens correctly           |
| `/collections/demo/chat`      | A realistic study question                 | Send question              | Add-source dialog and citation/source detail | Input clears; user message appears; generating then answer/error state |
| `/collections/demo/memory`    | Memory title/content or search             | Save memory                | Memory editor/detail                         | Saved memory appears; success announced; edit persists in session      |
| `/collections/demo/learning`  | Flash-card response/filter where available | Start practice             | Flash card or mind-map detail                | Artifact loads; card reveal and confidence state update                |
| `/collections/demo/resources` | URL/text source                            | Add source                 | Source dialog and source detail              | Source appears with lifecycle state; invalid input stays recoverable   |
| `/chat`                       | N/A                                        | Follow compatibility route | N/A                                          | Redirects to `/collections/demo/chat` without loop or console warning  |

The landing page has no form input by design. Its manifest substitutes a keyboard-only navigation check and an anchor interaction; the overall audit must explicitly record this justified exception rather than fabricate an input.

## 4. State coverage matrix

| Feature        | Loading    | Empty                  | Error                                  | Retry | Success         | Disabled                    | Optimistic          | Long content              |
| -------------- | ---------- | ---------------------- | -------------------------------------- | ----- | --------------- | --------------------------- | ------------------- | ------------------------- |
| Authentication | Yes        | N/A                    | Yes                                    | Yes   | Yes             | Yes                         | N/A                 | N/A                       |
| Collections    | Yes        | Yes                    | Yes                                    | Yes   | Yes             | Yes                         | Create/delete       | Long name/description     |
| Chat           | Generating | No sources/no messages | Answer failure                         | Yes   | Answer complete | Send while empty/generating | User message        | Long answer/source titles |
| Memory         | Yes        | Yes                    | Save/delete error                      | Yes   | Saved           | Save during request         | Create/edit         | Long memory text          |
| Learning       | Generating | No artifacts           | Insufficient source/generation failure | Yes   | Artifact ready  | Generate while unavailable  | Progress/confidence | Large mind map/card text  |
| Resources      | Processing | Yes                    | Validation/processing failure          | Yes   | Ready           | Submit during request       | Add/remove/retry    | Long URL/title/text       |

## 5. Responsive and multi-pane matrix

Test widths: `375`, `768`, `1024`, `1280`, `1440`, and `1920`.

For collection workspace routes, capture these pane combinations where applicable:

1. Default shell.
2. Application navigation open, context/source panel closed.
3. Application navigation collapsed, context/source panel open.
4. Both navigation and context panel open at widths that support them.
5. Mobile sheet open over the primary view.

At every combination verify:

- Main content width remains usable and reading text never stacks vertically.
- No critical action is clipped or placed under fixed chrome.
- Page and pane scrolling remain independent where intended.
- Composer respects mobile keyboard and safe-area insets.
- Long notebook/source names wrap or truncate with a recoverable full value.
- Focus remains visible and is not hidden behind sticky UI.
- No page-level horizontal scroll at 320 CSS pixels or 200% zoom.

## 6. Keyboard and accessibility walkthrough

For every route:

1. Start at the URL with no mouse.
2. Use the skip link where repeated navigation precedes main content.
3. Tab through controls in DOM/visual order.
4. Confirm every stop has a visible focus indicator.
5. Activate links with Enter and buttons with Enter/Space.
6. Open each dialog/sheet, confirm focus moves inside, press Escape, and confirm focus returns to its trigger.
7. Submit invalid forms; confirm the first invalid field receives focus and its error is connected by `aria-describedby`.
8. Confirm dynamic loading, success, and failure states use an appropriate stable live region.
9. Run axe after the route settles and again with the major overlay open.
10. Inspect computed accessible names and roles for every icon-only action.

## 7. Motion verification

Test once with normal motion and once with `prefers-reduced-motion: reduce`.

- Buttons provide fast static/transform feedback without hiding focus.
- Dialogs and panels use exact transform/opacity transitions and remain interruptible.
- No `transition: all`, `ease-in` entrance, `scale(0)`, ungated hover motion, or animated layout property exists.
- Reduced motion removes movement/scale and retains a brief opacity or color cue.
- Keyboard-initiated route navigation is immediate.
- Loading indicators never become the only channel for state.

## 8. Representative data battery

- Notebook/source names at 1, 40, 120, and 300 characters.
- Empty, one-item, 100-item, and simulated 1000-item collections where the component supports it.
- Unicode: `José’s naïve résumé`, `東京の講義ノート`, and `ملخص المحاضرة`.
- URLs with long paths, query parameters, and fragments.
- Pasted text containing quotation marks, apostrophes, code, and line breaks.
- A PDF name containing spaces and parentheses.
- Duplicate submit, fast type-then-submit, slow mock response, offline mock, and retry.
- Reduced motion, forced colors, 200% zoom, and RTL direction mirror.

## 9. Interaction manifest template

Each audited route records timestamps, selectors, results, and evidence for:

- `TYPE` realistic input when the route contains an input.
- `SUBMIT` or the route’s equivalent primary action.
- `OPEN` one modal, sheet, menu, or detail view.
- `ASSERT` expected state change.
- `CONSOLE` read after the primary action.
- `NETWORK` inventory.
- Screenshots before and after the primary action.

Minimum coverage is six evidence-bearing entries per route. Any missing route manifest makes the final verdict **Incomplete**.

## 10. Primary scenario battery

1. First contact: create a notebook without reading project documentation.
2. Interrupted workflow: begin source intake, close/reload, and observe the intentionally in-memory behavior.
3. Wrong-turn recovery: choose the wrong source type and return without losing orientation.
4. Returning user: reopen the seeded notebook and reach recent work faster.
5. Keyboard only: complete add-source and ask-question flows.
6. Heavy data: inspect resource and memory lists at their high-volume mock state.
7. Destructive confidence: remove a source and delete a notebook with explicit consequence copy.
8. Second role: verify no edit permissions are falsely implied because roles are not implemented.
9. Lifecycle position: compare first notebook, partially populated notebook, and seeded notebook.
10. Round trip: add a source in Resources, return to Chat, and see the updated count without reload.
11. Data seasoning: verify recent/older timestamps and sorting in seeded content.

## 11. Review sequence

1. Run mechanical detector once over changed UI targets.
2. Run interface-change review against the resolved worktree scope.
3. Run typography, color, layout, accessibility, writing, UI-polish, and motion reviews.
4. Consolidate findings by root cause and severity.
5. Fix every Critical and High finding in one bounded pass.
6. Re-run affected interactions and screenshots.
7. Run one confirmation pass.
8. Publish the final audit with honest Pass, Conditional Pass, Fail, or Incomplete verdict.

## 12. Current execution blocker

The environment currently rejects Vite port binding with `EPERM` even after an elevated attempt, and Python Playwright is not installed. Until a real browser can reach the built app, screenshot, console, network, axe, performance, responsive, and interaction evidence are **not verified**. This plan must never be cited as if those checks ran.
