import { describe, expect, it } from 'vitest'
import { assignSizes } from '../sizes'

const photos = (likes) => likes.map((n, i) => ({ id: String(i), likes: n }))

describe('assignSizes', () => {
  it('ranks by likes within the batch, whatever their absolute value', () => {
    const result = assignSizes(photos(Array.from({ length: 30 }, (_, i) => i * 10)))
    const count = (size) => result.filter(p => p.size === size).length

    expect(count('big')).toBe(3)
    expect(count('tall')).toBe(3)
    expect(count('wide')).toBe(3)
    expect(result.find(p => p.likes === 290).size).toBe('big')
    expect(result.find(p => p.likes === 0).size).toBe('')
  })

  it('keeps the original order and handles small batches', () => {
    const result = assignSizes(photos([5, 50, 1]))

    expect(result.map(p => p.id)).toEqual(['0', '1', '2'])
    expect(result[1].size).toBe('big')
  })
})
