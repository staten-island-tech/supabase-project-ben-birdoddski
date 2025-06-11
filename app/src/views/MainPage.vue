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
        >
          Sign Up
        </RouterLink>
        <RouterLink
          to="/login"
          class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-5 rounded-full font-medium transition"
        >
          Login
        </RouterLink>
      </div>
    </div>

    <div v-if="userStore.user.loggedIn" class="relative px-4 py-10 bg-gray-100">
      <h2 class="text-3xl font-bold mb-6 text-center">Explore Time Capsules</h2>

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opened!</h1>
      <CapsuleCarousel :posts="allPosts.filter((p) => p.isAvailable && p.timeLeftInMs <= 0)" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opening Soon:</h1>
      <CapsuleCarousel
        :posts="
          allPosts.filter(
            (p) => p.isAvailable && p.timeLeftInMs > 0 && p.timeLeftInMs <= 3 * 24 * 60 * 60 * 1000,
          )
        "
      />
      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Not Opening For A While:</h1>
      <CapsuleCarousel
        :posts="
          allPosts.filter(
            (p) => p.isAvailable && p.timeLeftInMs > 0 && p.timeLeftInMs >= 3 * 24 * 60 * 60 * 1000,
          )
        "
      />
      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">
        Private Posts That Won't Open:
      </h1>
      <capsuleCarousel
        :posts="
          allPosts.filter(
            (p) =>
              !p.isAvailable || p.timeLeftInMs > 3 * 24 * 60 * 60 * 1000 || !p.countdownDisplay,
          )
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import { RouterLink } from 'vue-router'
import CapsuleCarousel from '../components/CapsuleCarousel.vue'
import navBar from '../components/navBar.vue'
import type { capsulePost } from '../Types/Interfaces'
import type { capsuleDataPull } from '../Types/Interfaces'

const userStore = useUserStore()
const allPosts = ref<capsulePost[]>([])

onMounted(async () => {
  const { data, error } = await supabase
    .from<'CapsuleData', capsuleDataPull>('CapsuleData')
    .select()

  if (data?.length) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      const unlockDate = new Date(item.Unlock)
      unlockDate.setHours(0, 0, 0, 0)

      const now = new Date()
      const timeLeft = unlockDate.getTime() - now.getTime()

      const isAvailable = timeLeft <= 0 || !item.Private

      let countdownDisplay = ''
      if (timeLeft <= 0) {
        countdownDisplay = '0 days, 0 hours'
      } else {
        countdownDisplay =
          Math.floor(timeLeft / (1000 * 60 * 60 * 24)) +
          'D, ' +
          Math.floor((timeLeft / (1000 * 60 * 60)) % 24) +
          ' Hrs'
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
    }
  }
})
</script>
