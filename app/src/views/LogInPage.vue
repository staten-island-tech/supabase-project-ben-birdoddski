<template>
  <div class="flex h-screen flex-col">
    <header class="bg-white shadow sticky top-0 z-50 h-15">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-purple-600">Time Capsule</RouterLink>

        <input
          type="text"
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
    <div class="flex-1 h-screen flex items-center justify-center bg-base-200">
      <div class="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-box">
        <h1 class="text-3xl font-bold text-center">Log In</h1>

        <div class="form-control">
          <label class="">
            <span class="font-bold">Email</span>
          </label>
          <br />
          <input
            v-model="userStore.user.email"
            type="text"
            placeholder="Email"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control">
          <label class="">
            <span class="font-bold">Password</span>
          </label>
          <input
            v-model="userStore.user.password"
            type="password"
            placeholder="Password"
            class="input input-bordered w-full"
          />
        </div>

        <div class="text-center">
          <button class="btn btn-primary w-full" @click="signInWithUser">Login</button>
        </div>

        <div v-if="showError" class="text-error text-center font-semibold">
          {{ showError }}
        </div>

        <div class="text-center">
          <RouterLink to="/" v-if="userStore.user.loggedIn" class="text-red-400 font-semibold">
            Reroute to main page
          </RouterLink>
        </div>

        <div class="text-center">
          <RouterLink to="/signup" class="link link-primary"
            >Don't have an account? Sign up here!</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'

const showError = ref<string>('')
const redirect = useRouter()
const userStore = useUserStore()
async function signInWithUser() {
  if (userStore.user.email && userStore.user.password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userStore.user.email,
      password: userStore.user.password,
    })
    if (error) {
      showError.value = error.message
    } else {
      userStore.user.loggedIn = true
      userStore.user.password = ''
      redirect.push('/')
    }
  }
}
if (userStore.user.loggedIn) {
  redirect.push('/')
}
</script>
