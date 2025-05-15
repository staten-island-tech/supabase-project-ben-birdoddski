<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-box">
      <h1 class="text-3xl font-bold text-center">Sign Up</h1>

      <div class="form-control w-full">
        <label class="">
          <span class="font-bold">Email</span>
        </label>
        <br />
        <input
          v-model="userStore.email"
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
          v-model="userStore.username"
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
          v-model="userStore.password"
          type="password"
          placeholder="Password"
          class="input input-bordered w-full"
        />
      </div>

      <div class="text-center w-full">
        <button class="btn btn-primary w-full" @click="signUpWithUser()">Sign up!</button>
      </div>

      <div class="text-center">
        <RouterLink to="/" v-if="userStore.loggedIn" class="text-red-400 font-semibold">
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
</template>

<script lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
export default {
  setup() {
    const userStore = useUserStore()
    const showError = ref<string>()
    async function signUpWithUser() {
      const { data, error } = await supabase.auth.signUp({
        email: userStore.email,
        password: userStore.password,
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
          Username: userStore.username,
          Friends: [],
        })
        if (insertError) {
          showError.value = insertError.message
        }
      }
    }
    return {
      userStore,
      showError,
      signUpWithUser,
    }
  },
}
</script>
