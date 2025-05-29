import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const email = ref<string|undefined>('')
  const username = ref<string>('')
  const password = ref<string>('')
  const loggedIn = ref<boolean>(false)
  const userID = ref<string>('')
  async function setUser(user: User | null) {
    if (user) {
      userID.value = user.id
      email.value = user.email
      loggedIn.value = true
      password.value = ''
      const { data, error } = await supabase.from('Users').select('username').eq('id', user.id).single()
      if (!error && data) {
        username.value = data.username||''
      }
    } else {
      userID.value = ''
      email.value = ''
      username.value = ''
      password.value = ''
      loggedIn.value = false
    }
  }
  return {
    userID,
    email,
    username,
    password,
    loggedIn,
    setUser,
  }
})
