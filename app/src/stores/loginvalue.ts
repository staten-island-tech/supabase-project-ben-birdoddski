import { defineStore } from 'pinia'
import { ref } from 'vue'
import User from '../Types/Interfaces.ts'
interface User {
  username: string
  password: string
  loggedin: boolean
}
export const useLoginStore = defineStore('user', {
  state: (): User => {
    const email = ref<string>('') //move
    const password = ref<string>('') //move
    const loggedin=ref<boolean>(false)
    return {
      username: email.value,
      password: password.value,
      loggedin: loggedin.value
    }
  },
})