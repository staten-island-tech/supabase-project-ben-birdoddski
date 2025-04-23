<template>
  <div>
    <h1>Sign Up:</h1>
    <h2>Email:</h2>
    <input v-model="emailSignUp" type="text" placeholder="Username" class="input" />
    <h2>Password:</h2>
    <input v-model="passwordSignUp" type="password" placeholder="Password" class="input" />
    <button class="btn" @click="signUpWithUser()">Sign up</button>
    <h1>Log In:</h1>
    <h2>Email:</h2>
    <input v-model="userStore.username" type="text" placeholder="Username" class="input" />
    <h2>Password:</h2>
    <input v-model="userStore.password" type="password" placeholder="Password" class="input" />
    <button class="btn" @click="signInWithUser()">Login</button>
    <h1 v-if="userStore.loggedIn">We're in!!!!!</h1>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { supabase } from './lib/supabaseClient'
import { useLoginStore } from '@/stores/loginvalue'
export default {
  setup() {
    const userStore = useLoginStore()
    const emailSignUp = ref<string>('') //move
    const passwordSignUp = ref<string>('') //move
    async function signUpWithUser() {
      const { data, error } = await supabase.auth.signUp({
        email: emailSignUp.value,
        password: passwordSignUp.value,
      })
      if (error) {
        console.log(error)
      } else {
        console.log(data)
      }
    }
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
      emailSignUp,
      passwordSignUp,
      signUpWithUser,
      signInWithUser,
    }
  },
}
</script>
