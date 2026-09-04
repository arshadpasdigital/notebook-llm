# Notebook LLM — Planning and Approval Package

**Status:** Proposed; no React implementation has started.  
**Prepared:** 2026-08-26  
**Existing-project mode:** Proposed **Redesign · Overhaul**  
**Protected scope:** Product purpose, existing source workflow, stack, route compatibility, and useful component behavior.

## Baseline decision record

### Current implementation

- Routes: `/` and `/chat`.
- `/` is a placeholder.
- `/chat` provides local source intake for PDFs, YouTube URLs, websites, and pasted text; source removal; an empty state; and a simulated chat response.
- Source and message state reset on refresh.
- There is no backend, retrieval, persistence, authentication, collection management, memory, learning workflow, or production API behavior.
- The current visual system is neutral shadcn `base-nova`, Inter Variable, monochrome OKLCH tokens, rounded controls, and standard sidebar/dialog primitives.

### Current verification

| Check             | Result                   | Evidence                                                           |
| ----------------- | ------------------------ | ------------------------------------------------------------------ |
| TypeScript        | Pass                     | `bun run typecheck`                                                |
| Lint              | Fail: 20 existing errors | Fast Refresh rules, effect-state rules, sparse Vite plugin array   |
| Production build  | Fail                     | Unused `React` import in `src/components/ui/scroll-area.tsx`       |
| Local live server | Blocked by environment   | `listen EPERM 127.0.0.1:5173`, including approved elevated attempt |
| Browser baseline  | Not verified             | Python Playwright is unavailable and Vite cannot bind locally      |

### Preserve, improve, remove

**Preserve**

- All four source types and the existing add/remove behavior.
- TanStack Router, TanStack Query, Tailwind, shadcn/ui, Base UI, and Lucide.
- Native button/form semantics and the current dialog focus-management foundation.
- `/chat` as a compatibility entry.
- Existing uncommitted user work outside the approved implementation scope.

**Improve**

- Product information architecture, route completeness, identity, typography, hierarchy, responsive behavior, copy, application states, accessibility, and motion consistency.
- The source-to-chat workflow so it belongs to a collection and communicates processing state.
- Code organization around features without rewriting shared primitives unnecessarily.

**Remove or replace**

- Placeholder root content, Vite branding, misleading demo language, raw inline document SVG, and visually generic starter composition.
- Rounded-card repetition where spacing, rules, or one shared surface can carry structure.
- Simulated behavior presented without a visible “demo” boundary.

### Protected contracts

- Existing source draft fields and source-type vocabulary.
- The ability to add and remove sources and send a non-empty question.
- `/chat` remains reachable; it will redirect to a demo collection rather than disappear.
- No production authentication, retrieval, upload, persistence, or citation contract will be invented.
- Existing shared UI primitives will be reused where they remain accessible and fit the direction.

### Highest risks and fallback

- **Risk:** A visual overhaul could obscure a simple source workflow. **Fallback:** preserve the three-pane information order and keep source actions visible at every breakpoint.
- **Risk:** Editorial styling could become too slow or sparse for daily use. **Fallback:** reserve serif expression for headings and reading content; keep controls compact, sans-serif, and restrained.
- **Risk:** Mock routes could imply production features. **Fallback:** label demo authentication and generated content honestly and keep network behavior local.
- **Risk:** Final live verification may remain blocked by the environment. **Fallback:** complete static verification and provide exact commands for a user-run browser audit; do not claim an interaction-audit pass without evidence.

## 1. Product summary

Notebook LLM is a source-grounded learning workspace. A learner groups material into a notebook, asks questions across those sources, keeps important ideas, and turns the material into flash cards or a mind map.

The product loop is:

`Collect → Question → Keep → Practice`

## 2. Target persona

**Inferred primary persona:** A student preparing for an exam from lecture PDFs, recorded classes, websites, and notes.

- Moderate technical comfort.
- Often time-pressured and uncertain about what matters most.
- Uses a laptop for deep study and a phone for quick review.
- Needs source trust, progress visibility, and a reliable path back into the current subject.

This is an explicit assumption pending correction.

## 3. User jobs

1. Organize material for one subject without losing source context.
2. Ask a question and understand which material shaped the response.
3. Save definitions, relationships, and unresolved questions worth revisiting.
4. Convert trusted material into active-recall practice.
5. Return later and resume the right notebook quickly.
6. Diagnose and recover from a source that has not processed correctly.

