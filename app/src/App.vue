<template>
  <h1>hello</h1>
  <ul>
    <li v-for="user in users" :key="user.Username">{{ user.Username }}</li>
  </ul>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

interface User {
  Username: string
}
const users = ref<User[]>([])

async function getUsers() {
  const { data, error } = await supabase.from('Users').select('Username')
  users.value = data || []
}

export default {
  setup() {
    onMounted(() => {
      getUsers()
    })
    return {
      users
    }
  }
}
</script>
