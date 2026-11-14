import { completionCode, uid } from '../lib/ids'
import type { ActionLogEntry, DesignElement } from '../lib/types'

/**
 * Participant session persistence — PREVIEW IMPLEMENTATION.
 *
 * In this build drafts and submissions are kept in the participant's browser
 * (localStorage) so a refresh restores work and a second submit is blocked.
 * Milestone 2 moves this to the server: POST /api/sessions on entry,
 * PUT /api/sessions/:id/draft for autosave, POST /api/sessions/:id/submit with
 * the PNG (stored in Netlify Blobs) and an idempotency key.
 */
const key = (code: string, pid: string, kind: string) => `vds:${kind}:${code}:${pid}`

export function resolveParticipantId(code: string, fromUrl: string | null): string {
  if (fromUrl && /^[\w\-.]{1,80}$/.test(fromUrl)) return fromUrl
  const k = `vds:anon:${code}`
  const existing = localStorage.getItem(k)
  if (existing) return existing
  const id = uid('anon')
  localStorage.setItem(k, id)
  return id
}

export interface Draft {
  elements: DesignElement[]
  imageUrl?: string
  background: string
  log: ActionLogEntry[]
  startedAt: string
  prompt?: string
  generationsUsed?: number
}

export function loadDraft(code: string, pid: string): Draft | null {
  try {
    const raw = localStorage.getItem(key(code, pid, 'draft'))
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

export function saveDraft(code: string, pid: string, draft: Draft) {
  try {
    localStorage.setItem(key(code, pid, 'draft'), JSON.stringify(draft))
  } catch {
    /* storage full or disabled — the editor keeps working in memory */
  }
}

export interface Submission { code: string; submittedAt: string; pngDataUrl: string }

export function getSubmission(code: string, pid: string): Submission | null {
  try {
    const raw = localStorage.getItem(key(code, pid, 'done'))
    return raw ? (JSON.parse(raw) as Submission) : null
  } catch {
    return null
  }
}

export async function submitDesign(code: string, pid: string, png: Blob): Promise<Submission> {
  const existing = getSubmission(code, pid)
  if (existing) return existing // idempotent: never create a second record
  const pngDataUrl = await new Promise<string>((resolve) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.readAsDataURL(png)
  })
  const sub: Submission = { code: completionCode(), submittedAt: new Date().toISOString(), pngDataUrl }
  try {
    localStorage.setItem(key(code, pid, 'done'), JSON.stringify(sub))
  } catch {
    localStorage.setItem(key(code, pid, 'done'), JSON.stringify({ ...sub, pngDataUrl: '' }))
  }
  return sub
}
