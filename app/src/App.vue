<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import { useUserStore } from './stores/uservalue'
const userStore = useUserStore()
onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user && !userStore.user.loggedIn) {
    await userStore.setUser(user)
  }
  supabase.auth.onAuthStateChange(async (event, session) => {
    // for when userstate changes, logging in, logging out
    if (session?.user) {
      await userStore.setUser(session.user)
    } else {
      userStore.clearUser()
    }
  })
})
</script>
