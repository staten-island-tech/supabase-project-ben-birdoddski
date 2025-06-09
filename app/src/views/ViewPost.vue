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
    <div v-else-if="post" class="card bg-base-100 w-96 shadow-xl mx-auto mt-12">
      <figure class="px-10 pt-10">
        <img
          v-if="post.imagePath"
          :src="post.imagePath"
          alt="Capsule Image"
          class="rounded-xl max-h-64 object-cover"
        />
        <p v-else class="italic text-gray-400 text-sm mt-4">
          No image available or no image attaced.
        </p>
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title text-purple-700 text-2xl">{{ post.title }}</h2>
        <p class="text-gray-700">{{ post.description }}</p>
        <p class="mt-2 text-sm text-gray-500">
          Unlocks: {{ new Date(post.countdown).toLocaleDateString() }}
        </p>
      </div>
    </div>
    <div v-else class="text-center mt-20 text-gray-500">Loading capsule...</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import router from '@/router'
import { useUserStore } from '@/stores/uservalue'
import { CapsulePost } from '@/Types/Interfaces'

const userStore = useUserStore()
const route = useRoute()
const searchQuery = ref('')

const post = ref<CapsulePost>({})

const tempPostName = route.params.id


const imageUrl = ref<string | undefined>()

onMounted(async () => {
  const { data: maindata, error: mainerror } = await supabase
    .from('CapsuleData')
    .select('*')
    .eq('CapsuleID', tempPostName)
    .single()
  if (!mainerror) {
    //console.log(maindata)
    if (post.value?.imagePath) {
      const { data, error } = await supabase.storage
        .from('images')
        .createSignedUrl(post.value.imagePath, 60 * 60 * 24) // 24 hours
      if (error) {
        console.log('Error getting signed URL:', error)
      } else {
        console.log(data)
        imageUrl.value = data?.signedUrl
      }
    }
    post.value = {
        id: maindata.CapsuleID,
        title: maindata.Header,
        description: maindata.Text,
        isAvailable: maindata.Private,
        timeLeft: 1,
        imagePath: imageUrl.value,
        countdown: 'jello',
      }
    console.log(post)
  }
})
</script>
