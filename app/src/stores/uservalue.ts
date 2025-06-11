import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import type { loginUser } from '../Types/Interfaces'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter()

    const user = ref<loginUser>({
      userID: '',
      email: '',
      username: '',
      password: '',
      loggedIn: false,
    })

    async function setUser(supabaseUser: User | null) {
      if (user && supabaseUser) {
        user.value.userID = supabaseUser.id
        user.value.email = supabaseUser.email || ''
        user.value.loggedIn = true
        user.value.password = ''

        const { data, error } = await supabase
          .from('Users')
          .select('Username')
          .eq('id', supabaseUser.id)
          .single()

        if (!error && data && router.currentRoute.value.path === '/login') {
          user.value.username = data.Username || ''

          router.push('/')
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
  },
  {
    persist: true,
  },
)
