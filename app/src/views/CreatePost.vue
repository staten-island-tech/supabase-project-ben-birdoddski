<template>
  <div class="min-h-screen bg-gray-100">
    <navBar />
    <div v-if="userStore.user.loggedIn" class="relative px-4 py-10 bg-gray-100 flex justify-center">
      <div class="card bg-white w-full max-w-2xl shadow-xl p-6 rounded-2xl space-y-4">
        <h1 class="text-xl font-semibold">Header:</h1>
        <input
          v-model="Header"
          type="text"
          placeholder="Header"
          class="input input-bordered w-full"
        />

        <h1 class="text-xl font-semibold">Text:</h1>
        <input
          v-model="BodyText"
          type="text"
          placeholder="Text"
          class="input input-bordered w-full"
        />
        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
          <legend class="fieldset-legend">Post Options</legend>
          <label class="label space-x-2 items-center font-bold">
            <input v-model="visible" type="checkbox" class="toggle" />
            <span>Set to Private</span>
          </label>
        </fieldset>
        <div>
          <h1 class="text-xl font-semibold">Unlock Date:</h1>
          <input v-model="viewDate" type="date" class="input input-bordered w-full" />
        </div>
        <h1 class="text-xl font-semibold">Optional:</h1>
        <input
          type="file"
          ref="fileInput"
          class="file-input file-input-bordered file-input-primary w-full max-w-xs"
        />
        <div class="text-right">
          <button class="btn btn-primary mt-4" @click="PostMe">Create Post</button>
        </div>
        <div v-if="showError" class="text-red-400 text-center font-semibold">
          {{ showError }}
        </div>
      </div>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { Users } from 'lucide-vue-next'
import navBar from '../components/navBar.vue'

const userStore = useUserStore()
const router = useRouter()
const showError = ref<string>()

const searchQuery = ref<string>('')
const Header = ref<string>('')
const BodyText = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const viewDate = ref<string>('')
const visible = ref<boolean>(false)
const imagelink = ref<string | null>(null)
const filePath = ref<string>('')
async function PostMe() {
  const file = fileInput.value?.files?.[0] || null
  if (!Header.value || !BodyText.value || !viewDate.value) {
    showError.value = 'Please enter in all the required fields.'
    return
  }
  if (file) {
    function sanitizeFilename(name: string): string {
      return name.replace(/[^a-zA-Z0-9._-]/g, '_') //basically removes any characters that would cause supabase to freak out
    }
    const safeUsername = sanitizeFilename(userStore.user.username)
    const safeFileName = sanitizeFilename(file.name)
    const fileName = `${safeUsername}/${Date.now()}_${safeFileName}`
    //console.log(file?.type, file?.name, file?.size)
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
    if (uploadError) {
      showError.value = `Upload failed: ${uploadError.message}`
      return
    }
    const { data: signedData, error: signedError } = await supabase.storage
      .from('images')
      .createSignedUrl(fileName, 60 * 60 * 24)
    if (signedError) {
      showError.value = `Signed URL failed: ${signedError.message}`
      return
    }
    filePath.value = fileName
  }
  const { error: insertError } = await supabase.from('CapsuleData').insert({
    UsersID: userStore.user.userID,
    Header: Header.value,
    Text: BodyText.value,
    Image: filePath.value,
    Username: userStore.user.username,
    Unlock: viewDate.value,
    Private: visible.value,
  })
  if (insertError) {
    console.log(insertError)
    showError.value = insertError.message
  } else {
    router.push('/')
  }
}
</script>
