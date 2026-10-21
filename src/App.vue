<script setup>
import { RouterView } from 'vue-router'
import Gallery from './components/Gallery.vue'
</script>


<template>
  <!-- The gallery stays mounted while a photo is open, so search results and loaded pages are kept -->
  <Gallery />
  <RouterView />
</template>

<style>
  @import url('https://fonts.googleapis.com/css?family=Quicksand');

html {
  font-size: 15px;
}

body {
  font-family: "Quicksand", sans-serif;
}

a {
  text-decoration: none;
  color: slateblue;
}
</style>

