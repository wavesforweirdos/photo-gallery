import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { RouterView, createMemoryHistory, createRouter } from 'vue-router'
import Photo from '../components/Photo.vue'

const json = {
  urls: { regular: 'https://img/a.jpg' },
  description: 'a quiet lake',
  alt_description: null,
  location: { name: 'Banff, Canada' },
  user: { name: 'Jane Doe', username: 'jane' },
}

async function mountPhoto() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/photo/:id', component: Photo },
    ],
  })
  router.push('/photo/a?q=lake')
  await router.isReady()
  const wrapper = mount(Photo, {
    attachTo: document.body,
    global: { plugins: [router], mocks: { $route: router.currentRoute.value } },
  })
  await flushPromises()
  return { wrapper, router }
}

describe('Photo', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => json }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('shows the description and attributes the photo to its author and Unsplash', async () => {
    const { wrapper } = await mountPhoto()

    expect(wrapper.text()).toContain('A quiet lake')
    expect(wrapper.text()).toContain('Banff, Canada')
    const links = wrapper.findAll('.image-username a')
    expect(links[0].text()).toBe('Jane Doe')
    expect(links[0].attributes('href')).toContain('utm_source=photo-gallery')
    expect(links[1].text()).toBe('Unsplash')
  })

  it('focuses the close button on open and closes with the button or Esc, keeping the search', async () => {
    const { wrapper, router } = await mountPhoto()
    const close = wrapper.find('.image-close')

    expect(document.activeElement).toBe(close.element)

    await close.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
    expect(router.currentRoute.value.query.q).toBe('lake')

    await router.push('/photo/a?q=lake')
    await wrapper.find('.image-box').trigger('keydown', { key: 'Escape' })
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('loads the new photo when only the id in the URL changes', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/photo/:id', component: Photo }],
    })
    router.push('/photo/a')
    await router.isReady()
    mount({ components: { RouterView }, template: '<RouterView />' }, {
      attachTo: document.body,
      global: { plugins: [router] },
    })
    await flushPromises()

    await router.push('/photo/b')
    await flushPromises()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.lastCall[0]).toContain('/photos/b')
  })
})
