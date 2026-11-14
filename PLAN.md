# Visual Design Studio — Product Roadmap

Visual Design Studio is an experimental online design platform for consumer-behaviour research comparing
**Human Design** (participants build with a controlled shape/colour library) and **AI Design** (participants
type their own instructions and a real model composes a design from the same library).

The work is split into self-contained milestones. Each one ships something usable.

---

## Milestone 1 — Product surface ✅ (built)

- Landing page for researchers, with links to preview both conditions.
- **Human Design editor**, fully interactive: 16 vector shapes, 12-colour palette popover, add, move,
  8-point resize (rotation-aware), free rotation (Shift snaps to 15°), duplicate, delete, undo/redo,
  bring forward/send backward, keyboard shortcuts, element limit with a friendly message, optional
  countdown, auto-fit canvas, PNG export at the native canvas size, action log captured in memory.
- **AI Design editor**: same frame, read-only shape/colour library, "Describe Your Design" prompt box,
  Generate button with status, error and limit states, result preview. **Generation is a labelled sample
  layout — no model is called yet.**
- Participant entry `/s/:code?pid=…`: opaque link code fixes experiment and condition; completion
  screen with code and optional survey return URL. Drafts and the duplicate-submit guard currently live in
  browser storage.
- Researcher console (preview sign-in): experiment list, full configuration editor (presets + custom
  size, background, shape toggles, editable palette, limits, AI method/model, return URL, study links,
  version-lock warning), participants table with **working CSV export**, session detail with action log,
  AI record, design JSON and PNG download.
- All sample data lives in `src/fixtures/index.ts`.

## Milestone 2 — Data model, sessions and researcher auth

- Add a Netlify Server (`netlify/server/index.mjs`, Hono or Express) owning `/api/*`.
- Netlify Database (Postgres + Drizzle) schema: `experiments`, `experiment_versions` (immutable once
  published), `study_links`, `sessions`, `action_events`, `ai_generations`, `submissions`.
- Netlify Blobs store for submitted PNGs (keyed by session id).
- Netlify Identity for researchers (role `researcher`), checked on every `/api/admin/*` route.
- Endpoints: `POST /api/sessions` (resolve link code → version + condition, create or resume session by
  pid), `PUT /api/sessions/:id/draft` (autosave + batched action log), `POST /api/sessions/:id/submit`
  (idempotency key, server-side validation of shapes/colours/limit/condition, PNG to Blobs, completion code).
- Swap `src/fixtures` and `src/services/session.ts` for API calls. Persist experiment edits; publishing
  with changed rules creates a new version.

## Milestone 3 — Real AI structured generation

- `POST /api/sessions/:id/generate` (AI condition only, enforced server-side; Human sessions get 403).
- Call the configured model through Netlify AI Gateway with: raw prompt, canvas size, allowed shapes,
  allowed HEX colours, element limit, rules (no text/images/gradients). JSON-schema structured output.
- Strict validator: shape whitelist, palette whitelist, numeric bounds, count limit, within canvas.
  Invalid output is **rejected and logged** (never silently fixed), then retried up to the technical-retry
  limit. Only successful generations count against the participant's limit.
- Store prompt, model, version, parameters, request/response timestamps, raw output, validation result,
  failure reason and retries. Replace `src/services/ai.ts` with the API call and remove the sample notice.

## Milestone 4 — Exports and archive

- Server-side CSV export (sessions, action events, AI generations as separate files).
- "Download All Designs" ZIP from Blobs, files named `<participantId>_<condition>.png`.
- JSON backup of an experiment's full data.

## Milestone 5 — Direct text-to-image method (optional condition)

- Second generation adapter using a Gemini image model through AI Gateway; result saved to Blobs.
- Clearly labelled as "Direct text-to-image" everywhere (config, records, exports).

## Milestone 6 — Polish

- Chinese UI option for the researcher console.
- Researcher-side replay of a Human session from its action log.
- Accessibility pass, small-laptop layout tuning, end-to-end tests for both conditions.
