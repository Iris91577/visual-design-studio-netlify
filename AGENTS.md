# AGENTS.md

Guidance for AI agents working on Visual Design Studio. **Read PLAN.md first.** It is the roadmap.
Milestone 1 (the product surface) is done. Continue with the next unfinished milestone.

## Architecture

- Vite + React 19 + TypeScript SPA (`src/`), Tailwind v4 (theme tokens in `src/index.css`).
- No full-stack framework, **on purpose**: the backend will be a **Netlify Server** at
  `netlify/server/index.mjs` owning `/api/*`. A framework's catch-all function would take its traffic.
- `netlify.toml` rewrites only `/s/*`, `/admin*` and `/demo/*` to `index.html`. **Do not add a `/*`
  catch-all**, because it would shadow the server.

## Key directories

- `src/lib/`: domain model. `types.ts` (all shared types), `shapes.ts` (16-shape catalog + geometry →
  SVG primitives), `render.ts` (SVG string + PNG export at native size; colours are sanitised),
  `palette.ts`, `canvasPresets.ts`, `aiModels.ts`, `exportCsv.ts`.
- `src/editor/`: the editor. `useEditor.ts` (state, undo/redo history, gesture commit, action log),
  `DesignCanvas.tsx` (interactive SVG: move / 8-handle resize / rotate, auto-fit), `EditorShell.tsx`
  (frame shared by both conditions), `HumanEditor.tsx`, `AiEditor.tsx`, `SubmitFlow.tsx`.
- `src/pages/`: `Landing`, `Participant` (study link + researcher preview), `admin/*`.
- `src/fixtures/index.ts`: **the only source of stubbed data**. Swap its access functions for API calls.
- `src/services/ai.ts`: generation boundary (currently returns a labelled sample, `source: 'preview-sample'`).
- `src/services/session.ts`: participant draft/submit, currently browser storage (to be replaced by the API).
- `src/pages/admin/AdminLayout.tsx`: preview sign-in gate (to be replaced by Netlify Identity).

## Conventions and non-obvious decisions

- Element coordinates are canvas pixels, with `x/y` as the **centre**, plus `rotation` in degrees. Lines use
  `fill` as stroke colour, and stroke weight comes from `lineWeight(canvasW, canvasH)`.
- Human and AI must render through `shapePrimitives()` so both conditions share one drawing system.
  Never emit text, images, gradients, filters or opacity.
- Both editors use `EditorShell` to keep the interface visually identical between conditions.
- Link codes are opaque per condition (`links.human` / `links.ai`), so participants can't switch
  condition by editing the URL. The server must enforce the condition too.
- Published experiment versions are immutable. Changing canvas, shapes, palette or limit creates a new version.
- AI output must be validated server-side. Invalid output is rejected and logged, **never silently
  corrected**. Only successful generations count toward the participant limit. Never auto-fill or
  auto-send a prompt.
- Do not claim AI generation is real until `src/services/ai.ts` calls the server and the sample notice in
  `AiEditor.tsx` is removed.
- Keep edits minimal. Use the dedicated components in `src/components/ui.tsx`.
