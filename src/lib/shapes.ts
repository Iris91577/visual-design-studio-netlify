import type { DesignElement, ShapeCategory, ShapeType } from './types'

export interface ShapeDef {
  type: ShapeType
  name: string
  category: ShapeCategory
  /** Keep width/height equal while resizing */
  lockAspect: boolean
  /** Lines only resize along their length */
  isLine: boolean
  /** Default size as a fraction of min(canvasW, canvasH) */
  defaultW: number
  defaultH: number
}

export const SHAPES: ShapeDef[] = [
  { type: 'circle', name: 'Circle', category: 'basic', lockAspect: true, isLine: false, defaultW: 0.25, defaultH: 0.25 },
  { type: 'ellipse', name: 'Ellipse', category: 'basic', lockAspect: false, isLine: false, defaultW: 0.32, defaultH: 0.2 },
  { type: 'square', name: 'Square', category: 'basic', lockAspect: true, isLine: false, defaultW: 0.25, defaultH: 0.25 },
  { type: 'rectangle', name: 'Rectangle', category: 'basic', lockAspect: false, isLine: false, defaultW: 0.34, defaultH: 0.2 },
  { type: 'triangle', name: 'Triangle', category: 'basic', lockAspect: false, isLine: false, defaultW: 0.26, defaultH: 0.24 },
  { type: 'diamond', name: 'Diamond', category: 'basic', lockAspect: false, isLine: false, defaultW: 0.22, defaultH: 0.28 },
  { type: 'pentagon', name: 'Pentagon', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.25, defaultH: 0.25 },
  { type: 'hexagon', name: 'Hexagon', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.25, defaultH: 0.25 },
  { type: 'octagon', name: 'Octagon', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.25, defaultH: 0.25 },
  { type: 'star', name: 'Star', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.26, defaultH: 0.26 },
  { type: 'heart', name: 'Heart', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.26, defaultH: 0.24 },
  { type: 'semicircle', name: 'Semicircle', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.3, defaultH: 0.15 },
  { type: 'cross', name: 'Cross', category: 'decorative', lockAspect: false, isLine: false, defaultW: 0.24, defaultH: 0.24 },
  { type: 'line', name: 'Straight Line', category: 'lines', lockAspect: false, isLine: true, defaultW: 0.4, defaultH: 0.04 },
  { type: 'curve', name: 'Curved Line', category: 'lines', lockAspect: false, isLine: false, defaultW: 0.36, defaultH: 0.14 },
  { type: 'arrow', name: 'Arrow', category: 'lines', lockAspect: false, isLine: true, defaultW: 0.36, defaultH: 0.06 },
]

export const SHAPE_MAP: Record<ShapeType, ShapeDef> = Object.fromEntries(
  SHAPES.map((s) => [s.type, s]),
) as Record<ShapeType, ShapeDef>

export const ALL_SHAPE_TYPES: ShapeType[] = SHAPES.map((s) => s.type)

export const CATEGORY_LABELS: Record<ShapeCategory, string> = {
  basic: 'Basic Shapes',
  decorative: 'Polygons & Decorative',
  lines: 'Lines',
}

/** A drawable primitive in the element's local frame (origin = element centre). */
export interface Primitive {
  d: string
  fill?: string
  stroke?: string
  strokeWidth?: number
}

const f = (n: number) => Math.round(n * 100) / 100

function polygonPath(points: [number, number][], w: number, h: number): string {
  // Normalise to the bounding box so every polygon fills its frame exactly
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const pts = points.map(([x, y]) => [
    ((x - minX) / (maxX - minX) - 0.5) * w,
    ((y - minY) / (maxY - minY) - 0.5) * h,
  ])
  return 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L') + ' Z'
}

function regular(n: number, offsetDeg = -90): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((offsetDeg + (i * 360) / n) * Math.PI) / 180
    return [Math.cos(a), Math.sin(a)] as [number, number]
  })
}

function starPoints(): [number, number][] {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 1 : 0.4
    const a = ((-90 + i * 36) * Math.PI) / 180
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]
  })
}

/** Stroke weight for line elements, derived from the canvas size so it reads the same at every format. */
export function lineWeight(canvasW: number, canvasH: number): number {
  return Math.max(4, Math.round(Math.min(canvasW, canvasH) * 0.012))
}

