import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import SearchResultsPage from '@/views/SearchResultsPage.vue'
import { useUserStore } from '../stores/uservalue'
const userStore = useUserStore()

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
      meta: {},
    },
    {
      path: '/search/:term',
      name: 'SearchResults',
      component: SearchResultsPage,
      meta: {},
    },
    {
      path: '/CreatePost',
      name: 'CreatePost',
      component: () => import('../views/CreatePost.vue'),
      meta: {},
    },
    {
      path: '/ViewPost',
      name: 'ViewPost',
      component: () => import('../views/ViewPost.vue'),
      meta: {require: userStore.loggedIn},
    }
  ],
})

router.beforeEach((to, from) => {
  if (
    !userStore.loggedIn && to.name !== 'Home'||'Sign Up'||'Login'
  ) {
    return { name: 'Home' }
  }
})
export default router