## 4. Assumptions

- “Collection” is the data model; “notebook” is the user-facing term.
- Authentication, uploads, retrieval, processing, persistence, and generation are mocked locally.
- Google is the only intended sign-in provider.
- One seeded demo notebook will make populated states testable; every feature will also expose empty/error/loading demonstrations.
- Light and dark appearances remain supported because the current token system already defines both.
- The working name remains Notebook LLM until the user approves a rename.

## 5. Sitemap

```text
/
├── /login
├── /collections
│   └── /collections/$collectionId
│       ├── /chat
│       ├── /memory
│       ├── /learning
│       └── /resources
└── /chat  → compatibility redirect to /collections/demo/chat
```

## 6. Route table

| Route                                  | Purpose                          | Primary state/action                           |
| -------------------------------------- | -------------------------------- | ---------------------------------------------- |
| `/`                                    | Explain the product truthfully   | Start a notebook; sign in                      |
| `/login`                               | Google-only authentication entry | Continue with Google; mock loading/error       |
| `/collections`                         | Find and manage notebooks        | Create, open, rename, delete                   |
| `/collections/$collectionId`           | Collection entry                 | Redirect to collection chat                    |
| `/collections/$collectionId/chat`      | Source-grounded conversation     | Add sources; ask; view mock citation treatment |
| `/collections/$collectionId/memory`    | Maintain retained knowledge      | Add, edit, filter, remove memories             |
| `/collections/$collectionId/learning`  | Generate and use study aids      | Open flash cards or mind map                   |
| `/collections/$collectionId/resources` | Manage source lifecycle          | Add, filter, retry, remove sources             |
| `/chat`                                | Preserve current deep link       | Redirect to seeded demo chat                   |

## 7. Navigation model

- **Public:** Text wordmark, “How it works” anchor, “Sign in,” and one primary “Start a notebook” action.
- **Collection list:** Compact top bar with wordmark, search, and account menu.
- **Collection workspace desktop:** A stable application rail for notebook switching; collection navigation for Chat, Memory, Learning, and Sources; context panel only where the task needs it.
- **Tablet:** Collapsed application rail plus a dismissible context panel.
- **Mobile:** Compact header, bottom collection navigation, and sources in a full-height sheet. Primary content stays first in DOM reading order.
- Every route exposes a visible collection name and a reliable path back to “Your notebooks.”

## 8. Main workflows

### First session

Landing → Continue with Google → Empty notebook list → Create notebook → Add source → Source processing/ready → Ask question → Save useful answer → Open learning mode.

### Returning study session

Open recent notebook → Review last activity → Ask follow-up → Save or edit memory → Practice due flash cards.

### Source recovery

Open Sources → Filter “Needs attention” → Read specific failure → Retry or remove → Return to Chat with updated source count.

### Learning artifact

Open Learning → Choose Flash cards or Mind map → Generate mock artifact → Use it → Revisit saved artifact.

## 9. Page-by-page content plan

| Page        | Content hierarchy                                                                  | Primary action       | Required states                                                 |
| ----------- | ---------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------- |
| Landing     | Product thesis, four-step loop, product UI proof, source types, honest limitations | Start a notebook     | Default, auth redirect error                                    |
| Login       | Sign-in purpose, provider action, privacy/behavior note                            | Continue with Google | Idle, loading, error                                            |
| Collections | Recent notebooks, search, creation action                                          | Create notebook      | Loading, empty, populated, create, rename, delete error         |
| Chat        | Collection context, active sources, transcript, composer                           | Ask question         | No sources, ready, sending, generating, error, no answer        |
| Memory      | Search/filter, memory list, editor                                                 | Add memory           | Loading, empty, populated, saving, saved, delete error          |
| Learning    | Mode chooser, recent artifacts, active practice view                               | Start practice       | Empty, generating, generated, insufficient content, error       |
| Resources   | Filter bar, lifecycle list, source details                                         | Add source           | Empty, processing, ready, failed, retrying, remove confirmation |

## 10. Draft page copy

### Landing

- **Heading:** Make your sources easier to think with.
- **Supporting copy:** Bring together PDFs, lectures, websites, and notes. Ask grounded questions, keep the ideas that matter, and turn them into flash cards or a mind map.
- **Primary CTA:** Start a notebook
- **Secondary CTA:** See how it works
- **Process headings:** Gather the material · Ask across it · Keep the useful parts · Practice recall
- **Proof note:** Product screens use local demo data until retrieval and persistence are connected.

