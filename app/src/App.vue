<template>
  <div>
    <h2>Username: </h2> <input type="text" placeholder="Type here" class="input" />
    <h3>Password: </h3> <input type="text" placeholder="Type here" class="input" />
    <button class="btn">Login</button>
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

async function getUsers() {
  const { data } = await supabase.from('Users').select('Username, Friends')
  console.log(data)
  users.value = data || []
}

export default {
  setup() {
    onMounted(() => {
      getUsers()
    })
    return {
      users,
    }
  },
}
</script>
