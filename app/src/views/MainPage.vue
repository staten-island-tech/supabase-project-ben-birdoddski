<template>
  <div>
    <div>
      <RouterLink to="/signup" class="link link-primary">Sign Up</RouterLink>
    <br />
    <RouterLink to="/login" class="link link-primary">Login</RouterLink>
    </div>
    <div>
      <h1>kello</h1>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MainPage',
}
// if not logged in, display links to login/signup
// otherwise display the main page 
</script>