### Login

- **Heading:** Continue to your notebooks
- **Body:** Sign in with Google to open your study collections.
- **Action:** Continue with Google
- **Demo helper:** This frontend uses a local demo session. No Google account is contacted.
- **Error:** Unable to start the demo session. Try again.

### Collections

- **Heading:** Your notebooks
- **Supporting copy:** Keep each subject’s sources, questions, and study tools together.
- **Action:** Create notebook
- **Empty title:** Start with one subject
- **Empty body:** Create a notebook, then add the material you want to study.

### Chat

- **Empty title:** Add a source before you ask
- **Empty body:** Sources give this notebook the material it can use for grounded answers.
- **Action:** Add source
- **Composer label:** Ask about these sources
- **Generating:** Reading across your sources…
- **No-answer state:** These sources do not contain enough information to answer that question.
- **Failure:** Unable to generate an answer. Try again, or check whether your sources are ready.

### Memory

- **Heading:** What you’re keeping
- **Supporting copy:** Save definitions, connections, and questions worth returning to.
- **Action:** Add memory
- **Empty title:** No saved ideas yet
- **Empty body:** Save a useful answer or add a note of your own.
- **Success:** Memory saved

### Learning

- **Heading:** Practice what you’re learning
- **Supporting copy:** Turn this notebook into active-recall material without leaving your sources behind.
- **Flash-card action:** Practice flash cards
- **Mind-map action:** Open mind map
- **Insufficient-content state:** Add more ready sources before generating this study aid.

### Resources

- **Heading:** Source library
- **Supporting copy:** See what is ready, what is still processing, and what needs attention.
- **Action:** Add source
- **Retry action:** Retry processing
- **Failure:** This source could not be processed. Retry it, edit the source, or remove it.
- **Remove confirmation:** Remove this source? It will no longer be available to this notebook’s chat or study tools.

## 11. Content voice and terminology

**Voice:** Considered, direct, calm, and study-minded. Warm in onboarding and empty states; neutral in routine actions; explicit in errors and deletion.

**Preferred terms**

- Notebook: user-facing workspace.
- Source: PDF, video, website, or pasted text.
- Memory: an idea intentionally retained.
- Study aid: flash cards or mind map.
- Ready / Processing / Needs attention: source statuses.

**Avoid**

- “Collection” in primary UI copy unless technical context requires it.
- “Ingest,” “embedding,” “RAG,” “context window,” or other backend vocabulary.
- “AI-powered,” “supercharge,” unsupported quality claims, fake precision, and playful error language.

Content decisions follow the installed `ux-writing-content-design` and `better-writing` guidance: verb-first actions, visible labels, outcome-specific errors, consistent flow vocabulary, and useful empty states.

## 12. Selected design recipe

**Recipe:** `stripe-press` — Warm Humanist with editorial bones.

**Why it fits**

- The product is about reading, sources, ideas, and sustained learning rather than generic AI novelty.
- Warm paper, ink, editorial serif type, and precise rules make source material feel like something to study, annotate, and keep.
- A small UI sans layer prevents the operational workspace from becoming slow or bookish.

**Adaptation boundary**

- Preserve the recipe’s warm bone ground, near-black ink, deep teal accent, serif meaning layer, hairline rules, and near-square geometry.
- Do not copy Stripe branding, book photography, layouts, or text.
- Do not use the recipe’s 1–2 second crossfades or 3D book hover inside the daily product UI; Emil and Transitions guidance takes precedence for operational motion.
- Use real product UI and user-source metadata as visual proof rather than counterfeit book imagery.

## 13. Design Read

### Public surface

```yaml
artifact: product landing page
audience: student deciding whether this will make source-heavy study easier
visual-language: warm editorial study desk
mode: redesign-overhaul / persuade
visual-variance: 7
motion-intensity: 4
information-density: 4
asset-dependence: 3
brand-fidelity: 5
```

Consequences: asymmetric first viewport, one product-workspace proof, varied section rhythm, restrained editorial reveals, no fabricated proof, and no dependency on stock imagery.

### Application surface

```yaml
artifact: multi-route learning workspace
audience: time-pressed learner completing a daily study task
visual-language: editorial source material inside a compact operational shell
mode: redesign-overhaul / operate
visual-variance: 5
motion-intensity: 3
information-density: 7
asset-dependence: 2
brand-fidelity: 5
```

