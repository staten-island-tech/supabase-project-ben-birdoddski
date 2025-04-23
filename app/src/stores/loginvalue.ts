import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('user', () => {
  const username = ref<string>('')
  const password = ref<string>('')
  const loggedin = ref<boolean>(false)
  return {
    username,
    password,
    loggedin
  }
})
