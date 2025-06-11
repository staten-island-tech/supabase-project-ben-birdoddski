<template>
  <div class="flex h-screen flex-col">
    <navBar />
    <div class="flex-1 h-screen flex items-center justify-center bg-base-200">
      <div class="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-box">
        <h1 class="text-3xl font-bold text-center">Sign Up</h1>

        <div class="form-control w-full">
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
            <span class="font-bold">Username</span>
          </label>
          <input
            v-model="userStore.user.username"
            type="text"
            placeholder="Username"
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

        <div class="text-center w-full">
          <button class="btn btn-primary w-full" @click="signUpWithUser()">Sign up!</button>
        </div>

        <div class="text-center">
          <RouterLink to="/" v-if="userStore.user.loggedIn" class="text-red-400 font-semibold">
            Reroute to main page
          </RouterLink>
        </div>

        <div class="text-center">
          <RouterLink to="/login" class="link link-primary"
            >Already have an account? Log in here!</RouterLink
          >
        </div>

        <div v-if="showError" class="text-red-400 text-center font-semibold">
          {{ showError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import navBar from '../components/NavBar.vue'

const userStore = useUserStore()
const showError = ref<string>()
async function signUpWithUser() {
  const { data, error } = await supabase.auth.signUp({
    email: userStore.user.email,
    password: userStore.user.password,
  })
  if (error) {
    showError.value = error.message
    return
  }
  const user = data?.user
  if (user) {
    const { error: insertError } = await supabase.from('Users').insert({
      id: user.id,
      Email: user.email,
      Username: userStore.user.username,
      Bio: '',
      Following: [],
      Followers: [],
    })
    if (insertError) {
      showError.value = insertError.message
    }
  }
}
</script>
