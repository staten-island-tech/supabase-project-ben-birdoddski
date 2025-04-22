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
    <input v-model="emailLogIn" type="text" placeholder="Username" class="input" />
    <h2>Password:</h2>
    <input v-model="passwordLogIn" type="password" placeholder="Password" class="input" />
    <button class="btn" @click="signInWithUser()">Login</button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient'
import {useLoginStore}from '@/stores/loginvalue.ts'
import { storeToRefs } from 'pinia'
const user = useLoginStore()
export default {
  setup() {
    const emailLogIn = ref<string>('') //move
    const passwordLogIn = ref<string>('') //move
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
        email: emailLogIn.value,
        password: passwordLogIn.value,
      })
      if (error) {
        console.log(error)
      } else {
        console.log(data)
      }
    }
    return {
      emailLogIn,
      passwordLogIn,
      emailSignUp,
      passwordSignUp,
      signUpWithUser,
      signInWithUser,
    }
  },
}
</script>
