const API_URL = 'https://api.unsplash.com'

// Attribution links must carry these params (Unsplash API guidelines)
export const UTM = 'utm_source=photo-gallery&utm_medium=referral'
export const UNSPLASH_URL = `https://unsplash.com/?${UTM}`

export function userUrl(user) {
  return `https://unsplash.com/@${user.username}?${UTM}`
}

export class UnsplashError extends Error {
  constructor(status) {
    super(`Unsplash request failed (${status})`)
    this.status = status
  }
}

export async function unsplashGet(path, params = {}) {
  const query = new URLSearchParams({
    ...params,
    client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  })
  const response = await fetch(`${API_URL}${path}?${query}`)
  if (!response.ok) throw new UnsplashError(response.status)
  return response.json()
}

export function errorMessage(error) {
  // Demo-mode keys are limited to 50 requests per hour and Unsplash answers 403 (or 429) beyond that
  if (error?.status === 403 || error?.status === 429) {
    return 'Unsplash request limit reached (50 per hour in demo mode). Please try again later.'
  }
  return 'Could not load photos. Please try again.'
}
