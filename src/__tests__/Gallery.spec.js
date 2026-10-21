import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Gallery from '../components/Gallery.vue'

const photo = (id) => ({
  id,
  likes: 100,
  description: `Photo ${id}`,
  alt_description: null,
  urls: { small: `https://img/${id}.jpg` },
  user: { username: 'jane' },
})

const response = (body, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => body,
})

async function mountGallery(url = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/photo/:id', component: { template: '<div />' } },
    ],
  })
  router.push(url)
  await router.isReady()
  const wrapper = mount(Gallery, { global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('Gallery', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows random photos with an empty search input', async () => {
    fetch.mockResolvedValue(response({ results: [photo('a'), photo('b')], total_pages: 1 }))
    const { wrapper } = await mountGallery()

    expect(fetch.mock.calls[0][0]).toContain('query=random')
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.findAll('.gallery > a')).toHaveLength(2)
  })

  it('reads the search term from the URL even when mounted before the router is ready', async () => {
    fetch.mockResolvedValue(response({ results: [photo('a')], total_pages: 1 }))
    const history = createMemoryHistory()
    history.replace('/?q=red') // like opening a shared link: the first navigation already carries ?q=
    const router = createRouter({
      history,
      routes: [{ path: '/', component: { template: '<div />' } }],
    })
    const wrapper = mount(Gallery, { global: { plugins: [router] } })
    await router.isReady()
    await flushPromises()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toContain('query=red')
    expect(wrapper.find('input').element.value).toBe('red')
  })

  it('searches, keeps the term in the URL and clears it', async () => {
    fetch.mockResolvedValue(response({ results: [photo('a')], total_pages: 1 }))
    const { wrapper, router } = await mountGallery()

    await wrapper.find('input').setValue('mountains')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBe('mountains')
    expect(fetch.mock.lastCall[0]).toContain('query=mountains')

    await wrapper.find('.clear').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBeUndefined()
    expect(fetch.mock.lastCall[0]).toContain('query=random')
  })

  it('appends the next page when loading more', async () => {
    fetch
      .mockResolvedValueOnce(response({ results: [photo('a')], total_pages: 2 }))
      .mockResolvedValueOnce(response({ results: [photo('b')], total_pages: 2 }))
    const { wrapper } = await mountGallery()

    await wrapper.find('.load-more').trigger('click')
    await flushPromises()

    expect(fetch.mock.lastCall[0]).toContain('page=2')
    expect(wrapper.findAll('.gallery > a')).toHaveLength(2)
    expect(wrapper.find('.load-more').exists()).toBe(false)
  })

  it('explains the rate limit when Unsplash answers 403', async () => {
    fetch.mockResolvedValue(response({}, 403))
    const { wrapper } = await mountGallery()

    expect(wrapper.find('[role="alert"]').text()).toMatch(/limit reached/)
  })
})
