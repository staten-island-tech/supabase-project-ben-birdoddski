<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-purple-600">Time Capsule</RouterLink>

        <input
          type="text"
          placeholder="Search capsules..."
          class="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div v-if="userStore.loggedIn" class="ml-4 flex items-center space-x-4">
          <RouterLink
            to="/profile"
            class="relative group rounded-full p-2 hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-purple-600 hover:text-purple-800 transition"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </header>

    <div v-if="!userStore.loggedIn" class="text-center py-24 px-6">
      <h1 class="text-5xl font-bold text-purple-700 mb-4">Welcome to Time Capsule</h1>
      <p class="text-lg text-gray-700 mb-8">Sign up or log in to view and create time capsules!</p>
      <div class="space-x-4">
        <RouterLink
          to="/signup"
          class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-full font-medium transition"
          >Sign Up</RouterLink
        >
        <RouterLink
          to="/login"
          class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-5 rounded-full font-medium transition"
          >Login</RouterLink
        >
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto mt-10 px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Explore Time Capsules</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="post in examplePosts"
          :key="post.id"
          class="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 flex flex-col justify-between"
        >
          <div class="flex flex-col items-center text-center">
            <img
              :src="post.isAvailable ? unlockedImage : lockedImage"
              alt="Lock status"
              class="w-24 h-24 mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-800">{{ post.title }}</h3>
            <p class="text-gray-600 mt-1 mb-3">{{ post.description }}</p>
            <p :class="post.isAvailable ? 'text-green-600' : 'text-red-500'">
              {{ post.isAvailable ? 'This capsule is now open!' : 'Opens in: ' + post.countdown }}
            </p>
          </div>
          <button
            class="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-semibold transition"
          >
            View Capsule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/uservalue'

const userStore = useUserStore()

const examplePosts = ref([
  {
    id: 1,
    title: 'Letter to Myself',
    description: 'A message I wrote during high school.',
    isAvailable: false,
    countdown: '3 years',
  },
  {
    id: 2,
    title: 'Travel Journal',
    description: 'Memories from my trip to Japan.',
    isAvailable: true,
    countdown: '',
  },
  {
    id: 3,
    title: 'Birthday Time Capsule',
    description: 'What I was like at age 10.',
    isAvailable: false,
    countdown: '5 months',
  },
  {
    id: 4,
    title: 'Graduation Notes',
    description: 'Thoughts before leaving school.',
    isAvailable: true,
    countdown: '',
  },
  {
    id: 5,
    title: 'College Freshman Me',
    description: 'Predictions about college life.',
    isAvailable: false,
    countdown: '1 year',
  },
  {
    id: 6,
    title: '2020 Reflections',
    description: 'A look back at a historic year.',
    isAvailable: true,
    countdown: '',
  },
])

const lockedImage = 'https://img.icons8.com/ios-filled/100/lock--v1.png'
const unlockedImage = 'https://img.icons8.com/ios-filled/100/unlock--v1.png'
</script>
