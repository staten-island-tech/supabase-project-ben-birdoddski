<template>
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
          to="/CreatePost"
          class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition"
        >
          Create Post
        </RouterLink>

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

        <button
          @click="signOut"
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useUserStore } from '../stores/uservalue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const searchQuery = ref('')
    const signOut = async () => {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        userStore.clearUser()
        router.push('/login')
      }
    }
    return {
      router,
      searchQuery,
      userStore,
      signOut,
    }
  },
})
</script>
