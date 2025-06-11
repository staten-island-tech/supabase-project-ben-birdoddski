<template>
  <div class="min-h-screen bg-gray-100">
    <navBar />

    <div v-if="!userStore.user.loggedIn" class="text-center py-24 px-6">
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

    <div v-else class="relative px-4 py-10 bg-gray-100">
      <h2 class="text-3xl font-bold mb-6 text-center">Search Results</h2>
      <p class="text-lg text-gray-700 mb-6 text-center">
        Showing results for <span class="font-semibold">{{ searchTerm }}</span>
      </p>

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opened!</h1>
      <CapsuleCarousel :posts="opened" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opening Soon:</h1>
      <CapsuleCarousel :posts="openingSoon" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Not Opening For A While:</h1>
      <CapsuleCarousel :posts="notOpeningForAWhile" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">
        Private Posts That Won't Open:
      </h1>
      <CapsuleCarousel :posts="privateForever" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import navBar from '../components/NavBar.vue'
import CapsuleCarousel from '../components/CapsuleCarousel.vue'
import type { capsulePost } from '../Types/Interfaces'
import type { capsuleDataPull } from '../Types/Interfaces'

const userStore = useUserStore()
const route = useRoute()
const searchTerm = (route.params.term as string) || ''
const allPosts = ref<capsulePost[]>([])

onMounted(async () => {
  const { data, error } = await supabase
    .from<'CapsuleData', capsuleDataPull>('CapsuleData')
    .select()

  if (data && !error) {
    data.forEach((item) => {
      const unlockDate = new Date(item.Unlock)
      unlockDate.setHours(0, 0, 0, 0)
      const now = new Date()
      const timeLeft = unlockDate.getTime() - now.getTime()
      const isAvailable = timeLeft <= 0 || !item.Private

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
      let countdownDisplay = ''
      if (!isAvailable) {
        countdownDisplay = `${days}D, ${hours} Hrs`
      }

      const month = unlockDate.getMonth() + 1
      const day = unlockDate.getDate()
      const year = unlockDate.getFullYear()

      allPosts.value.push({
        id: item.CapsuleID,
        UsersID: item.UsersID,
        title: item.Header,
        description: `Unlocks on ${month}/${day}/${year}`,
        isAvailable,
        timeLeftInMs: timeLeft,
        countdownDisplay,
        imagePath: item.ImageUrl,
      })
    })
  }
})

const filteredPosts = computed(() =>
  allPosts.value.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
)

const opened = computed(() =>
  filteredPosts.value.filter((p) => p.isAvailable && p.timeLeftInMs <= 0),
)

const openingSoon = computed(() =>
  filteredPosts.value.filter(
    (p) => p.isAvailable && p.timeLeftInMs > 0 && p.timeLeftInMs <= 3 * 24 * 60 * 60 * 1000,
  ),
)

const notOpeningForAWhile = computed(() =>
  filteredPosts.value.filter((p) => p.isAvailable && p.timeLeftInMs > 3 * 24 * 60 * 60 * 1000),
)

const privateForever = computed(() =>
  filteredPosts.value.filter((p) => !p.isAvailable && p.UsersID !== userStore.user.userID),
)
</script>
