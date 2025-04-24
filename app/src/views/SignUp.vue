<template>
    <div>
      <h1>Sign Up:</h1>
      <h2>Email:</h2>
      <input v-model="emailSignUp" type="text" placeholder="Username" class="input" />
      <h2>Password:</h2>
      <input v-model="passwordSignUp" type="password" placeholder="Password" class="input" />
      <button class="btn" @click="signUpWithUser()">Sign up</button>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, ref } from 'vue'
  import { supabase } from '../lib/supabaseClient'
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
      return {
        userStore,
        emailSignUp,
        passwordSignUp,
        signUpWithUser,
      }
    },
  }
  </script>
  