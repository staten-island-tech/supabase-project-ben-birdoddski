<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />
    <div class="max-w-5xl mx-auto px-4 py-10">
      <div class="bg-white shadow rounded-xl p-8 mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
          <div
            class="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center rounded-full border-2 border-purple-500 bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 sm:h-24 sm:w-24 text-purple-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
            </svg>
          </div>

          <div class="mt-6 sm:mt-0 flex-1">
            <h2 class="text-3xl font-bold text-purple-700">
              {{ profileData?.Username || 'Loading...' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ ownsProfile ? 'This is you!' : 'Viewing public profile' }}
            </p>

            <div class="mt-3 flex space-x-8 text-sm text-gray-700 font-medium">
              <div>{{ userPosts.length }} capsules</div>
              <div>{{ profileData?.Followers?.length || 0 }} followers</div>
              <div>{{ profileData?.Following?.length || 0 }} following</div>
            </div>

            <div class="mt-6">
              <div v-if="ownsProfile">
                <label class="block text-sm font-bold mb-1">Your Bio:</label>

                <div v-if="!editingBio" class="whitespace-pre-wrap text-gray-700 min-h-[4rem]">
                  {{ profileData?.Bio || 'You have not set a bio yet.' }}
                </div>

                <textarea
                  v-if="editingBio"
                  v-model="editedBio"
                  rows="4"
                  placeholder="Write something about yourself..."
                  class="w-full p-3 border rounded-lg resize-none focus:outline-purple-500"
                ></textarea>

                <button
                  v-if="!editingBio"
                  @click="editingBio = true"
                  class="mt-3 btn btn-outline btn-sm text-purple-600"
                >
                  Edit Bio
                </button>
                <div v-else class="mt-3 space-x-3">
                  <button @click="saveBio" class="btn btn-sm btn-primary" :disabled="savingBio">
                    {{ savingBio ? 'Saving...' : 'Save Bio' }}
                  </button>
                  <button
                    @click="cancelEdit"
                    class="btn btn-sm btn-ghost text-gray-600"
                    :disabled="savingBio"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div v-else class="italic text-gray-600">
                {{ profileData?.Bio || 'This user has not created a bio.' }}
              </div>
            </div>
            <div v-if="!ownsProfile" class="mt-5">
              <button
                v-if="
                  Array.isArray(profileData?.Followers) &&
                  profileData.Followers.includes(userStore.user.userID)
                "
                @click="unfollowUser"
                class="btn btn-outline btn-danger mr-2"
              >
                Unfollow
              </button>
              <button
                v-else
                @click="followUser"
                class="btn btn-primary"
                :disabled="followStatus === 'Followed!'"
              >
                {{ followStatus === 'Followed!' ? 'Following' : 'Follow' }}
              </button>
              <p class="text-sm mt-2 text-green-600">{{ followStatus }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="post in userPosts"
          :key="post.id"
          class="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center"
        >
          <img
            :src="post.isAvailable && post.timeLeftInMs <= 0 ? unlockedImage : lockedImage"
            alt="Capsule"
            class="w-24 h-24 mb-4 rounded-full border"
          />
          <h3 class="text-lg font-semibold text-gray-800">{{ post.title }}</h3>
          <p class="text-sm text-gray-600 mt-2 mb-4">{{ post.description }}</p>
          <p
            class="text-sm font-medium"
            :class="post.isAvailable && post.timeLeftInMs <= 0 ? 'text-green-600' : 'text-red-500'"
          >
            {{
              post.isAvailable && post.timeLeftInMs <= 0
                ? 'Now Open!'
                : 'Opens in: ' + makeCountdown(post.timeLeftInMs)
            }}
          </p>
          <button
            v-if="post.timeLeftInMs <= 0 && (ownsProfile || post.isAvailable)"
            @click="$router.push(`/viewpost/${post.title}/${post.id}`)"
            class="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full font-medium transition"
          >
            View Capsule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useUserStore } from '../stores/uservalue'
import NavBar from '../components/NavBar.vue'
import type { UserProfile, capsulePost } from '../Types/Interfaces'

const route = useRoute()
const userStore = useUserStore()

const profileId = route.params.id as string
const profileData = ref<UserProfile | null>(null)
const allPosts = ref<capsulePost[]>([])
const loading = ref(true)
const followStatus = ref('')
const editedBio = ref('')
const editingBio = ref(false)
const savingBio = ref(false)

const ownsProfile = computed(() => profileId === userStore.user.userID)
const userPosts = computed(() => allPosts.value.filter((post) => post.UsersID === profileId))