Consequences: stable grid and navigation, compact controls, strong reading hierarchy, experimentation concentrated in source/reading treatments, and almost no decorative movement.

## 14. Visual direction

**Name:** The Study Desk

- Warm paper ground and ink-led hierarchy rather than white SaaS cards.
- Source items resemble indexed reading material through typography, rules, and metadata—not fake physical-book renderings.
- One deep teal accent means “interactive or selected.” Burnt sienna is reserved for destructive/attention states and never competes with the primary action.
- Serif italics mark questions, quotations, and learned ideas; sans-serif UI labels stay compact and literal.
- The landing page opens with an asymmetrical thesis and a real application composition, not a centered gradient hero.
- The memorable signature is a “margin rail”: source references, memory actions, and learning cues align to a shared narrow column like annotations beside a text.

## 15. Typography system

| Role         | Typeface                                           | Size/line-height                            | Use                                            |
| ------------ | -------------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| Display      | Source Serif 4 Variable, 600 with selective italic | `clamp(2.75rem, 7vw, 6.5rem)` / `0.96–1.02` | Landing thesis only                            |
| Page title   | Source Serif 4 Variable, 550–600                   | `2–3rem` / `1.08`                           | Route headings                                 |
| Reading      | Source Serif 4 Variable, 400                       | `1.0625–1.1875rem` / `1.6`                  | Assistant answers, memories, long descriptions |
| UI           | Inter Variable, 450–650                            | `0.875–1rem` / `1.35–1.5`                   | Navigation, buttons, inputs, metadata          |
| Caption/data | Inter Variable, 500 with tabular numerals          | `0.75–0.8125rem` / `1.4`                    | Status, counts, timestamps                     |

- Headings use `text-wrap: balance`; descriptions use `text-wrap: pretty`.
- Reading measure is capped at `68ch`.
- Mobile inputs remain at least `16px` to avoid iOS zoom.
- No weight below 400 is used under 18px.

## 16. OKLCH color system

### Light

| Semantic role    | OKLCH                         | Hex reference | Verified contrast |
| ---------------- | ----------------------------- | ------------- | ----------------- |
| Ground           | `oklch(0.9432 0.0194 90.55)`  | `#F1ECDE`     | —                 |
| Surface          | `oklch(0.8961 0.0338 88.07)`  | `#E6DCC4`     | —                 |
| Ink              | `oklch(0.2170 0.0038 106.71)` | `#1A1A18`     | 14.77:1 on Ground |
| Muted ink        | `oklch(0.5035 0.0284 91.78)`  | `#6A6452`     | 5.00:1 on Ground  |
| Interactive teal | `oklch(0.3872 0.0569 221.89)` | `#1B4B5A`     | 8.09:1 on Ground  |
| Teal foreground  | `oklch(1 0 0)`                | `#FFFFFF`     | 9.54:1 on teal    |
| Attention sienna | `oklch(0.5131 0.1232 40.25)`  | `#A04A2A`     | 5.07:1 on Ground  |
| Hairline         | `oklch(0.8028 0.0372 89.47)`  | `#C8BEA4`     | Structural only   |

### Dark

| Semantic role    | OKLCH                         | Hex reference | Verified contrast |
| ---------------- | ----------------------------- | ------------- | ----------------- |
| Ground           | `oklch(0.2138 0.0060 156.68)` | `#171A18`     | —                 |
| Surface          | `oklch(0.2676 0.0135 163.74)` | `#202824`     | —                 |
| Ink              | `oklch(0.9432 0.0194 90.55)`  | `#F1ECDE`     | 14.86:1 on Ground |
| Muted ink        | `oklch(0.7615 0.0292 88.78)`  | `#B9B19D`     | 8.22:1 on Ground  |
| Interactive teal | `oklch(0.7049 0.0539 214.95)` | `#79A9B5`     | 6.81:1 on Ground  |

All values remain semantic tokens. Components do not reference primitive colors directly. Final rendered contrast must be remeasured because opacity and layered backgrounds can change the effective pair.

## 17. Spacing system

- Core scale: `4, 8, 12, 16, 24, 32, 48, 64, 96px`.
- Component interiors primarily use `8/12/16`.
- Group gaps are at least twice their internal gaps.
- Page gutters: `16px` mobile, `24px` tablet, `32–48px` desktop.
- Reading layouts use wider section pauses; operational lists remain compact.

