import { describe, expect, it } from 'vitest'
import { assignSizes } from '../sizes'

const photos = (likes) => likes.map((n, i) => ({ id: String(i), likes: n }))

describe('assignSizes', () => {
  it('makes the most liked 20% of the batch wide, whatever their absolute value', () => {
    const result = assignSizes(photos(Array.from({ length: 30 }, (_, i) => i * 10)))
    const wide = result.filter(p => p.size === 'wide')

    expect(wide).toHaveLength(6)
    expect(wide.every(p => p.likes >= 240)).toBe(true)
    expect(result.every(p => p.size === 'wide' || p.size === '')).toBe(true)
  })

  it('keeps the original order and handles small batches', () => {
    const result = assignSizes(photos([5, 50, 1]))

    expect(result.map(p => p.id)).toEqual(['0', '1', '2'])
    expect(result.map(p => p.size)).toEqual(['', 'wide', ''])
  })
})
