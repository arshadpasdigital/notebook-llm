# Design System

## Direction

**The Study Desk** adapts Stripe Press’s warm editorial discipline to a repeated-use learning product. Source material should feel considered and worth keeping, while navigation and controls remain compact and operational.

The public surface persuades through a clear product thesis and an honest product-workspace proof. The application surface helps a time-pressed learner complete tasks with stable structure and restrained motion.

## Design Read

| Surface     | Variance | Motion | Density | Assets | Fidelity |
| ----------- | -------: | -----: | ------: | -----: | -------: |
| Landing     |        7 |      4 |       4 |      3 |        5 |
| Application |        5 |      3 |       7 |      2 |        5 |

## Visual language

- Warm bone ground, near-black ink, deep teal interaction color, and burnt sienna only for destructive/attention states.
- Source Serif 4 is the approved display/reading face. Because the package could not be fetched in this environment, the implementation uses a production-safe local serif stack (`Iowan Old Style`, Charter, Cambria, Georgia) until that dependency is available.
- Inter carries controls, navigation, status, metadata, and dense operational content.
- Hairline rules, aligned margins, and one shared surface replace rounded-card repetition.
- The signature margin rail aligns citations, source state, memory actions, and learning cues like annotations beside a text.
- Content surfaces are square; controls use a restrained 2px radius; pills are reserved for status/count semantics.
- Real product UI and source metadata provide proof. Do not fabricate photography, logos, citations, testimonials, or metrics.

## Color tokens

### Light

| Role                   | Value                         |
| ---------------------- | ----------------------------- |
| Ground                 | `oklch(0.9432 0.0194 90.55)`  |
| Surface                | `oklch(0.8961 0.0338 88.07)`  |
| Ink                    | `oklch(0.2170 0.0038 106.71)` |
| Muted ink              | `oklch(0.5035 0.0284 91.78)`  |
| Interactive            | `oklch(0.3872 0.0569 221.89)` |
| Interactive foreground | `oklch(1 0 0)`                |
| Attention/destructive  | `oklch(0.5131 0.1232 40.25)`  |
| Hairline               | `oklch(0.8028 0.0372 89.47)`  |

### Dark

| Role        | Value                         |
| ----------- | ----------------------------- |
| Ground      | `oklch(0.2138 0.0060 156.68)` |
| Surface     | `oklch(0.2676 0.0135 163.74)` |
| Ink         | `oklch(0.9432 0.0194 90.55)`  |
| Muted ink   | `oklch(0.7615 0.0292 88.78)`  |
| Interactive | `oklch(0.7049 0.0539 214.95)` |

Components reference semantic tokens only. Rendered contrast is remeasured after implementation.

## Typography

- Display: approved Source Serif 4 Variable when available; local serif fallback today, 600, with selective italic; `clamp(2.75rem, 7vw, 6.5rem)` and `0.96–1.02` line-height.
- Page title: approved Source Serif 4 Variable when available; local serif fallback today, 550–600; `2–3rem`, `1.08` line-height.
- Reading: approved Source Serif 4 Variable when available; local serif fallback today, 400; `1.0625–1.1875rem`, `1.6` line-height, maximum `68ch`.
- UI: Inter Variable, 450–650; `0.875–1rem`, `1.35–1.5` line-height.
- Caption/data: Inter Variable, 500, tabular numerals; `0.75–0.8125rem`, `1.4` line-height.
- Balance headings, pretty-wrap descriptions, and keep mobile inputs at least 16px.

## Spacing and geometry

- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Page gutters: 16px mobile, 24px tablet, 32–48px desktop.
- Inter-group gaps are at least twice their internal gaps.
- Content surfaces: 0px radius. Controls/overlays: 2px. Semantic badges only: pill.
- Focus ring: 2px high-contrast perimeter with 2px offset and forced-colors support.

## Elevation

- Default surfaces: no shadow.
- Sticky chrome: hairline divider only.
- Dialog/sheet: `0 16px 40px oklch(0.217 0.004 106.7 / 0.16)`.
- Marketing source object only: `0 24px 48px oklch(0.217 0.004 106.7 / 0.18)`.

## Motion

- Motion communicates feedback, state, hierarchy, or spatial continuity—never decoration.
- Button press: scale 0.96, transform only, 120ms.
- Modal: scale from 0.96 plus opacity, 250ms open / 150ms close.
- Context panel/icon swap: transform/opacity, 250ms.
- Skeleton reveal: opacity/blur, 400ms with no position change.
- Landing may use one non-blocking 500ms text sequence.
- Never use `transition: all`, `scale(0)`, `ease-in` entrances, layout-property animation, ungated hover motion, or animated keyboard navigation.
- Reduced motion removes translation/scale and retains brief opacity/color feedback.

## Responsive contract

- 375: single column, bottom collection navigation, source sheet.
- 768: compact rail, one primary pane, context overlay.
- 1024: two-pane workspace, collapsed app rail.
- 1280+: full rail, primary content, optional margin/source rail.
- Reading measure remains capped at wide widths.
- No page-level horizontal scroll at 320 CSS pixels or 200% zoom.

## Content contract

- Voice is considered, direct, calm, and study-minded.
- “Notebook” is user-facing; “collection” remains the technical model.
- Errors state the problem and a next step. Empty states orient and offer one useful action.
- Avoid AI jargon, fake claims, generic SaaS buzzwords, playful error language, and unsupported proof.

## Anti-patterns

- No centered gradient hero, giant rounded cards, repeated eyebrow stacks, nested-card grids, decorative glows, glassmorphism, gradient text, fake charts, or CSS counterfeit assets.
- Do not use serif type for compact controls or dense metadata.
- Do not reproduce Stripe branding, book layouts, photography, or copy.
- Do not let editorial whitespace reduce operational scanability.