## 18. Radius and border system

- Content surfaces and cards: `0px` radius.
- Inputs, buttons, and compact overlays: `2px` radius for tactile distinction without soft-card drift.
- Status badges may use `999px` only when the shape communicates status or count.
- Structural borders: one-pixel warm hairlines.
- Focus: a two-pixel high-contrast ring with a two-pixel offset; preserved in forced-colors mode.
- Space and alignment group content before borders are introduced.

## 19. Shadow and elevation system

- Default content surfaces: no shadow.
- Sticky navigation: hairline divider, no floating shadow.
- Dialog/sheet: `0 16px 40px oklch(0.217 0.004 106.7 / 0.16)`.
- Source/document object used in marketing proof only: `0 24px 48px oklch(0.217 0.004 106.7 / 0.18)`.
- Focus, selection, and status use outlines/fills—not elevation.

## 20. Component inventory

### Shared shell

- Text wordmark, skip link, application rail, collection switcher, route tabs, breadcrumb, account menu, theme control, mobile bottom navigation.

### Collections

- Notebook row/cover, recent-activity list, create/rename form, delete confirmation, collection search, skeleton rows.

### Chat

- Source context rail, transcript, user/assistant messages, citation marker, question composer, suggested questions, generating and failure notices.

### Resources

- Source intake dialog, type choices, file input, URL/text forms, lifecycle row, status marker, filter controls, source detail sheet, retry/remove actions.

### Memory

- Memory list, search/filter, memory editor, source provenance, save status, delete confirmation.

### Learning

- Study-mode chooser, flash-card deck, reveal control, confidence controls, mind-map canvas/list fallback, generation status, insufficient-content state.

### Feedback and states

- Inline field errors, persistent status region, skeleton, empty state, retry state, toast, confirmation dialog, offline banner, demo-data notice.

## 21. Responsive behavior

| Width  | Behavior                                                                                     |
| ------ | -------------------------------------------------------------------------------------------- |
| `375`  | Single column; bottom collection nav; sources in sheet; composer respects keyboard/safe area |
| `768`  | Compact rail; one primary pane; context opens as overlay                                     |
| `1024` | Two-pane workspace; rail collapsed; no critical action below clipped pane                    |
| `1280` | Full rail plus primary content and optional source/margin rail                               |
| `1440` | Stable three-region grid with capped reading measure                                         |
| `1920` | Content width remains capped; whitespace expands, not line length                            |

- Breakpoints will be placed where the content stops fitting, then verified at the required widths.
- Logical properties support future RTL mirroring.
- Text containers have no fixed height; long titles wrap or expose their full value.
- Touch targets aim for 44×44px; dense desktop controls remain at least 40×40px where possible and never below the WCAG 24×24 baseline.

## 22. Motion plan

Motion is restrained because the application is used repeatedly.

| Moment               | Purpose                  | Recipe                                                                              |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| Button press         | Feedback                 | `scale(0.96)`, transform only, `120ms`                                              |
| Dialog open/close    | Spatial/state continuity | Transitions modal: scale from `0.96` + opacity, `250ms` open / `150ms` close        |
| Source/context panel | Spatial consistency      | Transform + opacity, `250ms`, strong ease-out                                       |
| Icon state swap      | State indication         | Opacity/scale/blur, `250ms`                                                         |
| Skeleton to content  | Prevent jarring change   | Crossfade/blur, `400ms`; no position shift                                          |
| Toast                | Feedback                 | Rise/fade, `350ms` close budget; remains persistent when actionable/error           |
| Landing thesis       | Hierarchy                | One first-load text sequence, maximum `500ms`, no content hidden if animation fails |

- Shared motion tokens come from Transitions-dev.
- No `transition: all`, layout-property animation, `ease-in` UI entrance, bouncy daily controls, decorative image scaling, or keyboard-triggered navigation animation.
- Reduced motion removes translation/scale and retains brief opacity/color feedback.
- Hover motion is gated to fine pointers.

## 23. Asset plan

- No stock photos, fake testimonials, fake logos, fake citations, or CSS counterfeit illustrations.
- Landing proof uses the actual implemented workspace with seeded demo content.
- Source thumbnails derive from source type, title, and metadata rather than invented cover art.
- Use Lucide consistently at one stroke-weight policy.
- Use the text wordmark “Notebook LLM” until a real logo or approved mark exists.
- Proposed new local font asset/dependency: Source Serif 4 Variable.
- Favicon and social card will use the approved wordmark system after approval; current Vite assets will be removed.

