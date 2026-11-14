/**
 * SAMPLE DATA — the single place where the product surface reads stubbed data.
 *
 * Every screen gets experiments / sessions through the functions at the bottom
 * of this file. When the real API lands (see PLAN.md), replace these functions
 * with fetch calls; the shapes match the types in src/lib/types.ts.
 */
import { DEFAULT_PALETTE } from '../lib/palette'
import { ALL_SHAPE_TYPES } from '../lib/shapes'
import type { ActionLogEntry, DesignElement, ExperimentConfig, ParticipantSession } from '../lib/types'

const P = Object.fromEntries(DEFAULT_PALETTE.map((c) => [c.name.toLowerCase(), c.hex])) as Record<string, string>

export const experiments: ExperimentConfig[] = [
  {
    id: 'exp-01',
    name: 'Experiment 01 · Brand poster',
    version: 2,
    status: 'published',
    canvas: { presetId: 'square-post', width: 1080, height: 1080, background: '#FFFFFF' },
    allowBackgroundChange: false,
    allowedShapes: ALL_SHAPE_TYPES,
    palette: DEFAULT_PALETTE,
    maxElements: 60,
    humanTimeLimitSec: null,
    aiGenerationLimit: 1,
    ai: { method: 'image', model: 'openai/gpt-image-2', temperature: 1, technicalRetries: 1 },
    returnUrl: 'https://example.qualtrics.com/jfe/form/SV_sample?vds_code={code}',
    links: { human: 'h7k2m9', ai: 'a3p8x4' },
    createdAt: '2026-10-28T09:12:00Z',
    updatedAt: '2026-11-03T14:40:00Z',
  },
  {
    id: 'exp-02',
    name: 'Experiment 02 · Phone wallpaper',
    version: 1,
    status: 'published',
    canvas: { presetId: 'phone-wallpaper', width: 1080, height: 1920, background: '#2C3E50' },
    allowBackgroundChange: true,
    allowedShapes: ['circle', 'square', 'triangle', 'hexagon', 'star', 'line', 'curve'],
    palette: DEFAULT_PALETTE.filter((c) => ['Orange', 'Yellow', 'Teal', 'Blue', 'Navy', 'Pink', 'White'].includes(c.name)),
    maxElements: 40,
    humanTimeLimitSec: 600,
    aiGenerationLimit: 1,
    ai: { method: 'image', model: 'openai/gpt-image-2', temperature: 1, technicalRetries: 1 },
    returnUrl: '',
    links: { human: 'w5n1q6', ai: 'w9r2c7' },
    createdAt: '2026-11-04T10:00:00Z',
    updatedAt: '2026-11-04T10:00:00Z',
  },
  {
    id: 'exp-03',
    name: 'Experiment 03 · Landscape banner',
    version: 1,
    status: 'draft',
    canvas: { presetId: 'landscape-post', width: 1200, height: 675, background: '#FFFFFF' },
    allowBackgroundChange: false,
    allowedShapes: ALL_SHAPE_TYPES,
    palette: DEFAULT_PALETTE,
    maxElements: 60,
    humanTimeLimitSec: null,
    aiGenerationLimit: 1,
    ai: { method: 'image', model: 'gemini-3-pro-image', temperature: 1, technicalRetries: 1 },
    returnUrl: '',
    links: { human: 'b4t6v1', ai: 'b8j3z5' },
    createdAt: '2026-11-09T16:22:00Z',
    updatedAt: '2026-11-10T08:05:00Z',
  },
]

const el = (id: string, type: DesignElement['type'], x: number, y: number, width: number, height: number, fill: string, rotation = 0): DesignElement =>
  ({ id, type, x, y, width, height, fill, rotation })

