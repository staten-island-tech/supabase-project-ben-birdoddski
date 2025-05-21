<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-purple-600"> Time Capsule </RouterLink>
        <input
          type="text"
          @keyup.enter="router.push('/search/' + searchQuery)"
          v-model="searchQuery"
          placeholder="Search capsules..."
          class="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div v-if="userStore.loggedIn" class="ml-4 flex items-center space-x-4">
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
    <div v-if="userStore.loggedIn" class="relative px-4 py-10 bg-gray-100 flex justify-center">
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
          <label class="label space-x-2 items-center">
            <input v-model="visible" type="checkbox" class="toggle" />
            <span>Visible for friends?</span>
          </label>
        </fieldset>
        <div>
          <h1 class="text-xl font-semibold">Unlock Date:</h1>
          <input v-model="viewDate" type="date" class="input input-bordered w-full" />
        </div>
        <h1 class="text-xl font-semibold">Optional:</h1>
        <input ref="fileInput" type="file" class="file-input w-full max-w-xs" />
        <div class="text-right">
          <button class="btn btn-primary mt-4" @click="postme">Create Post</button>
        </div>
        <div v-if="showError" class="text-red-400 text-center font-semibold">
          {{ showError }}
        </div>
      </div>
    </div>
    <div v-if="!userStore.loggedIn" class="text-center py-24 px-6">
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

const userStore = useUserStore()
const router = useRouter()
const showError = ref<string>()
const viewDate = ref('')
const visible = ref('')
const searchQuery = ref('')
const Header = ref('')
const BodyText = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

async function postme() {
  const file = fileInput.value?.files?.[0] || null
  const { error: insertError } = await supabase.from('Capsule Data').insert({
    Header: Header.value,
    Text: BodyText.value,
    Image: file, //make this into the URL NOT ACTUAL FILE
    User: userStore.username,
    Unlock: viewDate.value,
    Visbility: visible.value,
  })
  if (insertError) {
    showError.value = insertError.message
  }
}
</script>