## 24. Feature-based folder structure

```text
src/
├── components/
│   ├── shared/
│   └── ui/
├── features/
│   ├── marketing/components/
│   ├── auth/{components,hooks,api,types}/
│   ├── collections/{components,hooks,api,types,utils}/
│   ├── workspace/components/
│   ├── chat/{components,hooks,api,types,utils}/
│   ├── memory/{components,hooks,api,types}/
│   ├── learning/{components,hooks,api,types,utils}/
│   └── resources/{components,hooks,api,types,utils}/
├── hooks/
├── lib/
├── routes/
└── types/
```

Shared UI primitives remain under `src/components/ui`. Existing chat/source code will be migrated in focused steps rather than deleted wholesale.

## 25. Dependency list

### Keep

- React, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui, Base UI, Lucide React, Sonner, and existing utility packages.

### Proposed addition requiring approval

- `@fontsource-variable/source-serif-4`: bundles the approved display/reading face locally and avoids runtime font-network dependency.

### No planned additions

- No motion library, chart library, state library, or new component system. CSS transitions and current primitives are sufficient.

## 26. Pre-implementation recipe self-score

This score evaluates the proposal, not an unbuilt interface.

| Dimension             |      Score | Reason                                                                     |
| --------------------- | ---------: | -------------------------------------------------------------------------- |
| Philosophy alignment  |       8/10 | Source material and reading drive the visual system                        |
| Visual hierarchy      |       8/10 | Serif meaning layer and compact UI layer have distinct jobs                |
| Craft system          |       8/10 | Tokens, spacing, geometry, and semantic color are explicit                 |
| Functional fit        |       9/10 | Operational density and motion restraint override decorative recipe traits |
| Originality           |       8/10 | Warm editorial learning direction avoids generic AI-tool styling           |
| **Projected overall** | **8.2/10** | Must be rescored from rendered evidence after implementation               |

## 27. Open questions and risks

1. Primary student persona is inferred, not confirmed.
2. “Notebook LLM” is a working name; no rename or logo is approved.
3. Google sign-in, persistence, retrieval, citation, upload, processing, and generation remain mocks without backend contracts.
4. Adding Source Serif 4 requires dependency approval.
5. `/chat` compatibility redirect and the new route tree require explicit route approval.
6. Browser screenshots and interaction audit are currently blocked by local port permissions and missing Python Playwright; success cannot be claimed until real interaction evidence exists.
7. Tastemaker and landing-page-conversion-audit are unavailable and are skipped under the user’s explicit instruction. Their missing outputs will not be claimed.
8. Existing lint/build failures must be fixed without broad changes to untouched shadcn primitives.

## Migration plan

1. Fix the pre-existing build blocker and sparse Vite plugin entry; isolate or configure known generated-component lint rules without hiding new errors.
2. Add the approved font dependency and establish semantic design/motion tokens.
3. Build the shared route shell and mock query layer.
4. Add landing, login, collections, and collection routing while preserving `/chat` compatibility.
5. Migrate source/chat state into feature modules and collection context.
6. Add Memory, Learning, and Resources with complete mock state coverage.
7. Add responsive behavior, keyboard/focus behavior, and reduced-motion treatment.
8. Run typecheck, lint, build, mechanical design detector, domain reviews, screenshots, interactions, and UX audit; fix all Critical/High findings.

## Before-and-after success criteria

| Before                                  | Approved success state                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Placeholder `/`                         | Purposeful landing page with truthful product argument and working navigation   |
| One partial `/chat` route               | Complete approved sitemap with compatibility redirect                           |
| Hard-coded/local component state        | Coherent mock query layer with loading/error/retry/success variants             |
| Generic neutral starter                 | Documented warm editorial system with consistent tokens and responsive behavior |
| Source-only workflow                    | Collection, chat, memory, learning, and resources workflows                     |
| Unreachable/unverified browser baseline | Real interaction manifest and screenshots when environment permits              |
| Existing lint/build failures            | Typecheck, lint, and production build passing for the final worktree            |
| No formal audit                         | No unresolved Critical or High findings; remaining Medium/Low items documented  |

## Approval request

Do you approve the sitemap, content direction, visual direction, design system, route migration, and Source Serif 4 dependency so implementation can begin?
