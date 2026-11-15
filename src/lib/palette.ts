import type { PaletteColor } from './types'

export const DEFAULT_PALETTE: PaletteColor[] = [
  { name: 'Red', hex: '#E74C3C' },
  { name: 'Orange', hex: '#F39C12' },
  { name: 'Yellow', hex: '#F4D03F' },
  { name: 'Green', hex: '#27AE60' },
  { name: 'Teal', hex: '#16A085' },
  { name: 'Blue', hex: '#3498DB' },
  { name: 'Navy', hex: '#2C3E50' },
  { name: 'Purple', hex: '#8E44AD' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Black', hex: '#222222' },
  { name: 'Gray', hex: '#95A5A6' },
  { name: 'White', hex: '#FFFFFF' },
]

export function isLight(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 200
}
