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

/* Visible keyboard focus on every interactive element */
a:focus-visible,
button:focus-visible,
input:focus-visible {
  outline: 3px solid #2b1fa8;
  outline-offset: 3px;
}

/* Text links (photo caption, Unsplash credit) get a thick underline instead of a box */
.image-info a:focus-visible,
.credit a:focus-visible {
  outline: none;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
  text-decoration-color: #2b1fa8;
}

/* Visually hidden but available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
