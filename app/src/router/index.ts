import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LogInPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/MainPage.vue'),
    },
  ],
})

export default router
