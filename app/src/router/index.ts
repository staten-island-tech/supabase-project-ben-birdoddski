import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: MainPage,
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