const designs: Record<string, DesignElement[]> = {
  sunrise: [
    el('a1', 'semicircle', 540, 610, 640, 320, P.orange),
    el('a2', 'circle', 540, 470, 240, 240, P.yellow),
    el('a3', 'rectangle', 540, 860, 1080, 440, P.navy),
    el('a4', 'triangle', 300, 700, 380, 300, P.teal),
    el('a5', 'triangle', 760, 690, 460, 340, P.green),
    el('a6', 'line', 540, 640, 900, 39, P.white),
    el('a7', 'star', 210, 220, 70, 70, P.orange, 12),
    el('a8', 'star', 880, 180, 50, 50, P.orange, -8),
  ],
  geometric: [
    el('b1', 'hexagon', 380, 400, 360, 360, P.blue, 10),
    el('b2', 'circle', 660, 520, 300, 300, P.pink),
    el('b3', 'square', 520, 760, 200, 200, P.yellow, 45),
    el('b4', 'cross', 840, 240, 140, 140, P.navy, 20),
    el('b5', 'arrow', 300, 860, 320, 47, P.black, -20),
    el('b6', 'diamond', 200, 640, 110, 150, P.purple),
    el('b7', 'curve', 760, 860, 360, 150, P.teal),
  ],
  heart: [
    el('c1', 'circle', 540, 540, 760, 760, P.pink),
    el('c2', 'heart', 540, 560, 420, 380, P.white),
    el('c3', 'heart', 540, 560, 220, 200, P.red),
    el('c4', 'star', 250, 260, 90, 90, P.yellow, -15),
    el('c5', 'star', 840, 280, 70, 70, P.yellow, 10),
    el('c6', 'star', 820, 820, 100, 100, P.yellow, 25),
  ],
  wallpaper: [
    el('d1', 'circle', 540, 640, 620, 620, P.orange),
    el('d2', 'circle', 540, 640, 420, 420, P.yellow),
    el('d3', 'hexagon', 300, 1400, 260, 260, P.teal, 15),
    el('d4', 'hexagon', 780, 1500, 340, 340, P.blue, -10),
    el('d5', 'curve', 540, 1120, 900, 200, P.white),
    el('d6', 'star', 200, 280, 80, 80, P.white),
    el('d7', 'star', 880, 360, 60, 60, P.white),
    el('d8', 'triangle', 540, 1720, 300, 240, P.pink),
  ],
  minimal: [
    el('e1', 'rectangle', 540, 540, 700, 700, P.navy),
    el('e2', 'circle', 540, 460, 320, 320, P.red),
    el('e3', 'line', 540, 780, 460, 39, P.white),
    el('e4', 'line', 540, 840, 300, 39, P.gray),
  ],
}

function humanLog(startIso: string, elements: DesignElement[]): ActionLogEntry[] {
  const start = new Date(startIso).getTime()
  const out: ActionLogEntry[] = []
  let t = 4000
  elements.forEach((e, i) => {
    const push = (entry: Omit<ActionLogEntry, 'at' | 'elapsedMs'>) => {
      t += 2500 + ((i * 7919 + out.length * 104729) % 9000)
      out.push({ ...entry, at: new Date(start + t).toISOString(), elapsedMs: t })
    }
    push({ action: 'add', elementId: e.id, shape: e.type, params: { x: 540, y: 540 }, elementCount: i + 1 })
    push({ action: 'move', elementId: e.id, shape: e.type, params: { from: { x: 540, y: 540 }, to: { x: e.x, y: e.y } }, elementCount: i + 1 })
    push({ action: 'resize', elementId: e.id, shape: e.type, params: { from: { width: 270, height: 270 }, to: { width: e.width, height: e.height } }, elementCount: i + 1 })
    if (e.rotation) push({ action: 'rotate', elementId: e.id, shape: e.type, params: { from: 0, to: e.rotation }, elementCount: i + 1 })
    push({ action: 'color', elementId: e.id, shape: e.type, params: { from: P.red, to: e.fill }, elementCount: i + 1 })
  })
  t += 6000
  out.push({ action: 'submit', at: new Date(start + t).toISOString(), elapsedMs: t, elementCount: elements.length })
  return out
}

