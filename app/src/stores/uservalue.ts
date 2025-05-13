import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const email = ref<string>('')
  const username = ref<string>('')
  const password = ref<string>('')
  const loggedIn = ref<boolean>(false)
  return {
    email,
    username,
    password,
    loggedIn
  }
})
