<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
    <NavBar />
    <div v-if="!userStore.user.loggedIn" class="flex-1 flex flex-col justify-center items-center">
      <div class="bg-white/80 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center mt-16">
        <h1 class="text-5xl font-extrabold text-purple-700 mb-4 drop-shadow">
          Welcome to Time Capsule
        </h1>
        <p class="text-lg text-gray-700 mb-8">
          Sign up or log in to view and create time capsules!
        </p>
        <div class="flex justify-center gap-4">
          <RouterLink
            to="/signup"
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-full font-semibold shadow transition-all duration-200"
            >Sign Up</RouterLink
          >
          <RouterLink
            to="/login"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all duration-200"
            >Login</RouterLink
          >
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-2xl text-purple-500 animate-pulse">Loading capsule...</div>
    </div>
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-2xl text-red-500 font-semibold">{{ error }}</div>
    </div>
    <div v-else-if="post && isAvailable" class="flex-1 flex flex-col items-center justify-center">
      <div class="bg-white/90 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto mt-12 p-8 relative">
        <figure class="flex flex-col items-center">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="post.title ? `Image for ${post.title}` : 'Capsule Image'"
            class="rounded-2xl max-h-72 object-cover shadow-lg border-4 border-purple-200 mb-4"
          />
          <p v-else class="italic text-gray-400 text-sm mt-4">
            No image available or no image attached.
          </p>
        </figure>
        <div class="text-center mt-2">
          <h2 class="text-3xl font-bold text-purple-700 mb-2">{{ post.title }}</h2>
          <p class="text-gray-700 text-lg mb-4 whitespace-pre-line">{{ post.description }}</p>
          <p class="text-sm text-gray-500 mb-2">
            Unlocked on: <span class="font-semibold">{{ releasedDate }}</span>
          </p>
          <RouterLink
            v-if="creatorUsername"
            :to="`/profile/${creatorUsername}/${post.UsersID}`"
            class="inline-block mt-2 text-purple-600 underline text-base hover:text-purple-800 transition"
          >
            View {{ creatorUsername }}'s Profile
          </RouterLink>
          <button
            v-if="ownsProfile"
            @click="startEdit"
            class="ml-4 mt-2 btn btn-outline btn-sm text-purple-700 border-purple-400 hover:bg-purple-100 hover:border-purple-600 transition"
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-2xl text-red-500 font-semibold">
        This capsule is not available yet or has been closed.
      </div>
    </div>
    <div
      v-if="editing"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative">
        <button
          @click="cancelEdit"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold mb-6 text-purple-700">Edit Capsule</h2>
        <label class="block font-semibold mb-1">Title</label>
        <input v-model="editTitle" class="input input-bordered w-full mb-4 text-lg" />
        <label class="block font-semibold mb-1">Description</label>
        <textarea
          v-model="editDescription"
          class="input input-bordered w-full mb-4 text-base"
          rows="4"
        ></textarea>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="saveEdit"
            class="btn btn-primary bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition"
          >
            Save
          </button>
          <button @click="cancelEdit" class="btn btn-ghost px-6 py-2 rounded-full font-semibold">
            Cancel
          </button>
        </div>
        <div v-if="editError" class="text-red-500 mt-2 text-center">{{ editError }}</div>
      </div>
    </div>
    <div class="max-w-2xl mx-auto mt-10 mb-10 bg-white/90 rounded-2xl shadow-xl p-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-700 flex items-center">Comments</h2>
      <div v-if="commentsLoading" class="text-gray-500 mb-2">Loading comments...</div>
      <div v-else-if="commentsError" class="text-red-500 mb-2">{{ commentsError }}</div>
      <div v-else>
        <div v-if="comments.length === 0" class="text-gray-400 italic mb-4">
          No comments yet. Be the first to comment!
        </div>
        <ul>
          <li
            v-for="(comment, idx) in comments"
            :key="idx"
            class="mb-4 pb-3 border-b border-gray-200"
          >
            <div class="flex items-center mb-1">
              <span class="font-semibold text-purple-700 mr-2">{{ comment.username }}</span>
            </div>
            <div class="text-gray-800 bg-purple-50 rounded px-3 py-2">{{ comment.text }}</div>
          </li>
        </ul>
      </div>
      <div v-if="userStore.user.loggedIn" class="mt-6">
        <textarea
          v-model="newComment"
          class="input input-bordered w-full mb-2 text-base"
          rows="2"
          placeholder="Add a comment..."
        ></textarea>
        <div class="flex justify-end">
          <button
            @click="addComment"
            :disabled="addingComment || !newComment.trim()"
            class="btn btn-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-purple-600 hover:to-pink-600 transition"
          >
            {{ addingComment ? 'Posting...' : 'Post Comment' }}
          </button>
        </div>
        <div v-if="addCommentError" class="text-red-500 mt-1">{{ addCommentError }}</div>
      </div>
      <div v-else class="text-gray-500 mt-2 text-sm">Log in to add a comment.</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import NavBar from '../components/NavBar.vue'
