<template>
  <div>
    <h1>Sign Up:</h1>
    <h2>Email:</h2>
    <input v-model="userStore.email" type="text" placeholder="Email" class="input" />
    <h2>Username:</h2>
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
import { useUserStore } from '../stores/uservalue'
import type DatabaseUser from '../Types/Interfaces'
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
        console.log(error)
      } else {
        const user = data?.user
        if (user) {
          //ts is so bummy this took 10 minutes to figure out
          const { error } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            username: userStore.username,
            friends: [],
          })
          if (error) {
            console.log(error)
          } else {
            console.log('successfully inserted user into table')
          }
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
