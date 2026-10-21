import { describe, expect, it } from 'vitest'
import { UnsplashError, errorMessage, userUrl } from '../unsplash'

describe('errorMessage', () => {
  it('explains the rate limit for 403 and 429', () => {
    expect(errorMessage(new UnsplashError(403))).toMatch(/limit reached/)
    expect(errorMessage(new UnsplashError(429))).toMatch(/limit reached/)
  })

  it('falls back to a generic message', () => {
    expect(errorMessage(new UnsplashError(500))).toMatch(/Could not load photos/)
    expect(errorMessage(new TypeError('network'))).toMatch(/Could not load photos/)
  })
})

describe('userUrl', () => {
  it('links to the profile with attribution params', () => {
    expect(userUrl({ username: 'jane' })).toBe(
      'https://unsplash.com/@jane?utm_source=photo-gallery&utm_medium=referral',
    )
  })
})