import type { capsulePost } from '../Types/Interfaces'

const userStore = useUserStore()
const route = useRoute()
const post = ref<capsulePost>()
const tempPostName = route.params.id
const imageUrl = ref<string | undefined>()
const releasedDate = ref('')
const creatorUsername = ref('')
const loading = ref(true)
const error = ref('')

const ownsProfile = computed(() => {
  return userStore.user.loggedIn && userStore.user.userID === post.value?.UsersID
})

const isAvailable = computed(() => {
  if (!post.value) return false
  if (post.value.isAvailable !== undefined) return post.value.isAvailable
  return true
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const { data: maindata, error: mainerror } = await supabase
      .from('CapsuleData')
      .select('*')
      .eq('CapsuleID', tempPostName)
      .single()

    if (mainerror || !maindata) {
      error.value = 'Capsule not found.'
      loading.value = false
      return
    }
    const unlockDate = new Date(maindata.Unlock)
    const now = new Date()
    const available = !maindata.Private || now >= unlockDate
    const month = unlockDate.getMonth() + 1
    const day = unlockDate.getDate()
    const year = unlockDate.getFullYear()
    releasedDate.value = `${month}/${day}/${year}`

    post.value = {
      id: maindata.CapsuleID,
      UsersID: maindata.UsersID,
      title: maindata.Header,
      description: maindata.Text,
      isAvailable: available,
      timeLeftInMs: 1,
      imagePath: maindata.ImageUrl,
      countdownDisplay: 'jello',
    }
    const { data: postCreator, error: creatorError } = await supabase
      .from('Users')
      .select('Username')
      .eq('id', post.value.UsersID)
      .single()

    if (!creatorError && postCreator) {
      creatorUsername.value = postCreator.Username
    }
    if (post.value.imagePath) {
      const { data, error: imgError } = await supabase.storage
        .from('images')
        .createSignedUrl(post.value.imagePath, 60 * 60 * 24)
      if (!imgError && data?.signedUrl) {
        imageUrl.value = data.signedUrl
      }
    }
  } catch (e) {
    error.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
})

const editing = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editError = ref('')

function startEdit() {
  if (post.value) {
    editTitle.value = post.value.title
    editDescription.value = post.value.description
    editing.value = true
    editError.value = ''
  }
}
function cancelEdit() {
  editing.value = false
  editError.value = ''
}
async function saveEdit() {
  if (!post.value) return
  if (!editTitle.value.trim() || !editDescription.value.trim()) {
    editError.value = 'Title and description cannot be empty.'
    return
  }
  const { error: updateError } = await supabase
    .from('CapsuleData')
    .update({ Header: editTitle.value, Text: editDescription.value })
    .eq('CapsuleID', post.value.id)
  if (updateError) {
    editError.value = updateError.message
  } else {
    post.value.title = editTitle.value
    post.value.description = editDescription.value
    editing.value = false
    editError.value = ''
  }
}
const comments = ref<Array<{ username: string; text: string; created_at: string }>>([])
const commentsLoading = ref(false)
const commentsError = ref('')
const newComment = ref('')
const addingComment = ref(false)
const addCommentError = ref('')

async function fetchComments() {
  if (!post.value) return
  commentsLoading.value = true
  commentsError.value = ''
  try {
    const { data, error } = await supabase
      .from('CapsuleData')
      .select('Comments')
      .eq('CapsuleID', tempPostName)
      .single()
    if (error) {
      commentsError.value = 'Failed to load comments.'
    } else {
      comments.value = data && data.Comments ? JSON.parse(data.Comments) : []
    }
  } catch (e) {
    commentsError.value = 'An unexpected error occurred.'
  } finally {
    commentsLoading.value = false
  }
}

async function addComment() {
  if (!userStore.user.loggedIn || !post.value) return
  if (!newComment.value.trim()) return
  addingComment.value = true
  addCommentError.value = ''
  try {
    const { data, error: fetchError } = await supabase
      .from('CapsuleData')
      .select('Comments')
      .eq('CapsuleID', tempPostName)
      .single()
    let currentComments: Array<{ username: string; text: string; created_at: string }> = []
    if (!fetchError && data && data.Comments) {
      try {
        currentComments = JSON.parse(data.Comments)
      } catch {
        currentComments = []
      }
    }
    const comment = {
      username: userStore.user.username,
      text: newComment.value.trim(),
      created_at: new Date().toISOString(),
    }
    currentComments.unshift(comment)
    const { error: updateError } = await supabase
      .from('CapsuleData')
      .update({ Comments: JSON.stringify(currentComments) })
      .eq('CapsuleID', tempPostName)
    if (updateError) {
      addCommentError.value = 'Failed to post comment.'
    } else {
      newComment.value = ''
      await fetchComments()
    }
  } catch (e) {
    addCommentError.value = 'An unexpected error occurred.'
  } finally {
    addingComment.value = false
  }
}

watch(
  () => post.value?.id,
  () => {
    if (post.value) {
      fetchComments()
    }
  },
)
</script>
