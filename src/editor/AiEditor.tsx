import type React from 'react'
import { useMemo, useState } from 'react'
import { CircleAlert, LayoutGrid, LoaderCircle, Sparkles } from 'lucide-react'
import { Button, useToast } from '../components/ui'
import { designToPng } from '../lib/render'
import type { DesignElement, ExperimentConfig } from '../lib/types'
import { generateDesign } from '../services/ai'
import { loadDraft, saveDraft, submitDesign, type Submission } from '../services/session'
import { DesignCanvas } from './DesignCanvas'
import { EditorShell, RailItem } from './EditorShell'
import { ElementsPanel } from './ElementsPanel'
import { SubmitDialog } from './SubmitFlow'

type Status = 'idle' | 'generating' | 'done' | 'error'

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('The generated image could not be displayed.'))
    image.src = src
  })
}

export function AiEditor({
  config, linkCode, participantId, onSubmitted, headerBadge,
}: {
  config: ExperimentConfig
  linkCode: string
  participantId: string
  onSubmitted: (s: Submission) => void
  headerBadge?: React.ReactNode
}) {
  const toast = useToast()
  const draft = useMemo(() => loadDraft(linkCode, participantId), [linkCode, participantId])
  const directImage = config.ai.method === 'image'
  const [startedAt] = useState(() => draft?.startedAt ?? new Date().toISOString())
  // The prompt field always starts empty unless the participant typed into it before a refresh.
  const [prompt, setPrompt] = useState(draft?.prompt ?? '')
  // Discard layouts left by the old sample build when this experiment now uses direct images.
  const [elements, setElements] = useState<DesignElement[]>(directImage ? [] : (draft?.elements ?? []))
  const [imageUrl, setImageUrl] = useState(draft?.imageUrl ?? '')
  const [used, setUsed] = useState(directImage && !draft?.imageUrl ? 0 : (draft?.generationsUsed ?? 0))
  const [status, setStatus] = useState<Status>(directImage ? (draft?.imageUrl ? 'done' : 'idle') : (draft?.elements?.length ? 'done' : 'idle'))
  const [error, setError] = useState<string | null>(null)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const left = Math.max(0, config.aiGenerationLimit - used)
  const background = config.canvas.background

  const persist = (patch: Partial<{ prompt: string; elements: DesignElement[]; imageUrl: string; used: number }>) =>
    saveDraft(linkCode, participantId, {
      elements: patch.elements ?? elements,
      imageUrl: patch.imageUrl ?? imageUrl,
      background,
      log: [],
      startedAt,
      prompt: patch.prompt ?? prompt,
      generationsUsed: patch.used ?? used,
    })

  const generate = async () => {
    if (!prompt.trim() || left === 0 || status === 'generating') return
    setStatus('generating')
    setError(null)
    try {
      const res = await generateDesign(prompt, config)
      // Decode the returned data URL before swapping it onto the canvas. This
      // avoids a blank frame while the browser processes a large AI image.
      if (directImage) await preloadImage(res.imageUrl)
      // Only a successful generation counts against the participant's limit.
      setElements(res.elements)
      setImageUrl(res.imageUrl)
      setUsed(used + 1)
      setStatus('done')
      // localStorage is synchronous. Delay the large Base64 write so React and
      // the browser can paint the generated image first.
      window.setTimeout(() => {
        persist({ elements: res.elements, imageUrl: res.imageUrl, used: used + 1 })
      }, 500)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'The design service could not be reached.')
    }
  }

  const doSubmit = async () => {
    setBusy(true)
    try {
      const output = directImage
        ? await fetch(imageUrl).then((response) => {
            if (!response.ok) throw new Error('The generated image could not be downloaded')
            return response.blob()
          })
        : await designToPng(config.canvas.width, config.canvas.height, background, elements)
      onSubmitted(await submitDesign(linkCode, participantId, output, {
        config, startedAt, elements, background, actionLog: [], prompt, generationsUsed: used,
      }))
    } catch (err) {
      toast(err instanceof Error ? `Could not submit: ${err.message}. Please try again.` : 'Could not submit. Please try again.', 'error')
      setBusy(false)
    }
  }

  return (
    <>
      <EditorShell
        onSubmit={() => setSubmitOpen(true)}
        submitDisabled={status !== 'done'}
        headerLeft={headerBadge}
        headerRight={
          <span className="text-[12.5px] font-semibold text-slate-400">
            {left} generation{left === 1 ? '' : 's'} left
          </span>
        }
        rail={<RailItem icon={<LayoutGrid className="size-5" />} label="Elements" active />}
        panel={<ElementsPanel config={config} readOnly />}
        toolbar={
          <span className="flex items-center gap-2 px-2 text-[13px] text-slate-400">
            <Sparkles className="size-4 text-brand-500" />
            {status === 'done' ? 'Your AI-generated image is shown on the canvas.' : 'Describe your image in the panel on the right, then click Generate.'}
          </span>
        }
        canvas={
          <DesignCanvas
            width={config.canvas.width}
            height={config.canvas.height}
            background={background}
            elements={elements}
            overlay={
              <>
                {directImage && imageUrl && status !== 'generating' && (
                  <img src={imageUrl} alt="AI-generated design" className="absolute inset-0 size-full object-cover" />
                )}
                {status === 'generating' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-[1px]">
                  <div className="shimmer absolute inset-0" />
                  <LoaderCircle className="relative size-8 animate-spin text-brand-600" />
                  <span className="relative text-sm font-semibold text-slate-700">Generating your design…</span>
                </div>
                )}
              </>
            }
          />
        }
        rightPanel={
          <div className="flex flex-col gap-5 p-5">
            <div>
              <label htmlFor="vds-prompt" className="text-[15px] font-bold">Describe Your Design</label>
              <p className="mt-1 text-[12.5px] text-slate-500">Type or paste your instructions. English or Chinese both work.</p>
              <textarea
                id="vds-prompt"
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); persist({ prompt: e.target.value }) }}
                placeholder="Enter your design instructions here..."
                disabled={left === 0 || status === 'generating'}
                rows={9}
                maxLength={4000}
                className="mt-3 w-full resize-none rounded-xl border-0 bg-slate-50 p-3.5 text-[14px] leading-relaxed text-slate-800 ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
              <div className="mt-1 text-right font-mono text-[11px] text-slate-400">{prompt.length} / 4000</div>
              <Button
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                onClick={generate}
                disabled={!prompt.trim() || left === 0 || status === 'generating'}
              >
                {status === 'generating' ? <><LoaderCircle className="size-4 animate-spin" /> Generating…</> : <><Sparkles className="size-4" /> Generate</>}
              </Button>
              {left === 0 && status === 'done' && (
                <p className="mt-2 text-center text-[12.5px] text-slate-500">You’ve used your generation. Review the design and submit it.</p>
              )}
            </div>

            {status === 'error' && error && (
              <div className="flex gap-2.5 rounded-xl bg-red-50 p-3.5 text-[13px] text-red-800 ring-1 ring-red-100">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <div>
                  <div className="font-semibold">Generation failed</div>
                  <div className="mt-0.5">{error} This attempt did not use up your generation — please try again.</div>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div>
                <h3 className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.08em] text-slate-400">Result</h3>
                <div className="rounded-xl bg-workspace p-3 ring-1 ring-slate-200">
                  {directImage && imageUrl ? (
                    <img src={imageUrl} alt="Generated result" className="block h-[200px] w-full rounded-lg object-contain drop-shadow-sm" />
                  ) : (
                    <div className="flex h-[200px] items-center justify-center text-sm text-slate-500">No generated image</div>
                  )}
                </div>
                <p className="mt-2 text-[11.5px] text-slate-400">Generated by {config.ai.model}</p>
              </div>
            )}
          </div>
        }
      />
      <SubmitDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onConfirm={doSubmit}
        busy={busy}
        elementCount={directImage ? 1 : elements.length}
        warning={directImage ? 'This AI-generated image will be saved as the participant’s final design.' : undefined}
      />
    </>
  )
}
