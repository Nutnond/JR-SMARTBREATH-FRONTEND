<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl"></div>
    </div>

    <!-- Main Login Container -->
    <div class="relative w-full max-w-md">
      <!-- Login Card -->
      <div class="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-10">
        <!-- Logo and Header -->
        <div class="text-center mb-8">
          <!-- Logo Icon -->
          <div class="relative mx-auto w-20 h-20 mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center transform rotate-3">
              <Icon name="lucide:activity" class="w-10 h-10 text-white" />
            </div>
            <div class="absolute inset-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-xl flex items-center justify-center">
              <Icon name="lucide:heart" class="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          
          <!-- App Name -->
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2">
            JR SMARTBREATH
          </h1>
          <p class="text-blue-600/70 text-sm font-medium">
            เข้าสู่ระบบเพื่อดูแลสุขภาพของคุณ
          </p>
        </div>

        <!-- Login Form -->
        <div class="space-y-6">
          <!-- Username Field -->
          <div class="relative">
            <label for="username" class="block text-sm font-semibold text-blue-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="lucide:user" class="h-5 w-5 text-blue-400" />
              </div>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="relative">
            <label for="password" class="block text-sm font-semibold text-blue-700 mb-2">
              รหัสผ่าน
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="lucide:lock" class="h-5 w-5 text-blue-400" />
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-12 pr-12 py-3.5 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="กรอกรหัสผ่าน"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <Icon 
                  :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="h-5 w-5 text-blue-400 hover:text-blue-600 transition-colors" 
                />
              </button>
            </div>
          </div>

 

          <!-- Login Button -->
          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <span class="flex items-center justify-center">
              <Icon 
                :name="loading ? 'lucide:loader-2' : 'lucide:activity'" 
                :class="['w-5 h-5 mr-2', loading && 'animate-spin']" 
              />
              {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
            </span>
          </button>
        </div>

        <!-- Divider -->
        <div class="mt-8 mb-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-blue-200/50"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white/80 text-blue-600/70 font-medium">หรือ</span>
            </div>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center">
          <p class="text-blue-700">
            ยังไม่มีบัญชี?
            <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-800 transition-colors ml-1">
              สมัครสมาชิก
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-xs text-blue-600/60">
          © 2025 JR SMARTBREATH. Janokrong School. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="showToast"
        class="fixed top-4 right-4 z-50 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm"
      >
        <div class="flex items-center">
          <Icon name="lucide:info" class="w-5 h-5 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useAuth } from '~/composable/auth/useAuth';

// Page Meta
useHead({
  title: 'JR SMARTBREATH',
  meta: [
    {
      name: 'description',
      content: 'เข้าสู่ระบบ JR SMARTBREATH เพื่อดูแลสุขภาพการหายใจของคุณ'
    }
  ]
})

// 1. เรียกใช้ useAuth composable
const { login, loading, error } = useAuth();

// Reactive Data
const formData = ref({
  username: '',
  password: ''
})
const showPassword = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// 2. Watch error state จาก composable เพื่อแสดง Toast
watch(error, (newError) => {
  if (newError) {
    showToastMessage(newError);
  }
});

// 3. ปรับปรุง handleLogin ให้เรียกใช้ฟังก์ชันจาก composable
const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    showToastMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    return;
  }

  // เรียกใช้ฟังก์ชัน login จาก useAuth
  const success = await login(formData.value);

  // ถ้า login สำเร็จ (composable return true)
  if (success) {
    showToastMessage('เข้าสู่ระบบสำเร็จ!');
    
    // หน่วงเวลาเล็กน้อยเพื่อให้ผู้ใช้เห็น Toast ก่อน Redirect
    setTimeout(() => {
      // สามารถเปลี่ยน '/dashboard' เป็น '/menu' หรือหน้าที่ต้องการได้
      navigateTo('/menu'); 
    }, 1000);
  }
  // กรณีไม่สำเร็จ, watch(error) จะทำงานและแสดง Toast ให้เอง
}

// ฟังก์ชันแสดง Toast (เหมือนเดิม)
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Keyboard Event Handler (เหมือนเดิม)
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !loading.value) {
    handleLogin()
  }
}

definePageMeta({
  layout: 'empty-layout',
})

// Lifecycle (เหมือนเดิม)
onMounted(() => {
  document.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeyPress)
})
</script>

<style scoped>
/* Custom styles for better mobile experience */
@media (max-width: 640px) {
  .backdrop-blur-lg {
    backdrop-filter: blur(10px);
  }
}

/* Animation for logo icons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Focus states for better accessibility */
input:focus,
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Loading state for button */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>