<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white">
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <header class="mb-10">
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="goBack"
            class="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>กลับ</span>
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-3xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 bg-clip-text text-transparent mb-4">
            เลือกอุปกรณ์สำหรับตรวจสอบการวัดผลของคุณ
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mb-4"></div>
          
        </div>
      </header>

      <!-- Error State -->
      <div v-if="error" class="text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-700 text-lg">{{ error }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="text-center py-16">
        <div class="inline-flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="text-slate-600 text-lg">กำลังโหลดอุปกรณ์...</p>
        </div>
      </div>

      <!-- Devices Grid -->
      <div v-else-if="filteredDevices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Transition
          v-for="(device, index) in filteredDevices"
          :key="device.id"
          appear
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 transform translate-y-8"
          enter-to-class="opacity-100 transform translate-y-0"
          :style="{ 'transition-delay': `${index * 100}ms` }"
        >
          <div class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-200/50 hover:border-blue-300 hover:scale-105 overflow-hidden">
             
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-blue-500 to-sky-500 p-4">
              <div class="flex items-center space-x-3 text-white">
                <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon name="lucide:smartphone" class="w-6 h-6" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold truncate">
                    {{ device.deviceName }}
                  </h3>
                  <p class="text-blue-100 text-sm">
                    อุปกรณ์ : {{ device.model }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <!-- Device Info -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                  <div class="flex items-center space-x-2">
                    <Icon name="lucide:calendar" class="w-4 h-4 text-slate-600" />
                    <span class="text-sm font-medium text-slate-700">อัปเดตล่าสุด</span>
                  </div>
                  <span class="text-sm text-slate-600 bg-white px-3 py-1 rounded-full">
                    {{ formatDateTime(device.updatedAt) }}
                  </span>
                </div>


              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button 
                  @click="viewRecords(device)" 
                  class="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Icon name="lucide:bar-chart-3" class="w-4 h-4" />
                  <span>ดูรายการวัดผล</span>
                  <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <div class="flex space-x-2">
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-blue-100 max-w-lg mx-auto">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:smartphone" class="w-10 h-10 text-blue-500" />
          </div>
          <h3 class="text-2xl font-semibold text-slate-800 mb-4">ไม่พบอุปกรณ์</h3>
          <p class="text-slate-600 mb-6 leading-relaxed">
            {{ searchQuery ? 'ไม่พบอุปกรณ์ที่ตรงกับการค้นหา' : 'คุณยังไม่มีอุปกรณ์ในระบบ กรุณาเพิ่มอุปกรณ์เพื่อเริ่มใช้งาน' }}
          </p>
          <div class="space-y-3">
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
            >
              ล้างการค้นหา
            </button>
            <button
              v-else
              @click="navigateTo('/devices')"
              class="bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 text-slate-700 hover:text-blue-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-200 hover:border-blue-300 flex items-center space-x-2 mx-auto"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span>เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeviceApi } from '~/composable/devices/getDevice'

const router = useRouter()

const { 
  loading: isLoading,
  error, 
  devices, 
  fetchDevices 
} = useDeviceApi()

const searchQuery = ref('')

const filteredDevices = computed(() => {
  let filtered = devices.value || []
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(device =>
      device.deviceName.toLowerCase().includes(query) ||
      device.owner.username.toLowerCase().includes(query)
    )
  }
  return filtered
})

const goBack = () => {
  router.back()
}

const viewRecords = (device) => {
  navigateTo(`/result?id=${device.id}`);
}

const deleteDevice = async (device) => {
  console.log('Deleting device:', device)
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์: ${device.deviceName}?`)) {
    alert(`ลบอุปกรณ์ ${device.deviceName} เรียบร้อยแล้ว (จำลอง)`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}


onMounted(async() => {
  await fetchDevices()
  console.log(devices.value);
  
})

definePageMeta({
  title:"JR-SMARTBREATH",
  middleware:'auth'
})
</script>