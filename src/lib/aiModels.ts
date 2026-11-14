import type { GenerationMethod } from './types'

export interface AiModelOption {
  id: string
  label: string
  provider: 'Anthropic' | 'Google' | 'OpenAI'
  method: GenerationMethod
}

/**
 * Models offered in the experiment editor. "structured" models return design
 * parameters rendered with the shared shape library; "image" models return a
 * bitmap directly (text-to-image). The two are always labelled separately.
 */
export const AI_MODELS: AiModelOption[] = [
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', provider: 'Anthropic', method: 'structured' },
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', provider: 'Anthropic', method: 'structured' },
  { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro', provider: 'Google', method: 'structured' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', provider: 'Google', method: 'structured' },
  { id: 'gpt-5', label: 'GPT-5', provider: 'OpenAI', method: 'structured' },
  { id: 'openai/gpt-image-2', label: 'GPT Image 2 (Cloudflare)', provider: 'OpenAI', method: 'image' },
  { id: 'gemini-3-pro-image', label: 'Gemini 3 Pro Image', provider: 'Google', method: 'image' },
  { id: 'gemini-3.1-flash-image', label: 'Gemini 3.1 Flash Image', provider: 'Google', method: 'image' },
]

export const METHOD_LABELS: Record<GenerationMethod, string> = {
  structured: 'Structured shape generation',
  image: 'Direct text-to-image',
}
