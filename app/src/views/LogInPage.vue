<template>
  <div class="flex h-screen flex-col">
    <navBar />

    <div class="flex-1 h-screen flex items-center justify-center bg-base-200">
      <div class="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-box">
        <h1 class="text-3xl font-bold text-center">Log In</h1>

        <div class="form-control">
          <label class="">
            <span class="font-bold">Email</span>
          </label>
          <br />
          <input
            @keyup.enter="signInWithUser"
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
            @keyup.enter="signInWithUser"
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
import navBar from '../components/navBar.vue'
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
