<template>
  <header class="bg-white shadow sticky top-0 z-50">
    <div
      class="max-w-7xl mx-auto px-2 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
    >
      <div class="flex flex-col items-start w-full sm:w-auto">
        <RouterLink to="/" class="flex items-center gap-2 mb-2 sm:mb-0">
          <img src="/src/assets/logo.svg" alt="Time Capsule Logo" class="h-8 w-8 sm:h-10 sm:w-10" />
          <span class="text-2xl font-bold text-purple-600">Time Capsule</span>
        </RouterLink>
        <input
          type="text"
          v-if="userStore.user.loggedIn"
          @keyup.enter="searchQuery && searchQuery.trim() && router.push('/search/' + searchQuery)"
          v-model="searchStore.searchQuery"
          placeholder="Search capsules..."
          class="w-full text-gray-600 sm:w-80 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
      <div
        v-if="userStore.user.loggedIn"
        class="flex flex-row flex-nowrap md:gap-3 items-center justify-end w-full sm:w-auto mt-2 sm:mt-0"
      >
        <RouterLink
          to="/CreatePost"
          class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition min-w-[120px] text-center"
        >
          Create Post
        </RouterLink>
        <RouterLink
          to="/postsgraph"
          class="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-full font-medium transition min-w-[120px] text-center"
        >
          Unlock Graph
        </RouterLink>
        <RouterLink
          v-if="profileData"
          :to="`/profile/${profileData.Username}/${userStore.user.userID}`"
          class="relative group rounded-full p-2 hover:bg-gray-200 transition flex items-center min-w-[48px] justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-purple-600 hover:text-purple-800 transition"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
          </svg>
          <span class="ml-2 hidden sm:inline font-medium text-purple-700">
            {{ profileData.Username }}
          </span>
        </RouterLink>
        <button
          @click="signOut"
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full font-medium transition min-w-[120px] text-center"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '../stores/uservalue'
import { supabase } from '../lib/supabaseClient'
import { useSearchStore } from '../stores/searchvalue'

const router = useRouter()
const userStore = useUserStore()
const searchStore = useSearchStore()
const searchQuery = computed(() => searchStore.searchQuery)

const profileData = ref<{ Username?: string } | null>(null)

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    userStore.clearUser()
    router.push('/login')
  }
}

onMounted(async () => {
  if (userStore.user.loggedIn) {
    const userId = userStore.user.userID
    const { data, error } = await supabase
      .from('Users')
      .select('Username')
      .eq('id', userId)
      .single()
    if (!error) {
      profileData.value = data
    } else {
      console.log('Error fetching username:', error)
    }
  }
})
</script>