const unlockedImage = 'https://img.icons8.com/ios-filled/100/unlock.png'
const lockedImage = 'https://img.icons8.com/ios-filled/100/lock.png'

onMounted(async () => {
  loading.value = true

  const { data: userData, error: userError } = await supabase
    .from('Users')
    .select('*')
    .eq('id', profileId)
    .single()
  if (!userError) {
    profileData.value = userData
    editedBio.value = userData.Bio || ''
  }
  const { data: postsData, error: postsError } = await supabase.from('CapsuleData').select('*')
  if (!postsError && postsData) {
    allPosts.value = postsData.map((item) => {
      const unlockDate = new Date(item.Unlock)
      unlockDate.setHours(0, 0, 0, 0)
      const now = new Date()
      const timeLeft = unlockDate.getTime() - now.getTime()
      const isAvailable = timeLeft <= 0 || !item.Private
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
      let countdownDisplay = ''
      if (isAvailable && timeLeft <= 0) {
        countdownDisplay = 'Now Open!'
      } else {
        countdownDisplay = `${days}D, ${hours} Hrs`
      }
      let imagePath = ''
      if (isAvailable) {
        imagePath = 'https://img.icons8.com/ios-filled/100/unlock.png'
      } else {
        imagePath = 'https://img.icons8.com/ios-filled/100/lock.png'
      }
      return {
        id: item.CapsuleID as string,
        UsersID: item.UsersID as string,
        title: item.Header as string,
        description: `Unlocks on ${unlockDate.getMonth() + 1}/${unlockDate.getDate()}/${unlockDate.getFullYear()}`,
        isAvailable,
        timeLeftInMs: timeLeft,
        imagePath,
        countdownDisplay,
        display: true,
      }
    })
  }
  loading.value = false
})

async function saveBio() {
  if (!profileData.value) return
  savingBio.value = true
  const { error } = await supabase
    .from('Users')
    .update({ Bio: editedBio.value })
    .eq('id', profileId)
  savingBio.value = false
  if (!error) {
    profileData.value.Bio = editedBio.value
    editingBio.value = false
  }
}

function cancelEdit() {
  editedBio.value = profileData.value?.Bio || ''
  editingBio.value = false
}

async function followUser() {
  if (!profileData.value) return
  const { data: currentUser, error: userError } = await supabase
    .from('Users')
    .select('Following')
    .eq('id', userStore.user.userID)
    .single()
  if (userError || !currentUser) return
  if (Array.isArray(currentUser.Following) && currentUser.Following.includes(profileId)) return
  const updatedFollowing = Array.from(new Set([...(currentUser.Following || []), profileId]))

  const { data: profileUser, error: profileError } = await supabase
    .from('Users')
    .select('Followers')
    .eq('id', profileId)
    .single()
  if (profileError || !profileUser) return
  const updatedFollowers = Array.from(
    new Set([...(profileUser.Followers || []), userStore.user.userID]),
  )

  await supabase
    .from('Users')
    .update({ Following: updatedFollowing })
    .eq('id', userStore.user.userID)
  await supabase.from('Users').update({ Followers: updatedFollowers }).eq('id', profileId)
  followStatus.value = 'Followed!'
  if (profileData.value) profileData.value.Followers = updatedFollowers
}

async function unfollowUser() {
  if (!profileData.value) return
  const { data: currentUser, error: userError } = await supabase
    .from('Users')
    .select('Following')
    .eq('id', userStore.user.userID)
    .single()
  if (userError || !currentUser) return
  if (!Array.isArray(currentUser.Following) || !currentUser.Following.includes(profileId)) return
  const updatedFollowing = currentUser.Following.filter((id: string) => id !== profileId)

  const { data: profileUser, error: profileError } = await supabase
    .from('Users')
    .select('Followers')
    .eq('id', profileId)
    .single()
  if (profileError || !profileUser) return
  const updatedFollowers = (profileUser.Followers || []).filter(
    (id: string) => id !== userStore.user.userID,
  )

  await supabase
    .from('Users')
    .update({ Following: updatedFollowing })
    .eq('id', userStore.user.userID)
  await supabase.from('Users').update({ Followers: updatedFollowers }).eq('id', profileId)
  followStatus.value = ''
  if (profileData.value) profileData.value.Followers = updatedFollowers
}

function makeCountdown(timeLeftInMs: number | undefined) {
  if (!timeLeftInMs || timeLeftInMs <= 0) return 'Now Open!'
  const days = Math.floor(timeLeftInMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeftInMs / (1000 * 60 * 60)) % 24)
  return `${days}D, ${hours} Hrs`
}

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      window.location.reload()
    }
  },
)
</script>
