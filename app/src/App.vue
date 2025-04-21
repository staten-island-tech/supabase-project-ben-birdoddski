<template>
  <div>
    <h1>Email: </h1> <input v-model="emailSignUp" type="text" placeholder="Search Here!" class="input"/>
    <h3>Password: </h3> <input v-model="passwordSignUp" type="text" placeholder="Search Here!" class="input"/>
    <button class="btn" @click="signUpWithUser()">Sign up</button>
    <h1>Email: </h1> <input v-model="emailLogIn" type="text" placeholder="Search Here!" class="input"/>
    <h3>Password: </h3> <input v-model="passwordLogIn" type="text" placeholder="Search Here!" class="input"/>
    <button class="btn" @click="signInWithUser()">Login</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import type { User } from './Types/Interfaces.ts'
const emailLogIn = ref<string>('')
const passwordLogIn = ref<string>('')
const emailSignUp = ref<string>('')
const passwordSignUp = ref<string>('')
const users = ref<User[]>([])
async function signUpWithUser() {
  const { data, error } = await supabase.auth.signUp({
    email: emailSignUp.value,
    password: passwordSignUp.value,
  })
}
async function signInWithUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailLogIn.value,
    password: passwordLogIn.value,
  })
}
</script>
