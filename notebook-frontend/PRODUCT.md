# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is students preparing for exams from lecture PDFs, videos, websites, and personal notes. They may be short on time, switching between a phone and a laptop, and trying to understand or recall material rather than merely summarize it.

Secondary audiences described in the project documentation are professionals preparing for certifications, researchers comparing sources, and self-directed learners organizing a topic.

## Product Purpose

Notebook LLM gives learners one place to collect source material, ask grounded questions, keep important ideas, and study them in formats such as flash cards and mind maps.

Success means a learner can move from scattered material to a useful study session without losing the relationship between an answer and its sources.

## Positioning

The product combines source-grounded conversation with a deliberate learning loop: collect material, question it, keep useful ideas, and practice recall from the same collection.

## Operating Context

- A learner creates or returns to a collection for one subject or project.
- They add PDFs, YouTube videos, websites, or pasted text.
- They ask questions using the collection as context.
- They save useful ideas as memories.
- They generate and revisit flash cards or a mind map.
- They manage source readiness, failures, and removal from the collection.

## Capabilities and Constraints

- Existing stack: React, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui, Base UI primitives, and Lucide React.
- Existing routes are `/` and `/chat`; `/chat` currently supports local source intake, removal, and a simulated response.
- Supported source types are PDF, YouTube, website, and pasted text.
- No backend, persistent storage, retrieval service, or authentication service is present.
- Google-only authentication is intended, but must be represented as a clearly labeled mock until a real provider exists.
- Existing route behavior, source intake, and useful components must be preserved unless an approved migration replaces them.
- No fabricated testimonials, customer logos, usage metrics, citations, pricing, or model capabilities may be presented as real.

## Brand Commitments

- The current working product name is “Notebook LLM.” A rename is not approved.
- The existing voice is direct and instructional, but not yet mature enough to be binding.
- The current neutral shadcn styling is implementation evidence, not a distinctive product identity.
- The approved visual direction is “The Study Desk,” documented in `DESIGN.md` and derived from the Stripe Press warm-humanist editorial recipe.

## Evidence on Hand

- Product and route requirements: `docs/project.md`.
- Existing-site findings and verification history: `docs/baseline-audit.md`.
- Existing implementation: `src/routes`, `src/features/chat`, `src/components`, and `src/index.css`.
- No logo, brand photography, custom illustration, testimonial, usage statistic, or production API response is available.

## Product Principles

1. Keep answers visibly connected to the learner’s sources.
2. Turn understanding into recall through memories and study artifacts.
3. Make every empty, loading, failure, and recovery state teach the next useful action.
4. Preserve a learner’s sense of place across collections, sources, conversations, and study tools.
5. Prefer honest product limitations over simulated proof or unsupported claims.

## Accessibility & Inclusion

- Target WCAG 2.2 AA-aligned behavior for semantics, focus visibility, contrast, keyboard access, hit targets, reduced motion, and reflow.
- The interface must remain usable at 200% zoom and at 320 CSS pixels without horizontal page scrolling.
- Functional copy should use plain language, persistent labels, recoverable errors, and no color-only state communication.
- The interface should tolerate longer translated strings and mixed-direction source titles even though localization is not implemented yet.
