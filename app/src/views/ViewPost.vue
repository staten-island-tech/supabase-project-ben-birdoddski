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
    <div v-else-if="post" class="card bg-base-100 w-96 shadow-xl mx-auto mt-12">
      <figure class="px-10 pt-10">
        <img
          v-if="post.imagePath"
          :src="post.imagePath"
          alt="Capsule Image"
          class="rounded-xl max-h-64 object-cover"
        />
        <p v-else class="italic text-gray-400 text-sm mt-4">
          No image available or no image attached.
        </p>
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title text-purple-700 text-2xl">{{ post.title }}</h2>
        <p class="text-gray-700">{{ post.description }}</p>
        <p class="mt-2 text-sm text-gray-500">Unlocked on: {{ releasedDate }}</p>
        <RouterLink
          v-if="creatorUsername"
          :to="`/profile/${creatorUsername}/${post.UsersID}`"
          class="mt-2 text-purple-600 underline text-sm hover:text-purple-800 transition"
        >
          View {{ creatorUsername }}'s Profile
        </RouterLink>
      </div>
    </div>
    <div v-else class="text-center mt-20 text-gray-500">Loading capsule...</div>
    <div class="text-center">
      <h1 class="text-black">ADD COMMENTS HERE</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import { capsulePost } from '../Types/Interfaces'
import navBar from '../components/navBar.vue'

const userStore = useUserStore()
const route = useRoute()
const post = ref<capsulePost>()
const tempPostName = route.params.id
const imageUrl = ref<string | undefined>()
const releasedDate = ref('')
const creatorUsername = ref('')

onMounted(async () => {
  const { data: maindata, error: mainerror } = await supabase
    .from('CapsuleData')
    .select('*')
    .eq('CapsuleID', tempPostName)
    .single()

  if (!mainerror && maindata) {
    const unlockDate = new Date(maindata.Unlock)
    const month = unlockDate.getMonth() + 1
    const day = unlockDate.getDate()
    const year = unlockDate.getFullYear()
    releasedDate.value = `${month}/${day}/${year}`

    post.value = {
      id: maindata.CapsuleID,
      UsersID: maindata.UsersID,
      title: maindata.Header,
      description: maindata.Text,
      isAvailable: maindata.Private,
      timeLeftInMs: 1,
      imagePath: maindata.ImageUrl,
      countdownDisplay: 'jello',
    }
    const { data: postCreator, error: creatorError } = await supabase
      .from('Users')
      .select('Username')
      .eq('id', post.value.UsersID)
      .single()

    if (!creatorError) {
      creatorUsername.value = postCreator.Username
    }
    if (post.value.imagePath) {
      const { data, error } = await supabase.storage
        .from('images')
        .createSignedUrl(post.value.imagePath, 60 * 60 * 24)

      if (!error) {
        imageUrl.value = data?.signedUrl
        post.value.imagePath = imageUrl.value
      }
    }
    console.log(post)
  }
})
</script>
