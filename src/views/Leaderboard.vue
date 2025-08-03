<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <button @click="goBack" class="mr-4 text-gray-600 hover:text-gray-900">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <h1 class="text-3xl font-bold text-gray-900">🏆 Bảng Xếp Hạng</h1>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Leaderboard Table -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Bảng Xếp Hạng</h3>
                </div>

                <div v-if="isLoading" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-2 text-gray-600">Đang tải...</span>
                </div>

                <div v-else-if="leaderboardData.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-8-7.109C4 11.764 6.69 10.4 10 10.4s6 1.364 6 2.891z">
                        </path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
                    <p class="mt-1 text-sm text-gray-500">Chưa có người chơi nào trong bảng xếp hạng.</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hạng</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người chơi</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điểm</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(player, index) in leaderboardData" :key="player.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span v-if="index < 3" class="text-2xl mr-2">
                                            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
                                        </span>
                                        <span class="text-sm font-medium text-gray-900">#{{ index + 1 }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ player.username }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ player.score }}
                                    </div>
                                    <div class="text-sm text-gray-500">điểm</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/user/userService'

const router = useRouter()

// Reactive data
const isLoading = ref(false)
const leaderboardData = ref([])

const goBack = () => {
    router.go(-1)
}

const fetchLeaderboard = async () => {
    isLoading.value = true
    try {
        const response = await userService.leaderboard()
        leaderboardData.value = response.data
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
    } finally {
        isLoading.value = false
    }
}

// Lifecycle
onMounted(() => {
    fetchLeaderboard()
})
</script>
