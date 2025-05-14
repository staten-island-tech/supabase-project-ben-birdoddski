<template>
  <div>
    <div v-if="!userStore.loggedIn">
      <RouterLink to="/signup" class="link link-primary">Sign Up</RouterLink>
      <br />
      <RouterLink to="/login" class="link link-primary">Login</RouterLink>
    </div>
    <div v-if="userStore.loggedIn">
      <h1>Hello</h1>
      <h2 v-if="showUsers">Test: {{ showUsers }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import type DatabaseUser from '../Types/Interfaces'
export default {
  name: 'MainPage',
  setup() {
    const userStore = useUserStore()
    const showUsers = ref<Array<string>|null>()
    async function hello() {
      const { data, error } = await supabase.from('Users').select().textSearch('Username', `Adcad`)
      showUsers.value=data
    }
    return { userStore, showUsers }
  },
}
</script>
