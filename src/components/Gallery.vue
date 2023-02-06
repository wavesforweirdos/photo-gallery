<template>
  <div class="container">
    <div class="addPhoto">
      <router-link to="#">Cargar una nueva imagen</router-link>
    </div>
    <div class="gallery">
      <router-link v-for="photo in photos" :key="photo.id" :to="`/photo/${photo.id}`"
        v-bind:class="bindPhotoClass(photo.likes)">
        <div class="information">
          <div class="description">{{ showDescription(photo) }}</div>
          <div class="username">@{{ photo.user.username }}</div>
        </div>
        <img :src="photo.urls.full">
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
      accesKey: '-hmPsUWIESwXL5s88SIL1UjmeC2U-hdlZ9rOWDKnzHY',
      url: 'https://api.unsplash.com/search/photos?per_page=30&oder_by=oldest&query=random&client_id=',
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
    this.fetchRandomPhoto();
  },

}
</script>

<style>
.container {
  margin: 5rem;
}

/* Button addPhoto */

.addPhoto {
  padding: 13px 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  border: 2px solid black;
  cursor: pointer;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  text-align: center;
}

.addPhoto>a {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: black;
}

.addPhoto:after {
  content: "";
  background-color: slateblue;
  opacity: 10%;
  border-radius: 15px;
  width: 100%;
  z-index: -1;
  position: absolute;
  height: 100%;
  top: 7px;
  left: 7px;
  transition: 0.2s;
}

.addPhoto:hover:after {
  top: 0px;
  left: 0px;
}

.addPhoto:active:after{
  background-color: slateblue;
  opacity: 50%;
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