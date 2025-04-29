<template>
  <div>
    <h1>Sign Up:</h1>
    <h2>Email:</h2>
    <input v-model="userStore.username" type="text" placeholder="Username" class="input" />
    <h2>Password:</h2>
    <input v-model="userStore.password" type="password" placeholder="Password" class="input" />
    <button class="btn" @click="signUpWithUser()">Sign up!</button>
    <h1 v-if="showError">{showError.value}</h1>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useLoginStore } from '../stores/loginvalue'
export default {
  setup() {
    const userStore = useLoginStore()
    const showError = ref<string>()
    async function signUpWithUser() {
      const { data, error } = await supabase.auth.signUp({
        email: userStore.username,
        password: userStore.password,
      })
      if (error) {
        console.log(error)
      } else {
        console.log(data)
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
