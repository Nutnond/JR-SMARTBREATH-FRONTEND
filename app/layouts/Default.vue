<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/menu" class="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="lucide:activity" class="w-5 h-5 text-white" />
              </div>
              <span>JR-SMARTBREATH</span>
            </NuxtLink>
          </div>

          <div v-if="userStore.isLoggedIn" class="hidden md:flex items-center space-x-4">
            <div class="relative" ref="userMenuContainer">
              <button @click="toggleUserMenu" class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{ initials }}</span>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ fullName }}</span>
                <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-500" />
              </button>
              
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โปรไฟล์ของฉัน</NuxtLink>
                  <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    ออกจากระบบ
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <div class="md:hidden">
            <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Icon v-if="!showMobileMenu" name="lucide:menu" class="w-6 h-6" />
              <Icon v-else name="lucide:x" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-2">
          <div v-if="userStore.isLoggedIn" class="border-t border-gray-200 pt-4 pb-3">
            <div class="flex items-center px-3 py-2">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold">{{ initials }}</span>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ fullName }}</div>
                <div class="text-sm font-medium text-gray-500">{{ email }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <NuxtLink to="/profile" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                โปรไฟล์ของฉัน
              </NuxtLink>
              <button @click="handleLogout" class="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:text-red-600 hover:bg-red-50 rounded-md">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p class="text-center text-gray-500 text-sm">
          © 2025 JR-SMARTBREATH. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/userStore';
import { useAuth } from '~/composable/auth/useAuth';

// 1. ดึง Store และ Composable มาใช้งาน
const userStore = useUserStore();
const { logout } = useAuth();

// 2. Reactive state สำหรับควบคุมการแสดงผลเมนู
const showMobileMenu = ref(false);
const showUserMenu = ref(false);
const userMenuContainer = ref(null); // Ref สำหรับ div ของ user menu

// 3. Computed properties สำหรับดึงข้อมูลจาก State
//    - ใช้ computed เพื่อให้ข้อมูลอัปเดตตาม State อัตโนมัติ
//    - มีการป้องกันกรณี user เป็น null (ยังไม่โหลด/ยังไม่ login)
const fullName = computed(() => userStore.fullName);

const email = computed(() => userStore.user?.email || '');

const initials = computed(() => {
  console.log('userStore.user in initials:', userStore.user.firstName);
  
  if (userStore.user?.firstName && userStore.user?.lastName) {
    return `${userStore.user.firstName[0]}${userStore.user.lastName[0]}`.toUpperCase();
  }
  return '';
});

// 4. ฟังก์ชันสำหรับจัดการเหตุการณ์
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  // เรียกใช้ฟังก์ชัน logout จาก useAuth composable
  // ซึ่งจะจัดการลบ token, ล้าง state, และ redirect ไปหน้า login ให้เอง
  logout();
};

// 5. Lifecycle Hooks สำหรับจัดการการปิดเมนู
const handleClickOutside = (event) => {
  // ตรวจสอบว่าคลิกนอกพื้นที่ของ user menu หรือไม่
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// ปิดเมนูเมื่อมีการเปลี่ยนหน้า
const router = useRouter();
router.afterEach(() => {
  showMobileMenu.value = false;
  showUserMenu.value = false;
});
</script>