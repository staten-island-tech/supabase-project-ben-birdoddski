<template>
  <h1 class="btn btn-primary">Hello</h1>
  <ul>
    <li v-for="user in users" :key="user.id">{{ Username.name }}</li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const users = ref([])

async function getUsers() {
  const { data } = await supabase.from('Users').select()
  users.value = data
}

onMounted(() => {
  getUsers()
})
</script>