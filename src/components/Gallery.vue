<template>
  <main class="container">
    <h1 class="sr-only">Photo Gallery</h1>
    <form class="search" @submit.prevent="search">
      <input v-model="query" type="search" placeholder="Search photos (e.g. mountains)" aria-label="Search photos">
      <button v-if="query" type="button" class="clear" aria-label="Clear search" @click="clear">✕</button>
      <button type="submit">Search</button>
    </form>
    <p v-if="error" class="status error" role="alert">{{ error }}</p>
    <p v-else-if="!loading && !photos.length" class="status">No photos found.</p>
    <div class="gallery" :aria-busy="loading">
      <router-link v-for="(photo, index) in photos" :key="photo.id" :to="{ path: `/photo/${photo.id}`, query: $route.query }"
        :class="photo.size">
        <div class="information">
          <div class="description">{{ showDescription(photo) }}</div>
          <div class="username">@{{ photo.user.username }}</div>
        </div>
        <img :src="thumb(photo, 400)" :srcset="srcset(photo)" :sizes="sizes(photo)" :alt="photo.alt_description || ''"
          :loading="index < EAGER_TILES ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : undefined" decoding="async">
      </router-link>
      <template v-if="loading && !photos.length">
        <div v-for="n in 12" :key="`skeleton-${n}`" class="skeleton"></div>
      </template>
    </div>
    <button v-if="page < totalPages && photos.length" class="load-more" :disabled="loading" @click="loadMore">
      {{ loading ? 'Loading…' : 'Load more' }}
    </button>
    <p class="credit">
      Photos from <a :href="unsplashUrl" target="_blank" rel="noopener">Unsplash</a>
    </p>
  </main>
</template>

<script>
import { unsplashGet, errorMessage, UNSPLASH_URL } from '../unsplash'
import { assignSizes } from '../sizes'

const THUMB_WIDTHS = [400, 800, 1200]
// Width / height of a regular and of a wide (two-column) tile
const TILE_RATIO = 1.3
const WIDE_RATIO = 2.6
// Tiles that can be in the first screen (mobile included) load eagerly; the rest are lazy
const EAGER_TILES = 8

const PER_PAGE = 30

export default {
  name: 'GalleryComponent',
  data() {
    return {
      photos: [],
      query: '',
      activeQuery: '',
      page: 1,
      totalPages: 1,
      loading: false,
      error: '',
      unsplashUrl: UNSPLASH_URL,
      EAGER_TILES,
    }
  },
  methods: {
    search() {
      this.query = this.query.trim()
      this.activeQuery = this.query
      this.$router.replace({ query: this.query ? { q: this.query } : {} })
      this.fetchPhotos()
    },
    clear() {
      this.query = ''
      this.search()
    },
    loadMore() {
      this.fetchPhotos(this.page + 1)
    },
    async fetchPhotos(page = 1) {
      this.loading = true
      this.error = ''
      if (page === 1) this.photos = []
      try {
        const json = await unsplashGet('/search/photos', {
          query: this.activeQuery || 'random',
          per_page: PER_PAGE,
          page,
        })
        this.photos = [...this.photos, ...assignSizes(json.results)]
        this.page = page
        this.totalPages = json.total_pages
      } catch (err) {
        this.error = errorMessage(err)
      } finally {
        this.loading = false
      }
    },
    // Unsplash resizes on the fly through the `raw` URL, so the grid never downloads full-size images
    // Cropped to the tile's proportions on the server, so no pixels are downloaded just to be hidden by object-fit
    thumb(photo, width) {
      const ratio = photo.size === 'wide' ? WIDE_RATIO : TILE_RATIO
      return `${photo.urls.raw}&w=${width}&h=${Math.round(width / ratio)}&fit=crop&q=60&fm=webp`
    },
    srcset(photo) {
      return THUMB_WIDTHS.map(width => `${this.thumb(photo, width)} ${width}w`).join(', ')
    },
    sizes(photo) {
      // Wide tiles span two columns
      return photo.size === 'wide'
        ? '(max-width: 768px) 100vw, 50vw'
        : '(max-width: 768px) 50vw, 25vw'
    },
    showDescription(photo) {
      const text = photo.description && photo.description.length < 150
        ? photo.description
        : photo.alt_description || photo.description || ''
      return text ? text[0].toUpperCase() + text.slice(1) : ''
    },
  },
  async created() {
    // The gallery is mounted before the router resolves the initial URL, so wait for it to read ?q=
    await this.$router.isReady()
    this.query = this.activeQuery = this.$route.query.q || ''
    this.fetchPhotos()
  },

}
</script>

<style>
.container {
  margin: 5rem;
}

/* Search */

.search {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 20px;
}

.search input {
  flex: 1;
  min-width: 0; /* lets the input shrink so the form never overflows on narrow screens */
  padding: 13px 20px;
  border-radius: 15px;
  border: 2px solid black;
  font: inherit;
}

.search button {
  padding: 13px 20px;
  border-radius: 15px;
  border: 2px solid black;
  background-color: slateblue;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.search button:hover {
  opacity: 0.85;
}

/* The browser's own clear button duplicates ours */
.search input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

.search .clear {
  background-color: transparent;
  color: black;
  padding: 13px 16px;
}

.status {
  text-align: center;
}

.status.error {
  color: #b00020;
}

.load-more {
  display: block;
  margin: 2rem auto 0;
  padding: 13px 28px;
  border-radius: 15px;
  border: 2px solid black;
  background-color: slateblue;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.load-more:disabled {
  opacity: 0.6;
  cursor: wait;
}

.credit {
  margin-top: 2rem;
  text-align: center;
  font-size: small;
}

/* Skeleton */

.gallery .skeleton {
  border-radius: 15px;
  background: linear-gradient(90deg, #eee 25%, #f6f6f6 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* Gallery */

.gallery {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 250px;
  grid-auto-flow: dense;
}

.gallery>a {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  float: left;
  border-radius: 15px;
}

.gallery>a>img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: width 1s, height 1s, transform 1s;
  -moz-transition: width 1s, height 1s, transform 1s;
  -webkit-transition: width 1s, height 1s, transform 1s;
  -o-transition: width 1s, height 1s, transform 1s;
}

.gallery>a>img:hover {
  transform: scale(1.2);
  -moz-transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -o-transform: scale(1.2);
}

.gallery .wide {
  grid-column: span 2;
}

.gallery .information {
  position: absolute;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  color: #fff;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 15px;
  padding-top: 100px;
  text-align: left;
  letter-spacing: 0.02em;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: smaller;
}

.description {
  font-weight: 600;
}

.username {
  font-size: x-small;
  opacity: 85%;
}

@media (max-width: 768px) {
  .container {
    margin: 1rem;
  }

  .gallery {
    grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
    grid-auto-rows: 150px;
  }

  .gallery .information {
    font-size: x-small;
  }
}
</style>