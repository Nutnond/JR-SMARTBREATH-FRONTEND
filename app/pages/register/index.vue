<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-10">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2">
            สมัครสมาชิก
          </h1>
          <p class="text-blue-600/70 text-sm font-medium">
            สร้างบัญชีเพื่อเริ่มต้นใช้งาน JR SMARTBREATH
          </p>
        </div>

        <div class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-semibold text-blue-700 mb-2">ชื่อผู้ใช้</label>
            <input v-model="formData.username" id="username" type="text" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
              placeholder="กรอกชื่อผู้ใช้" />
          </div>

          <div>
            <label for="firstName" class="block text-sm font-semibold text-blue-700 mb-2">ชื่อจริง</label>
            <input v-model="formData.firstName" id="firstName" type="text" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50"
              placeholder="กรอกชื่อจริง" />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-semibold text-blue-700 mb-2">นามสกุล</label>
            <input v-model="formData.lastName" id="lastName" type="text" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50"
              placeholder="กรอกนามสกุล" />
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-blue-700 mb-2">อีเมล</label>
            <input v-model="formData.email" id="email" type="email" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
              placeholder="กรอกอีเมล" />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-blue-700 mb-2">รหัสผ่าน</label>
            <div class="relative">
              <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" id="password" required
                class="w-full pr-12 px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
                placeholder="กรอกรหัสผ่าน (อย่างน้อย 8 ตัว)" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5 text-blue-400 hover:text-blue-600"/>
              </button>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-blue-700 mb-2">ยืนยันรหัสผ่าน</label>
            <div class="relative">
              <input v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" required
                class="w-full pr-12 px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
                placeholder="กรอกรหัสผ่านอีกครั้ง" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5 text-blue-400 hover:text-blue-600"/>
              </button>
            </div>
          </div>

          <div>
            <label for="weight" class="block text-sm font-semibold text-blue-700 mb-2">น้ำหนัก (กก.)</label>
            <input v-model="formData.weight" id="weight" type="number" min="10" max="500" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
              placeholder="กรอกน้ำหนัก" />
          </div>

          <div>
            <label for="height" class="block text-sm font-semibold text-blue-700 mb-2">ส่วนสูง (ซม.)</label>
            <input v-model="formData.height" id="height" type="number" min="50" max="300" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
              placeholder="กรอกส่วนสูง" />
          </div>

          <div>
            <label for="gender" class="block text-sm font-semibold text-blue-700 mb-2">เพศ</label>
            <select v-model="formData.gender" id="gender" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 focus:ring-2 focus:ring-blue-400/50">
              <option disabled value="">เลือกเพศ</option>
              <option value="Male">ชาย</option>
              <option value="Female">หญิง</option>
              <option value="Other">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label for="dob" class="block text-sm font-semibold text-blue-700 mb-2">วันเดือนปีเกิด</label>
            <input v-model="formData.dob" id="dob" type="date" :max="maxDate" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" />
          </div>
          <button @click="handleRegister" :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg transition-all duration-300">
            <span class="flex items-center justify-center">
              <Icon :name="loading ? 'lucide:loader-2' : 'lucide:user-plus'" :class="['w-5 h-5 mr-2', loading && 'animate-spin']"/>
              {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
            </span>
          </button>
        </div>

        <div class="mt-6 text-center">
          <p class="text-blue-700">
            มีบัญชีอยู่แล้ว?
            <NuxtLink to="/login" class="font-semibold text-blue-600 hover:text-blue-800 ml-1">เข้าสู่ระบบ</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '~/composable/auth/useAuth';
import { useNuxtApp } from '#app';

useHead({
  title: 'สมัครสมาชิก | JR SMARTBREATH',
  meta: [{ name: 'description', content: 'สมัครสมาชิก JR SMARTBREATH เพื่อดูแลสุขภาพการหายใจของคุณ' }]
});

const { $swal } = useNuxtApp();
const { register, loading, error } = useAuth();

// START: Change 'age' to 'dob'
const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  weight: '',
  height: '',
  gender: '',
  dob: '' // เปลี่ยนจาก age เป็น dob
});

// สร้างค่า max date สำหรับ input เพื่อไม่ให้เลือกวันในอนาคตได้
const today = new Date();
const maxDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
// END: Change 'age' to 'dob'

const showPassword = ref(false);
const showConfirmPassword = ref(false);

watch(error, (newError) => {
  if (newError) {
    $swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: newError,
        showConfirmButton: false,
        timer: 3000
    });
  }
});

const handleRegister = async () => {
  // START: Update validation logic for 'dob'
  const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password', 'confirmPassword', 'weight', 'height', 'gender', 'dob'];
  
  // --- Validation ---
  if (requiredFields.some(field => !formData.value[field])) {
    $swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'กรุณากรอกข้อมูลให้ครบถ้วน', showConfirmButton: false, timer: 3000 });
    return;
  }
  // END: Update validation logic for 'dob'
  
  if (formData.value.password !== formData.value.confirmPassword) {
    $swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน', showConfirmButton: false, timer: 3000 });
    return;
  }

  const weight = Number(formData.value.weight);
  const height = Number(formData.value.height);

  if (weight < 10 || weight > 500) {
    $swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'ค่าน้ำหนักไม่ถูกต้อง (ต้องอยู่ระหว่าง 10 - 500 กก.)', showConfirmButton: false, timer: 3000 });
    return;
  }

  if (height < 50 || height > 300) {
    $swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'ค่าส่วนสูงไม่ถูกต้อง (ต้องอยู่ระหว่าง 50 - 300 ซม.)', showConfirmButton: false, timer: 3000 });
    return;
  }
  
  // START: Prepare payload with 'dob'
  const payload = { ...formData.value, weight, height };
  delete payload.confirmPassword;
  // ไม่ต้องแปลง dob เพราะ v-model จาก <input type="date"> จะได้ค่าเป็น string 'YYYY-MM-DD' อยู่แล้ว
  // ซึ่งตรงกับที่ Joi schema คาดหวัง
  // END: Prepare payload with 'dob'

  // --- Call Register API ---
  const success = await register(payload);

  // --- Handle Success ---
  if (success) {
    await $swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ!',
        text: 'กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
    });
    navigateTo('/login');
  }
};

definePageMeta({
  layout: 'empty-layout',
});
</script>