<template>
  <div>
    <h1>Email: </h1> <input type="text" placeholder="Type here" class="input" id="email"/>
    <h2>Username: </h2> <input type="text" placeholder="Type here" class="input" id="username"/>
    <h3>Password: </h3> <input type="text" placeholder="Type here" class="input" id="password"/>
    <button class="btn" onclick="signInWithPassword()">Login</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

interface User {
  Username: string
  Friends: string[]
}
const users = ref<User[]>([])

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'valid.email@supabase.io',
    password: 'example-password',
  })
  return(data)
}

export default {
  setup() {
    return {
      users,
    }
  },
}
</script>
