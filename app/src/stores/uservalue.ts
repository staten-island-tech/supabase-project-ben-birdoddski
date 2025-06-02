import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import type {LoginUser} from '../Types/Interfaces'
export const useUserStore = defineStore('user', () => {
  const user = ref<LoginUser>({
    userID: '',
    email: '',
    username: '',
    password: '',
    loggedIn: false,
  })
  async function setUser(supabaseUser: User | null) {
    if (user && supabaseUser) {
      user.value.userID = supabaseUser.id
      user.value.email = supabaseUser.email||''
      user.value.loggedIn = true
      user.value.password = ''
      const { data, error } = await supabase
        .from('Users')
        .select('Username')
        .eq('id', supabaseUser.id)
        .single()
      if (!error) {
        user.value.username = data.Username || ''
      }
    } else {
      clearUser()
    }
  }
  function clearUser() {
    user.value = {
      userID: '',
      email: '',
      username: '',
      password: '',
      loggedIn: false,
    }
  }
  return {
    user,
    setUser,
    clearUser,
  }
}, {
  persist: true,
})