export const sessions: ParticipantSession[] = [
  {
    id: 'ses_01', participantId: 'R_3Fq8sK2LmP0aXy1', experimentId: 'exp-01', experimentVersion: 2, condition: 'human',
    startedAt: '2026-11-05T09:02:11Z', submittedAt: '2026-11-05T09:11:48Z', status: 'submitted', completionCode: 'VDS-K7QM-2XRP',
    elements: designs.sunrise, background: '#FFFFFF', actionLog: humanLog('2026-11-05T09:02:11Z', designs.sunrise), aiGenerations: [],
  },
  {
    id: 'ses_02', participantId: 'R_1bN4vT9eWq6cZo2', experimentId: 'exp-01', experimentVersion: 2, condition: 'ai',
    startedAt: '2026-11-05T09:20:40Z', submittedAt: '2026-11-05T09:23:02Z', status: 'submitted', completionCode: 'VDS-3HZT-9WLA',
    elements: designs.geometric, background: '#FFFFFF', actionLog: [],
    aiGenerations: [{
      id: 'gen_01', prompt: 'Design a bold, modern poster for a new coffee brand called "Orbit". Use playful geometric shapes and warm energetic colours.',
      method: 'structured', model: 'gemini-3.1-pro-preview', modelVersion: 'gemini-3.1-pro-preview', parameters: { temperature: 0.7, responseFormat: 'json_schema' },
      requestedAt: '2026-11-05T09:21:30.120Z', respondedAt: '2026-11-05T09:21:41.882Z', success: true, failureReason: null, retries: 0,
      rawOutput: JSON.stringify({ elements: designs.geometric.map(({ id: _id, ...rest }) => rest) }, null, 2),
      validation: { passed: true, issues: [] },
    }],
  },
  {
    id: 'ses_03', participantId: 'R_9xC2pL7hDf3gUe8', experimentId: 'exp-01', experimentVersion: 2, condition: 'human',
    startedAt: '2026-11-05T10:15:03Z', submittedAt: '2026-11-05T10:29:51Z', status: 'submitted', completionCode: 'VDS-P4MV-8NCE',
    elements: designs.heart, background: '#FFFFFF', actionLog: humanLog('2026-11-05T10:15:03Z', designs.heart), aiGenerations: [],
  },
  {
    id: 'ses_04', participantId: 'R_6tY0rB5nKj8sMa4', experimentId: 'exp-01', experimentVersion: 2, condition: 'ai',
    startedAt: '2026-11-05T11:02:44Z', submittedAt: '2026-11-05T11:05:10Z', status: 'submitted', completionCode: 'VDS-6RJD-T2GY',
    elements: designs.minimal, background: '#FFFFFF', actionLog: [],
    aiGenerations: [{
      id: 'gen_02', prompt: '为一个极简风格的音乐节设计海报，使用深色背景和一个红色的圆形作为视觉中心。',
      method: 'structured', model: 'gemini-3.1-pro-preview', modelVersion: 'gemini-3.1-pro-preview', parameters: { temperature: 0.7, responseFormat: 'json_schema' },
      requestedAt: '2026-11-05T11:03:12.400Z', respondedAt: '2026-11-05T11:03:31.015Z', success: true, failureReason: null, retries: 1,
      rawOutput: JSON.stringify({ elements: designs.minimal.map(({ id: _id, ...rest }) => rest) }, null, 2),
      validation: { passed: true, issues: ['Attempt 1 rejected: colour #C0392B is not in the experiment palette (logged, retried as a technical failure)'] },
    }],
  },
  {
    id: 'ses_05', participantId: 'R_2mW7qE4zXc1vBn5', experimentId: 'exp-02', experimentVersion: 1, condition: 'human',
    startedAt: '2026-11-06T13:40:00Z', submittedAt: '2026-11-06T13:49:12Z', status: 'submitted', completionCode: 'VDS-Z8LA-4QKP',
    elements: designs.wallpaper, background: '#2C3E50', actionLog: humanLog('2026-11-06T13:40:00Z', designs.wallpaper), aiGenerations: [],
  },
  {
    id: 'ses_06', participantId: 'R_8kH3jG6fSd2aPo9', experimentId: 'exp-02', experimentVersion: 1, condition: 'ai',
    startedAt: '2026-11-06T14:02:19Z', submittedAt: null, status: 'abandoned', completionCode: null,
    elements: [], background: '#2C3E50', actionLog: [],
    aiGenerations: [{
      id: 'gen_03', prompt: 'A calm night-sky wallpaper with a big moon and soft hills',
      method: 'structured', model: 'claude-sonnet-5-5', modelVersion: 'claude-sonnet-5-5', parameters: { temperature: 0.8 },
      requestedAt: '2026-11-06T14:03:01.000Z', respondedAt: null, success: false, failureReason: 'Upstream timeout after 3 attempts', retries: 2,
      rawOutput: '', validation: { passed: false, issues: [] },
    }],
  },
  {
    id: 'ses_07', participantId: 'R_4pQ1wE8rTy5uIo3', experimentId: 'exp-01', experimentVersion: 2, condition: 'human',
    startedAt: '2026-11-10T08:30:00Z', submittedAt: null, status: 'in_progress', completionCode: null,
    elements: designs.minimal.slice(0, 2), background: '#FFFFFF', actionLog: humanLog('2026-11-10T08:30:00Z', designs.minimal.slice(0, 2)).slice(0, -1), aiGenerations: [],
  },
]

/** A sample layout shown in the AI editor preview until the model connection is live. */
export const sampleAiLayout = designs.geometric

// ---- Access functions (swap for API calls) --------------------------------

export function getExperiment(id: string) {
  return experiments.find((e) => e.id === id) ?? null
}

export function resolveLink(code: string) {
  for (const exp of experiments) {
    if (exp.links.human === code) return { experiment: exp, condition: 'human' as const }
    if (exp.links.ai === code) return { experiment: exp, condition: 'ai' as const }
  }
  return null
}

export function getSessions(experimentId?: string) {
  return experimentId ? sessions.filter((s) => s.experimentId === experimentId) : sessions
}

export function getSession(id: string) {
  return sessions.find((s) => s.id === id) ?? null
}
