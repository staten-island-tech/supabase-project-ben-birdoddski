<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/uservalue'
const userStore = useUserStore()
onMounted(async () => {
  await userStore.initializeUser()
})
</script>
