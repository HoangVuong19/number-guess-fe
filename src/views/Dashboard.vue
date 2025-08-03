<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <GameHeader :username="userStore.username" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin người chơi</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ userStore.username || 'Đang tải...' }}</div>
              <div class="text-sm text-gray-600">Tên người chơi</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ userStore.score || '0' }}</div>
              <div class="text-sm text-gray-600">Điểm số</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ userStore.turns || '0' }}</div>
              <div class="text-sm text-gray-600">Lượt chơi còn lại</div>
            </div>
          </div>
        </div>

        <!-- Game Area -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">Đoán số từ 1 đến 5</h2>

          <div v-if="gameResult" class="mb-6 p-4 rounded-lg text-center">
            <div v-if="gameResult.isCorrect"
              class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <div class="text-lg font-semibold">🎉 Chúc mừng! Bạn đã đoán đúng!</div>
              <div class="text-sm">Số đúng là: {{ gameResult.correctNumber }}</div>
            </div>
            <div v-else class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div class="text-lg font-semibold">😔 Rất tiếc! Bạn đã đoán sai!</div>
              <div class="text-sm">Số đúng là: {{ gameResult.correctNumber }}, Bạn đoán: {{ gameResult.userGuess }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-5 gap-4 mb-6">
            <button v-for="number in 5" :key="number" @click="makeGuess(number)"
              :disabled="isLoading || (userStore.turns <= 0)"
              class="w-16 h-16 text-2xl font-bold rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[
                isLoading
                  ? 'bg-gray-200 border-gray-300 text-gray-500'
                  : 'bg-blue-500 hover:bg-blue-600 border-blue-600 text-white hover:scale-105'
              ]">
              {{ number }}
            </button>
          </div>

          <div v-if="userStore.turns <= 0"
            class="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <div class="text-lg font-semibold">⚠️ Hết lượt chơi!</div>
            <div class="text-sm">Bạn cần đăng nhập lại để có thêm lượt chơi.</div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div class="text-gray-600 mt-2">Đang xử lý...</div>
          </div>

          <div v-if="gameResult && !isLoading" class="text-center">
            <button @click="playAgain" :disabled="userStore.turns <= 0"
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/user/userService'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import GameHeader from '@/components/GameHeader.vue'
import { toast } from "vue3-toastify";

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// Reactive data
const isLoading = ref(false)
const gameResult = ref(null)

const fetchUserInfo = async () => {
  try {
    const response = await userService.me()
    if (response.data) {
      userStore.setInfo(response.data)
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error)
    if (error.response?.status === 401) {
      authStore.clearAccessToken()
      router.push('/login')
    }
  }
}

const makeGuess = async (number) => {
  if (isLoading.value || userStore.turns <= 0) return

  isLoading.value = true
  gameResult.value = null
  const updatedAt = userStore.updatedAt;

  try {
    const response = await userService.guess(number, updatedAt)

    if (response.data) {
      userStore.setScore(response.data)
    }

    gameResult.value = {
      isCorrect: response.data.isCorrect,
      correctNumber: response.data.correctNumber,
      userGuess: number
    }

  } catch (error) {
    console.error('Lỗi khi đoán số:', error)
    if (error.response?.status === 401) {
      authStore.clearAccessToken()
      router.push('/login')
    } else if (error.response?.status === 400) {
      toast.error("User data is out of sync. Please refresh.");
    }
    else {
      gameResult.value = {
        isCorrect: false,
        correctNumber: '?',
        userGuess: number,
        error: true
      }
    }
  } finally {
    isLoading.value = false
  }
}

const playAgain = () => {
  gameResult.value = null
}

const handleLogout = async () => {
  authStore.clearAccessToken()
  userStore.clearInfo()
  router.push('/login')
}

onMounted(() => {
  fetchUserInfo()
})
</script>