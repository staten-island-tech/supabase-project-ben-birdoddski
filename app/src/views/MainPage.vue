<template>
  <div>
    <div v-if="!userStore.loggedIn">
      <RouterLink to="/signup" class="link link-primary">Sign Up</RouterLink>
      <br />
      <RouterLink to="/login" class="link link-primary">Login</RouterLink>
    </div>
    <div v-if="userStore.loggedIn">
      <h1>kello</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '../stores/uservalue'
export default {
  name: 'MainPage',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
}
</script>
