<template>
  <div class="gallery">
    <router-link v-for="photo in photos" :key="photo.id" :to="`/photo/${photo.id}`"
      v-bind:class="bindPhotoClass(photo.likes)">
      <img :src="photo.urls.full">
    </router-link>
  </div>
</template>


<script>
export default {
  name: 'GalleryComponent',
  data() {
    return {
      photos: [],
      accesKey: '-hmPsUWIESwXL5s88SIL1UjmeC2U-hdlZ9rOWDKnzHY',
      url: 'https://api.unsplash.com/search/photos?per_page=20&oder_by=latest&query=random&client_id=',
    }
  },
  methods: {
    fetchRandomPhoto() {
      fetch(this.url + this.accesKey)
        .then(response => response.json())
        .then((json) => {
          console.log(json)
          this.photos = json.results
        }).catch((err) => {
          console.log('error', err)
        })
    },
    bindPhotoClass(likes) {
      if (likes <= 5000) {
        return ' '
      } else if (likes <= 6000) {
        return 'wide'
      } else if (likes <= 7000) {
        return 'tall'
      } else {
        return 'big'
      }
    }
  },
  created() {
    this.fetchRandomPhoto();
  },

}
</script>

<style>
.gallery {
  max-width: 8;
  margin: 5rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 500px;
  grid-auto-flow: dense;
}

.gallery>a {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.gallery>a>img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
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
</style>