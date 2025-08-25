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
        
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 bg-clip-text text-transparent mb-4">
              จัดการอุปกรณ์
            </h1>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mb-4"></div>
            <p class="text-slate-600 text-lg">จัดการและดูแลอุปกรณ์ทั้งหมดในระบบ</p>
          </div>
          
          <div class="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาอุปกรณ์..."
                class="pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-64"
              />
            </div>
            <button
              @click="showAddDeviceModal = true"
              class="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span>เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl">
              <Icon name="lucide:smartphone" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-600">อุปกรณ์ทั้งหมด</p>
              <p class="text-2xl font-bold text-slate-800">{{ totalDevices }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Icon name="lucide:wifi" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-600">ออนไลน์</p>
              <p class="text-2xl font-bold text-slate-800">{{ onlineDevices }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <Icon name="lucide:wifi-off" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-600">ออฟไลน์</p>
              <p class="text-2xl font-bold text-slate-800">{{ offlineDevices }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Icon name="lucide:activity" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-600">ใช้งานวันนี้</p>
              <p class="text-2xl font-bold text-slate-800">{{ activeToday }}</p>
            </div>
          </div>
        </div>
      </div>

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

      <!-- Device List -->
      <div v-else-if="filteredDevices.length > 0" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <h2 class="text-lg font-semibold text-slate-800">รายการอุปกรณ์</h2>
          <p class="text-sm text-slate-600 mt-1">พบ {{ filteredDevices.length }} อุปกรณ์</p>
        </div>
        
        <div class="divide-y divide-slate-200">
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-x-8"
            enter-to-class="opacity-100 transform translate-x-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-x-0"
            leave-to-class="opacity-0 transform -translate-x-8"
          >
            <div
              v-for="(device, index) in filteredDevices"
              :key="device.id"
              class="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-sky-50/30 transition-all duration-200"
              :style="{ 'transition-delay': `${index * 50}ms` }"
            >
              <div class="px-6 py-6 flex items-center justify-between">
                <div class="flex items-center space-x-4 flex-1 min-w-0">
                  <!-- Device Icon & Status -->
                  <div class="relative">
                    <div class="p-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl shadow-sm">
                      <Icon name="lucide:smartphone" class="w-6 h-6 text-white" />
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                  </div>
                  
                  <!-- Device Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-1">
                      <h3 class="text-lg font-semibold text-slate-800 truncate">
                        {{ device.deviceName }}
                      </h3>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        ออนไลน์
                      </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-slate-600">
                      <span class="flex items-center space-x-1">
                        <Icon name="lucide:monitor" class="w-3 h-3" />
                        <span>{{ device.model || 'ไม่ระบุรุ่น' }}</span>
                      </span>
                      <span class="flex items-center space-x-1">
                        <Icon name="lucide:calendar" class="w-3 h-3" />
                        <span>{{ formatDateTime(device.updatedAt) }}</span>
                      </span>
                      <span class="flex items-center space-x-1">
                        <Icon name="lucide:user" class="w-3 h-3" />
                        <span>{{ device.owner?.username || 'ไม่ระบุเจ้าของ' }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    @click="viewDevice(device)"
                    class="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/btn"
                    title="ดูรายละเอียด"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  <button
                    @click="editDevice(device)"
                    class="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group/btn"
                    title="แก้ไข"
                  >
                    <Icon name="lucide:edit" class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  <button
                    @click="deleteDevice(device)"
                    class="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
                    title="ลบ"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  <div class="w-px h-6 bg-slate-200 mx-2"></div>
                  
                  <button
                    class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <Icon name="lucide:settings" class="w-3 h-3" />
                    <span>ตั้งค่า</span>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
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
              @click="showAddDeviceModal = true"
              class="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md flex items-center space-x-2 mx-auto"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span>เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Device Modal -->
      <div v-if="showAddDeviceModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
          <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-800">เพิ่มอุปกรณ์ใหม่</h3>
              <button
                @click="showAddDeviceModal = false"
                class="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <Icon name="lucide:x" class="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">ชื่ือุปกรณ์</label>
              <input
                v-model="newDevice.name"
                type="text"
                placeholder="ระบุชื่ออุปกรณ์"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">รุ่น</label>
              <input
                v-model="newDevice.model"
                type="text"
                placeholder="ระบุรุ่นอุปกรณ์"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">รหัสอุปกรณ์</label>
              <input
                v-model="newDevice.deviceId"
                type="text"
                placeholder="ระบุรหัสอุปกรณ์"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          
          <div class="p-6 border-t border-slate-200 flex space-x-3">
            <button
              @click="showAddDeviceModal = false"
              class="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all duration-200"
            >
              ยกเลิก
            </button>
            <button
              @click="addDevice"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md"
            >
              เพิ่มอุปกรณ์
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
const showAddDeviceModal = ref(false)
const newDevice = ref({
  name: '',
  model: '',
  deviceId: ''
})

const filteredDevices = computed(() => {
  let filtered = devices.value || []
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(device =>
      device.deviceName.toLowerCase().includes(query) ||
      (device.owner?.username || '').toLowerCase().includes(query) ||
      (device.model || '').toLowerCase().includes(query)
    )
  }
  return filtered
})

// Stats calculations
const totalDevices = computed(() => devices.value?.length || 0)
const onlineDevices = computed(() => Math.floor(totalDevices.value * 0.8)) // Mock data
const offlineDevices = computed(() => totalDevices.value - onlineDevices.value)
const activeToday = computed(() => Math.floor(totalDevices.value * 0.6)) // Mock data

const goBack = () => {
  router.back()
}

const viewDevice = (device) => {
  navigateTo(`/devices/${device.id}`)
}

const editDevice = (device) => {
  alert(`แก้ไขอุปกรณ์: ${device.deviceName} (จำลอง)`)
}

const deleteDevice = async (device) => {
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์: ${device.deviceName}?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
    try {
      // Here you would call the actual delete API
      alert(`ลบอุปกรณ์ ${device.deviceName} เรียบร้อยแล้ว (จำลอง)`)
      // Refresh the devices list
      await fetchDevices()
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบอุปกรณ์')
    }
  }
}

const addDevice = async () => {
  if (!newDevice.value.name || !newDevice.value.model || !newDevice.value.deviceId) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }
  
  try {
    // Here you would call the actual add device API
    alert(`เพิ่มอุปกรณ์ ${newDevice.value.name} เรียบร้อยแล้ว (จำลอง)`)
    
    // Reset form and close modal
    newDevice.value = { name: '', model: '', deviceId: '' }
    showAddDeviceModal.value = false
    
    // Refresh the devices list
    await fetchDevices()
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์')
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'ไม่ระบุ'
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  })
}

onMounted(async() => {
  await fetchDevices()
  console.log(devices.value)
})

definePageMeta({
  title: "JR-SMARTBREATH - จัดการอุปกรณ์",
  middleware: 'auth'
})
</script>