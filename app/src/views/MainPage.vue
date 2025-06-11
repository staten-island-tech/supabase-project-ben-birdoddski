<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
    <NavBar />
    <div v-if="!userStore.user.loggedIn" class="flex-1 flex flex-col justify-center items-center">
      <div
        class="bg-white/80 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 max-w-lg w-full text-center mt-8 sm:mt-16"
      >
        <h1 class="text-3xl sm:text-5xl font-extrabold text-purple-700 mb-4 drop-shadow">
          Welcome to Time Capsule
        </h1>
        <p class="text-base sm:text-lg text-gray-700 mb-8">
          Sign up or log in to view and create time capsules!
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink
            to="/signup"
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-full font-semibold shadow transition-all duration-200 w-full sm:w-auto"
            >Sign Up</RouterLink
          >
          <RouterLink
            to="/login"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all duration-200 w-full sm:w-auto"
            >Login</RouterLink
          >
        </div>
      </div>
    </div>
    <div v-if="userStore.user.loggedIn" class="flex-1 px-2 sm:px-4 py-6 sm:py-10 bg-transparent">
      <h2
        class="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-10 text-center text-purple-700 drop-shadow"
      >
        Explore Time Capsules
      </h2>
      <div class="space-y-6 sm:space-y-10 max-w-full sm:max-w-5xl mx-auto">
        <section class="bg-white/90 rounded-2xl shadow-xl p-3 sm:p-6">
          <h1
            class="font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 text-purple-700"
          >
            Opened!
          </h1>
          <CapsuleCarousel :posts="opened" />
        </section>
        <section class="bg-white/90 rounded-2xl shadow-xl p-3 sm:p-6">
          <h1
            class="font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 text-pink-600"
          >
            Opening Soon:
          </h1>
          <CapsuleCarousel :posts="openingSoon" />
        </section>
        <section class="bg-white/90 rounded-2xl shadow-xl p-3 sm:p-6">
          <h1
            class="font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 text-blue-600"
          >
            Not Opening For A While:
          </h1>
          <CapsuleCarousel :posts="notOpeningForAWhile" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import { RouterLink } from 'vue-router'
import CapsuleCarousel from '../components/CapsuleCarousel.vue'
import NavBar from '../components/NavBar.vue'
import type { capsulePost } from '../Types/Interfaces'
import type { capsuleDataPull } from '../Types/Interfaces'

const MS_IN_DAY = 24 * 60 * 60 * 1000
const MS_IN_3_DAYS = 3 * MS_IN_DAY

const userStore = useUserStore()
const allPosts = ref<capsulePost[]>([])

const opened = computed(() =>
  allPosts.value.filter((p) => p.isAvailable && p.timeLeftInMs <= 0 && p.display),
)
const openingSoon = computed(() =>
  allPosts.value.filter(
    (p) => p.isAvailable && p.timeLeftInMs > 0 && p.timeLeftInMs <= MS_IN_3_DAYS && p.display,
  ),
)
const notOpeningForAWhile = computed(() =>
  allPosts.value.filter((p) => p.isAvailable && p.timeLeftInMs > MS_IN_3_DAYS && p.display),
)
const privateForever = computed(() =>
  allPosts.value.filter((p) => !p.isAvailable && p.UsersID !== userStore.user.userID && p.display),
)

onMounted(async () => {
  const { data, error } = await supabase
    .from<'CapsuleData', capsuleDataPull>('CapsuleData')
    .select()

  if (data?.length) {
    allPosts.value = data.map((item) => {
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
          Math.floor(timeLeft / MS_IN_DAY) +
          'D, ' +
          Math.floor((timeLeft / (1000 * 60 * 60)) % 24) +
          ' Hrs'
      }
      const month = unlockDate.getMonth() + 1
      const day = unlockDate.getDate()
      const year = unlockDate.getFullYear()
      return {
        id: item.CapsuleID,
        UsersID: item.UsersID,
        title: item.Header,
        description: `Unlocks on ${month}/${day}/${year}`,
        isAvailable,
        timeLeftInMs: timeLeft,
        countdownDisplay,
        imagePath: item.ImageUrl,
        display: item.Private ? item.UsersID === userStore.user.userID : true,
      }
    })
  }
})
</script>
