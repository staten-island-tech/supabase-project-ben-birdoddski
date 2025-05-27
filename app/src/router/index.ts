import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import SearchResultsPage from '@/views/SearchResultsPage.vue'

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
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfilePage.vue'),
    },
    {
      path: '/search/:term',
      name: 'SearchResults',
      component: SearchResultsPage,
    },
    {
      path: '/CreatePost',
      name: 'CreatePost',
      component: () => import('../views/CreatePost.vue'),
    },
    {
      path: '/ViewPost',
      name: 'ViewPost',
      component: () => import('../views/ViewPost.vue'),
    }
  ],
})

export default router
