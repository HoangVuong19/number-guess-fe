<template>
    <div class="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md text-center">
        <h2 class="text-2xl font-bold mb-4">Kết quả thanh toán</h2>

        <div v-if="vnp_ResponseCode === '00'" class="text-green-600 text-lg font-semibold">
            ✅ Thanh toán thành công!
        </div>
        <div v-else class="text-red-600 text-lg font-semibold">
            ❌ Thanh toán thất bại!
        </div>

        <p class="mt-4 text-sm text-gray-600">Mã đơn hàng: {{ vnp_TxnRef }}</p>

        <router-link to="/" class="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Quay lại trang chính
        </router-link>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { paymentService } from '@/services/payment/paymentService'


const route = useRoute()

const vnp_ResponseCode = route.query.vnp_ResponseCode || ''
const vnp_TxnRef = route.query.vnp_TxnRef || ''
const vnp_Amount = route.query.vnp_Amount || ''
const amount = vnp_Amount / 100;

onMounted(async () => {
    if (vnp_ResponseCode === '00') {
        try {
            await paymentService.completePayment({ amount })
        } catch (error) {
            console.error('Lỗi khi cộng lượt chơi:', error)
        }
    }
})
</script>
