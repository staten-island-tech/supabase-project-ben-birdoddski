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

        if (!error && data) {
          user.value.username = data.Username || ''
          if (router.currentRoute.value.path === '/login') {
            router.push('/')
          }
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

    async function initializeUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await setUser(session.user)
      } else {
        clearUser()
      }
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        clearUser()
      }
    })

    return {
      user,
      setUser,
      clearUser,
      initializeUser,
    }
  },
  {
    persist: true,
  },
)
