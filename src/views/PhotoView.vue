<template>
    <div>
        <Gallery />
        <Photo />
    </div>
</template>
  

<script>
import Gallery from '../components/Gallery.vue';
import Photo from '../components/Photo.vue';

export default {
    name: 'photoView',
    components: {
        Gallery,
        Photo,
    },
};
</script>

