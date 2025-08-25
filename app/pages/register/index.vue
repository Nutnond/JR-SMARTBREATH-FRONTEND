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
            </select>
          </div>

          <div>
            <label for="age" class="block text-sm font-semibold text-blue-700 mb-2">อายุ</label>
            <input v-model="formData.age" id="age" type="number" min="1" required
              class="w-full px-4 py-3 bg-white/70 border border-blue-200/50 rounded-2xl text-blue-900 placeholder-blue-400/70 focus:ring-2 focus:ring-blue-400/50" 
              placeholder="กรอกอายุ" />
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

    <Transition 
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="opacity-0 translate-y-2" 
      enter-to-class="opacity-100 translate-y-0" 
      leave-active-class="transition ease-in duration-200" 
      leave-from-class="opacity-100 translate-y-0" 
      leave-to-class="opacity-0 translate-y-2">
      <div v-if="showToast" class="fixed top-4 right-4 z-50 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm">
        <div class="flex items-center">
          <Icon name="lucide:info" class="w-5 h-5 text-blue-500 mr-3" />
          <p class="text-sm font-medium text-gray-900">{{ toastMessage }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '~/composable/auth/useAuth'; // Corrected path
useHead({
  title: 'สมัครสมาชิก | JR SMARTBREATH',
  meta: [{ name: 'description', content: 'สมัครสมาชิก JR SMARTBREATH เพื่อดูแลสุขภาพการหายใจของคุณ' }]
});

const { register, loading, error } = useAuth();

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '', // ✅ ADDED
  weight: '',
  height: '',
  gender: '',
  age: ''
});

const showPassword = ref(false);
const showConfirmPassword = ref(false); // ✅ ADDED
const showToast = ref(false);
const toastMessage = ref('');

watch(error, (newError) => {
  if (newError) {
    showToastMessage(newError);
  }
});

const handleRegister = async () => {
  // 1. Check for empty fields
  const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password', 'confirmPassword', 'weight', 'height', 'gender', 'age'];
  if (requiredFields.some(field => !formData.value[field])) {
    showToastMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }
  
  // 2. ✅ ADDED: Validate Password Confirmation
  if (formData.value.password !== formData.value.confirmPassword) {
    showToastMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    return;
  }

  // 3. ✅ ADDED: Validate Weight and Height ranges
  const weight = Number(formData.value.weight);
  const height = Number(formData.value.height);

  if (weight < 10 || weight > 500) {
    showToastMessage('ค่าน้ำหนักไม่ถูกต้อง (ต้องอยู่ระหว่าง 10 - 500 กก.)');
    return;
  }

  if (height < 50 || height > 300) {
    showToastMessage('ค่าส่วนสูงไม่ถูกต้อง (ต้องอยู่ระหว่าง 50 - 300 ซม.)');
    return;
  }
  
  // 4. Prepare payload (remove confirmPassword)
  const payload = {
    ...formData.value,
    weight: weight,
    height: height,
    age: Number(formData.value.age)
  };
  delete payload.confirmPassword;

  // 5. Call register function
  const success = await register(payload);

  if (success) {
    showToastMessage('สมัครสมาชิกสำเร็จ!');
    setTimeout(() => navigateTo('/login'), 1500);
  }
};

const showToastMessage = (msg) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

definePageMeta({
  layout: 'empty-layout',
});
</script>