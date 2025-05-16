<template>
  <Browse :search="`${$route.params.term}`"/>
</template>

<script setup>
import Browse from "@/components/Browse.vue"
</script>
