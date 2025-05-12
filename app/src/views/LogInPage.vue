<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-box">
      <h1 class="text-3xl font-bold text-center">Log In (i luv chatgpt styling)</h1>

      <div class="form-control text-center">
        <label class="">
          <span class="font-bold">Username</span>
        </label>
        <input v-model="userStore.username" type="text" placeholder="Username" class="input input-bordered" />
      </div>

      <div class="form-control text-center">
        <label class="">
          <span class="font-bold">Password</span>
        </label>
        <input v-model="userStore.password" type="password" placeholder="Password" class="input input-bordered" />
      </div>

      <div class="text-center">
        <button class="btn btn-primary w-[70%]" @click="signInWithUser()">Login</button>
      </div>

      <div v-if="showError" class="text-error text-center font-semibold">
        {{ showError }}
      </div>

      <div v-if="userStore.loggedIn" class="text-red-400 text-center font-semibold">
        Reroute to main page
      </div>

      <div class="text-center">
        <RouterLink to="/signup" class="link link-primary">Don't have an account? Sign up here!</RouterLink>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
//reroute to 
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
export default {
  setup() {
    const showError = ref<string>('')
    const userStore = useUserStore()
    async function signInWithUser() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userStore.username,
        password: userStore.password,
      })
      if (error) {
        console.error('Error signing up:', error.message)
      } else {
        userStore.loggedIn = true
      }
    }
    return {
      userStore,
      showError,
      signInWithUser,
    }
  },
}
</script>
