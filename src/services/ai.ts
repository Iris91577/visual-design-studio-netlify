import type { DesignElement, ExperimentConfig } from '../lib/types'

export interface GenerationResult {
  source: 'model'
  elements: DesignElement[]
  imageUrl: string
  model: string
  requestedAt: string
  respondedAt: string
}

/**
 * Generation boundary for the AI Design editor.
 *
 * The API route is owned by a Netlify Function. The browser receives neither
 * the model-provider credentials nor the study's hidden generation rules.
 */
export async function generateDesign(prompt: string, config: ExperimentConfig): Promise<GenerationResult> {
  const requestedAt = new Date().toISOString()
  if (!prompt.trim()) throw new Error('Please describe your design before generating.')
  if (config.ai.method !== 'image') throw new Error('This experiment is not configured for direct text-to-image generation.')

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt.trim(),
      canvas: { width: config.canvas.width, height: config.canvas.height },
    }),
  })
  const payload = await response.json().catch(() => ({})) as { imageUrl?: string; model?: string; error?: string }
  if (!response.ok || !payload.imageUrl) throw new Error(payload.error || 'The image service did not return an image.')

  return {
    source: 'model',
    elements: [],
    imageUrl: payload.imageUrl,
    model: payload.model || config.ai.model,
    requestedAt,
    respondedAt: new Date().toISOString(),
  }
}
