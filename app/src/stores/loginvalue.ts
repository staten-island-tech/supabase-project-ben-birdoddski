import { defineStore } from 'pinia'
interface LoginUser {
  username: string
  password: string
  loggedin: boolean
}
let loggedin=false
export const useLoginStore = defineStore('user', {
  state: (): LoginUser => {
    let currentuser="hello"
    let currentpass="byebye"
    return {
      username: currentuser,
      password: currentpass,
      loggedin: loggedin,
    }
  },
})