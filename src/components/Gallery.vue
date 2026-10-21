<template>
  <div class="container">
    <form class="search" @submit.prevent="search">
      <input v-model="query" type="search" placeholder="Search photos (e.g. mountains)" aria-label="Search photos">
      <button type="submit">Search</button>
    </form>
    <p v-if="loading" class="status">Loading…</p>
    <p v-else-if="error" class="status">Could not load photos. Please try again.</p>
    <p v-else-if="!photos.length" class="status">No photos found.</p>
    <div class="gallery">
      <router-link v-for="photo in photos" :key="photo.id" :to="`/photo/${photo.id}`"
        v-bind:class="bindPhotoClass(photo.likes)">
        <div class="information">
          <div class="description">{{ showDescription(photo) }}</div>
          <div class="username">@{{ photo.user.username }}</div>
        </div>
        <img :src="photo.urls.small" :alt="photo.alt_description || ''" loading="lazy">
      </router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: 'GalleryComponent',
  data() {
    return {
      photos: [],
      photoURL: '',
      description: '',
      city: '',
      accesKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
      query: 'random',
      loading: false,
      error: false,
      url: 'https://api.unsplash.com/search/photos',
    }
  },
  methods: {
    search() {
      this.query = this.query.trim() || 'random'
      this.fetchPhotos()
    },
    fetchPhotos() {
      const params = new URLSearchParams({
        per_page: 30,
        query: this.query,
        client_id: this.accesKey,
      })
      this.loading = true
      this.error = false
      fetch(`${this.url}?${params}`)
        .then(response => {
          if (!response.ok) throw new Error(response.status)
          return response.json()
        })
        .then((json) => {
          this.photos = json.results
        }).catch(() => {
          this.photos = []
          this.error = true
        }).finally(() => {
          this.loading = false
        })
    },
    bindPhotoClass(likes) {
      if (likes <= 6000) {
        return ' '
      } else if (likes <= 7000) {
        return 'wide'
      } else if (likes <= 8000) {
        return 'tall'
      } else {
        return 'big'
      }
    },
    showDescription(photo) {
      if (!photo.description && !photo.alt_description) {
        return ''
      } else if (!photo.description) {
        return photo.alt_description[0].toUpperCase() + photo.alt_description.slice(1)
      } else if (photo.description.length < 150) {
        return photo.description[0].toUpperCase() + photo.description.slice(1)
      } else {
        return photo.alt_description[0].toUpperCase() + photo.alt_description.slice(1)
      }
    },
  },
  created() {
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

.status {
  text-align: center;
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

.gallery .tall {
  grid-row: span 2;
}

.gallery .big {
  grid-column: span 2;
  grid-row: span 2;
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
  opacity: 60%;
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