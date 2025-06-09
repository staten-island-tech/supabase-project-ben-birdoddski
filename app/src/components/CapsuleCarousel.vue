<template>
  <div class="relative">
    <div
      class="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-gray-100 to-transparent z-10"
    ></div>
    <div
      class="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-gray-100 to-transparent z-10"
    ></div>

    <button
      @click="scrollLeft"
      class="absolute top-1/2 left-2 z-20 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-purple-100 transition"
    >
      <ChevronLeft class="w-6 h-6 text-purple-600" />
    </button>
    <button
      @click="scrollRight"
      class="absolute top-1/2 right-2 z-20 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-purple-100 transition"
    >
      <ChevronRight class="w-6 h-6 text-purple-600" />
    </button>

    <div
      ref="carousel"
      class="flex gap-6 overflow-x-auto scroll-smooth px-2 py-4 select-none"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
    >
      <div
        v-for="post in posts"
        :key="post.id"
        class="min-w-[280px] max-w-[300px] bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition flex-shrink-0 p-4"
      >
        <div class="flex flex-col items-center text-center mb-4">
          <img
            :src="post.isAvailable ? unlockedImage : lockedImage"
            alt="Capsule"
            class="w-20 h-20 mb-3 rounded-full border"
          />
          <h3 class="text-lg font-semibold text-gray-800">{{ post.title }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ post.description }}</p>
          <p
            class="text-sm mt-2 font-medium"
            :class="post.isAvailable ? 'text-green-600' : 'text-red-500'"
          >
            {{ post.isAvailable ? 'Now Open!' : 'Opens in: ' + post.countdown }}
          </p>
        </div>
        <div class="text-center">
          <button
            class="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition"
            v-if="isAvailable && timeLeft <= 0"
          >
            View Capsule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const unlockedImage = 'https://img.icons8.com/ios-filled/100/unlock.png'
const lockedImage = 'https://img.icons8.com/ios-filled/100/lock.png'

const props = defineProps({ posts: Array })

const carousel = ref(null)

let isDragging = false
let startX = 0
let lastX = 0
let animationFrame
let isTouchDevice = false

onMounted(() => {
  isTouchDevice = 'ontouchstart' in window && window.innerWidth <= 768

  if (isTouchDevice) {
    const el = carousel.value
    el.addEventListener('touchstart', startDrag, { passive: false })
    el.addEventListener('touchmove', onDrag, { passive: false })
    el.addEventListener('touchend', endDrag)
  } else {
    // Desktop: only allow click-based scroll (no drag)
    carousel.value.addEventListener('mousedown', (e) => e.preventDefault())
  }
})

onBeforeUnmount(() => {
  if (isTouchDevice) {
    const el = carousel.value
    el.removeEventListener('touchstart', startDrag)
    el.removeEventListener('touchmove', onDrag)
    el.removeEventListener('touchend', endDrag)
  }
})

const startDrag = (e) => {
  isDragging = true
  startX = e.touches ? e.touches[0].pageX : e.pageX
  lastX = startX
}

const onDrag = (e) => {
  if (!isDragging) return
  const x = e.touches ? e.touches[0].pageX : e.pageX
  const delta = lastX - x
  lastX = x

  animationFrame = requestAnimationFrame(() => {
    carousel.value.scrollLeft += delta
  })
}

const endDrag = () => {
  isDragging = false
  cancelAnimationFrame(animationFrame)
}

const scrollLeft = () => {
  carousel.value.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = () => {
  carousel.value.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>
