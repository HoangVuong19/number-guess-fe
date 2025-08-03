<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">Game Đoán Số</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">Xin chào, {{ username }}</span>

          <!-- Payment Button -->
          <button @click="showPaymentModal = true"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Nạp tiền
          </button>

          <button @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Nạp tiền qua VNPay</h3>
          <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handlePayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Gói nạp tiền</label>
            <select v-model="paymentForm.amount"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="10000">10,000 VNĐ</option>
              <option value="20000">20,000 VNĐ</option>
              <option value="50000">50,000 VNĐ</option>
              <option value="100000">100,000 VNĐ</option>
            </select>
          </div>

          <!-- Package Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-blue-800">Lượt chơi nhận được:</span>
              <span class="text-lg font-bold text-blue-600">{{ getTurnsForAmount(paymentForm.amount) }} lượt</span>
            </div>
            <div class="mt-1 text-xs text-blue-600">
              Giá: {{ formatCurrency(paymentForm.amount) }} VNĐ
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ngân hàng (Tùy chọn)</label>
            <select v-model="paymentForm.bankCode"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả ngân hàng</option>
              <option value="NCB">NCB</option>
              <option value="SCB">SCB</option>
              <option value="SACOMBANK">Sacombank</option>
              <option value="EXIMBANK">Eximbank</option>
              <option value="MSBANK">MSBANK</option>
              <option value="NAMABANK">NAMABANK</option>
              <option value="VNMART">VNMART</option>
              <option value="VIETINBANK">VIETINBANK</option>
              <option value="VIETCOMBANK">VIETCOMBANK</option>
              <option value="HDBANK">HDBANK</option>
              <option value="DONGABANK">DONGABANK</option>
              <option value="TPBANK">TPBANK</option>
              <option value="OJB">OJB</option>
              <option value="BIDV">BIDV</option>
              <option value="TECHCOMBANK">TECHCOMBANK</option>
              <option value="VPBANK">VPBANK</option>
              <option value="AGRIBANK">AGRIBANK</option>
              <option value="MBBANK">MBBANK</option>
              <option value="ACB">ACB</option>
              <option value="OCB">OCB</option>
              <option value="SHB">SHB</option>
              <option value="IVB">IVB</option>
            </select>
          </div>

          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showPaymentModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit" :disabled="isProcessing"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isProcessing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Đang xử lý...
              </span>
              <span v-else>Thanh toán</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { paymentService } from '@/services/payment/paymentService'

defineProps({
  username: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['logout'])

// Payment modal state
const showPaymentModal = ref(false)
const isProcessing = ref(false)

// Payment form data
const paymentForm = ref({
  amount: '10000',
  bankCode: '',
  orderInfo: 'Nạp tiền game đoán số',
  orderId: ''
})

const handleLogout = () => {
  emit('logout')
}

// Helper functions for payment packages
const getTurnsForAmount = (amount) => {
  const turnsMap = {
    '10000': 5,
    '20000': 12,
    '50000': 35,
    '100000': 70
  }
  return turnsMap[amount] || 0
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `ORDER_${timestamp}_${random}`
}

const handlePayment = async () => {
  if (isProcessing.value) return

  isProcessing.value = true

  try {
    // Generate unique order ID
    paymentForm.value.orderId = generateOrderId()

    const paymentData = {
      amount: parseInt(paymentForm.value.amount),
      orderInfo: paymentForm.value.orderInfo,
      orderId: paymentForm.value.orderId,
      bankCode: paymentForm.value.bankCode || undefined
    }

    console.log('Sending payment request:', paymentData)

    const response = await paymentService.createPayment(paymentData)

    if (response.data && response.data.success) {
      console.log('Payment URL created:', response.data.paymentUrl)

      // Redirect to VNPay payment page
      window.open(response.data.paymentUrl, '_blank')

      // Close modal
      showPaymentModal.value = false

      // Reset form
      paymentForm.value = {
        amount: '10000',
        bankCode: '',
        orderInfo: 'Nạp tiền game đoán số',
        orderId: ''
      }
    } else {
      alert('Có lỗi xảy ra khi tạo URL thanh toán')
    }
  } catch (error) {
    console.error('Payment error:', error)
    alert('Có lỗi xảy ra khi xử lý thanh toán: ' + (error.response?.data?.message || error.message))
  } finally {
    isProcessing.value = false
  }
}
</script>