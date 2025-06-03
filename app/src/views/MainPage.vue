<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-purple-600">Time Capsule</RouterLink>

        <input
          type="text"
          @keyup.enter="router.push('/search/' + searchQuery)"
          v-model="searchQuery"
          placeholder="Search capsules..."
          class="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div v-if="userStore.user.loggedIn" class="ml-4 flex items-center space-x-4">
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
    <div v-if="userStore.user.loggedIn" class="relative px-4 py-10 bg-gray-100">
      <div class="text-center">
        <RouterLink to="/CreatePost" class="link link-primary">testing</RouterLink>
      </div>
      <div class="text-center">
        <RouterLink to="/ViewPost" class="link link-primary">testing2</RouterLink>
      </div>
      <h2 class="text-3xl font-bold mb-6 text-center">Explore Time Capsules</h2>
      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opening Soon</h1>
      <CapsuleCarousel :posts="examplePosts.filter((p) => p.countdown && !p.isAvailable)" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">Opened!</h1>
      <CapsuleCarousel :posts="examplePosts.filter((p) => p.isAvailable)" />

      <h1 class="font-bold text-lg p-3 bg-slate-500 w-fit underline">
        Staying locked for a while...
      </h1>
      <CapsuleCarousel :posts="examplePosts.filter((p) => !p.countdown)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {supabase} from "../lib/supabaseClient"
import { ref, onMounted, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useUserStore } from '../stores/uservalue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import CapsuleCarousel from '../components/CapsuleCarousel.vue'
import { useRoute } from 'vue-router'
import type { CapsulePost } from '../Types/Interfaces'

const userStore = useUserStore()
const router = useRouter()
const searchQuery = ref('')
const examplePosts: CapsulePost[] = []
const { data, error } = await supabase.from('CapsuleData').select()
if (data?.length) {
  console.log(data)
  for (let i=0; i<=data?.length;i++) {
    let availability=ref(false)
    let timeUntilOpen=ref()
    console.log(Date.now())
    //will be number, use current date and calculate to time until opened
    if (data[i].Private=false&&(timeUntilOpen.value<0)) {
      availability.value=true
    }
    let timeDisplay=ref('')
    //make into days, hours until open
    let description=ref(`Unlocks on, ${data[i].Unlock}`)
    examplePosts.push({
      id: data[i].CapsuleID,
      title: data[i].Header,
      description: description.value,
      isAvailable: availability.value,
      countdown: timeDisplay.value,})
  }
}
</script>
