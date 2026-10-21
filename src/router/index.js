import { createRouter, createWebHashHistory } from 'vue-router'
import Photo from '../components/Photo.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // The gallery is rendered by App.vue; the home route only needs to exist
      path: '/',
      name: 'home',
      component: { render: () => null }
    },
    {
      path: '/photo/:id',
      name: 'photo',
      component: Photo
    }
  ]
})

export default router
