import { defineStore } from 'pinia'
import { ref } from 'vue'
export const usePostStore = defineStore('post', () => {
    const header = ref<string>('')
    const body = ref<string>('')
    const imageLink = ref<string>('')
    const releaseDate = ref<Date>()
    const comments = ref<Array<String>>([]);
    const friendVisibility = ref<boolean>(false)
    return {
      header,
      body,
      imageLink,
      releaseDate,
      comments,
      friendVisibility,
    }
  })
  