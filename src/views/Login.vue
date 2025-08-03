<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Vui lòng đăng nhập để tiếp tục
        </p>
      </div>

      <!-- Login Form -->
      <Form @submit="handleLogin" v-slot="{ errors, isSubmitting }" class="mt-8 space-y-6">
        <div class="space-y-4">
          <!-- Username/Email Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Field id="username" name="username" type="email" v-model="form.username" :class="[
              'mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm',
              errors.username
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            ]" placeholder="Nhập email của bạn" rules="required|email" />
            <ErrorMessage name="username" class="mt-1 text-sm text-red-600" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <Field id="password" name="password" type="password" v-model="form.password" :class="[
              'mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm',
              errors.password
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            ]" placeholder="Nhập mật khẩu của bạn" rules="required|min:6" />
            <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button type="submit" :disabled="isSubmitting || authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting || authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ (isSubmitting || authStore.loading) ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth/authService'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toast } from "vue3-toastify";

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async (values) => {
  try {
    const result = await authService.login({
      username: values.username,
      password: values.password
    });

    if (result.status === 200) {
      authStore.setAccessToken(result.data?.token);
      router.push('/');
      toast.success("Đăng nhập thành công!");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Email hoặc mật khẩu không đúng");
    } else {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  }
}
</script>