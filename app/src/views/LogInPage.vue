<template>
  <div>
    <h1>Log In:</h1>
    <h2>Email:</h2>
    <input v-model="userStore.username" type="text" placeholder="Username" class="input" />
    <h2>Password:</h2>
    <input v-model="userStore.password" type="password" placeholder="Password" class="input" />
    <button class="btn" @click="signInWithUser()">Login</button>
    <h1 v-if="showError">{showError.value}</h1>
    <h1 v-if="userStore.loggedIn">We're in!!!!!</h1>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useLoginStore } from '../stores/loginvalue'
export default {
  setup() {
    const showError = ref<string>('')
    const userStore = useLoginStore()
    async function signInWithUser() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userStore.username,
        password: userStore.password,
      })
      if (error) {
        console.log(error)
      } else {
        userStore.loggedIn=true
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