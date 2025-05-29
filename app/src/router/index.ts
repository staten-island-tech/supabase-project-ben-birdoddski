import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import SearchResultsPage from '@/views/SearchResultsPage.vue'
import { useUserStore } from '../stores/uservalue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
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
      component: SignUpPage
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfilePage.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/search/:term',
      name: 'SearchResults',
      component: SearchResultsPage,
      meta: {requiresAuth: true},
    },
    {
      path: '/CreatePost',
      name: 'CreatePost',
      component: () => import('../views/CreatePost.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/ViewPost',
      name: 'ViewPost',
      component: () => import('../views/ViewPost.vue'),
      meta: {requiresAuth: true},
    }
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (
    to.meta.requiresAuth==true&&!userStore.loggedIn
  ) {
    next({name: 'Login'})
  } else {
    next()
  }
})
export default router
