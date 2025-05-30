<template>
  <div class="min-h-screen bg-white text-gray-800">
    <header class="border-b sticky top-0 bg-white z-50">
      <div class="w-full px-4 flex justify-between items-center h-14">
        <RouterLink to="/" class="text-xl font-bold text-purple-600">TimeCapsule</RouterLink>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <img src="" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-purple-500" />
        <div class="mt-4 sm:mt-0">
          <h2 class="text-2xl font-semibold">{{ userStore.username || 'username' }}</h2>
          <p class="text-sm text-gray-500">I cant rmember stuff so i do this</p>
          <div class="mt-2 text-sm text-gray-700 flex gap-4">
            <span
              ><strong>{{ userPosts.length }}</strong> capsules</span
            >
            <span><strong>0</strong> followers</span>
            <span><strong>0</strong> following</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4">
      <div class="grid grid-cols-3 gap-1 sm:gap-4">
        <div
          v-for="post in userPosts"
          :key="post.id"
          class="relative group aspect-square bg-gray-200 overflow-hidden"
        >
          <img
            :src="post.isAvailable ? openImage : lockImage"
            alt="Capsule"
            class="w-full h-full object-contain p-6 group-hover:opacity-60 transition"
          />
          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 transition"
          >
            <p class="text-sm font-semibold text-center px-2">{{ post.title }}</p>
            <p class="text-xs">
              {{ post.isAvailable ? 'Now Open!' : `Opens in ${post.countdown}` }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/uservalue'

const userStore = useUserStore()
console.log(userStore.username)
const lockImage = 'https://www.svgrepo.com/show/13695/lock.svg'
const openImage = 'https://www.svgrepo.com/show/119792/unlock.svg'

const userPosts = ref([
  { id: 1, title: '2023 Recap', description: '', isAvailable: true, countdown: '' },
  { id: 2, title: 'Dear Future Me', description: '', isAvailable: false, countdown: '1 year' },
  {
    id: 3,
    title: 'Graduation Thoughts',
    description: '',
    isAvailable: false,
    countdown: '8 months',
  },
  { id: 4, title: 'NYE Wishes', description: '', isAvailable: true, countdown: '' },
  { id: 5, title: 'First Job Memory', description: '', isAvailable: false, countdown: '2 years' },
])
</script>
