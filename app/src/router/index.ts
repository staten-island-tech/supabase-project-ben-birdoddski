import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LogInPage.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/MainPage.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: LogInPage,
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: SignUpPage,
    },
  ],
})

export default router