export function shapePrimitives(el: DesignElement, weight: number): Primitive[] {
  const { width: w, height: h, fill } = el
  const hw = w / 2, hh = h / 2
  switch (el.type) {
    case 'circle':
    case 'ellipse':
      return [{ d: `M${f(-hw)},0 A${f(hw)},${f(hh)} 0 1,0 ${f(hw)},0 A${f(hw)},${f(hh)} 0 1,0 ${f(-hw)},0 Z`, fill }]
    case 'square':
    case 'rectangle':
      return [{ d: `M${f(-hw)},${f(-hh)} H${f(hw)} V${f(hh)} H${f(-hw)} Z`, fill }]
    case 'triangle':
      return [{ d: `M0,${f(-hh)} L${f(hw)},${f(hh)} L${f(-hw)},${f(hh)} Z`, fill }]
    case 'diamond':
      return [{ d: `M0,${f(-hh)} L${f(hw)},0 L0,${f(hh)} L${f(-hw)},0 Z`, fill }]
    case 'pentagon':
      return [{ d: polygonPath(regular(5), w, h), fill }]
    case 'hexagon':
      return [{ d: polygonPath(regular(6, 0), w, h), fill }]
    case 'octagon':
      return [{ d: polygonPath(regular(8, 22.5), w, h), fill }]
    case 'star':
      return [{ d: polygonPath(starPoints(), w, h), fill }]
    case 'heart': {
      const p = (u: number, v: number) => `${f(-hw + u * w)},${f(-hh + v * h)}`
      return [{
        d: `M${p(0.5, 1)} C${p(0.18, 0.76)} ${p(0, 0.56)} ${p(0, 0.31)} C${p(0, 0.12)} ${p(0.14, 0)} ${p(0.29, 0)} C${p(0.4, 0)} ${p(0.47, 0.06)} ${p(0.5, 0.15)} C${p(0.53, 0.06)} ${p(0.6, 0)} ${p(0.71, 0)} C${p(0.86, 0)} ${p(1, 0.12)} ${p(1, 0.31)} C${p(1, 0.56)} ${p(0.82, 0.76)} ${p(0.5, 1)} Z`,
        fill,
      }]
    }
    case 'semicircle':
      return [{ d: `M${f(-hw)},${f(hh)} A${f(hw)},${f(h)} 0 0,1 ${f(hw)},${f(hh)} Z`, fill }]
    case 'cross': {
      const tx = w / 6, ty = h / 6
      return [{
        d: `M${f(-tx)},${f(-hh)} H${f(tx)} V${f(-ty)} H${f(hw)} V${f(ty)} H${f(tx)} V${f(hh)} H${f(-tx)} V${f(ty)} H${f(-hw)} V${f(-ty)} H${f(-tx)} Z`,
        fill,
      }]
    }
    case 'line':
      return [{ d: `M${f(-hw + weight / 2)},0 H${f(hw - weight / 2)}`, stroke: fill, strokeWidth: weight }]
    case 'curve': {
      const inset = weight / 2
      return [{
        d: `M${f(-hw + inset)},${f(hh - inset)} C${f(-hw / 3)},${f(-hh * 1.6)} ${f(hw / 3)},${f(hh * 1.6)} ${f(hw - inset)},${f(-hh + inset)}`,
        stroke: fill,
        strokeWidth: weight,
      }]
    }
    case 'arrow': {
      const headL = Math.min(w * 0.45, weight * 4.2)
      const headW = Math.min(h, weight * 3.6) / 2
      return [
        { d: `M${f(-hw + weight / 2)},0 H${f(hw - headL + 1)}`, stroke: fill, strokeWidth: weight },
        { d: `M${f(hw)},0 L${f(hw - headL)},${f(-headW)} L${f(hw - headL)},${f(headW)} Z`, fill },
      ]
    }
  }
}

/** Default element size for a given canvas. */
export function defaultSize(type: ShapeType, canvasW: number, canvasH: number) {
  const def = SHAPE_MAP[type]
  const base = Math.min(canvasW, canvasH)
  const weight = lineWeight(canvasW, canvasH)
  let width = Math.round(base * def.defaultW)
  let height = Math.round(base * def.defaultH)
  if (type === 'line') height = weight * 3
  if (type === 'arrow') height = Math.round(weight * 3.6)
  if (def.lockAspect) height = width
  return { width, height }
}
