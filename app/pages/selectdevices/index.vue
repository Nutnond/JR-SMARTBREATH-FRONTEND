<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Devices Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="n in 6" 
          :key="n"
          class="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 animate-pulse"
        >
          <div class="flex items-start space-x-4">
            <div class="bg-slate-200 w-12 h-12 rounded-xl"></div>
            <div class="flex-1">
              <div class="bg-slate-200 h-4 rounded mb-2"></div>
              <div class="bg-slate-200 h-3 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Transition
          v-for="(device, index) in filteredDevices"
          :key="device.id"
          appear
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 transform translate-y-8"
          enter-to-class="opacity-100 transform translate-y-0"
          :style="{ 'transition-delay': `${index * 100}ms` }"
        >
          <div
            :class="[
              'group cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border transition-all duration-300 hover:-translate-y-1',
              selectedDevice?.id === device.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/50'
                : 'border-blue-100 hover:border-blue-200'
            ]"
            @click="selectDevice(device)"
          >
            <div class="flex items-start space-x-4">
              <!-- Device Icon -->
              <div :class="[
                'p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300',
                selectedDevice?.id === device.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-r from-slate-400 to-slate-600'
              ]">
                <Icon name="lucide:smartphone" class="w-6 h-6 text-white" />
              </div>

              <div class="flex-1 min-w-0">
                <!-- Device Name -->
                <h3 :class="[
                  'text-lg font-semibold mb-1 truncate group-hover:text-blue-700 transition-colors',
                  selectedDevice?.id === device.id ? 'text-blue-700' : 'text-slate-800'
                ]">
                  {{ device.deviceName }}
                </h3>

                <!-- Owner Info -->
                <p class="text-sm text-slate-500 mb-2">
                  เจ้าของ: {{ device.owner.username }}
                </p>

                <!-- Device Status -->
                <div class="flex items-center space-x-2 mb-3">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    getDeviceStatus(device) === 'online' ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <span :class="[
                    'text-xs font-medium',
                    getDeviceStatus(device) === 'online' ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ getDeviceStatus(device) === 'online' ? 'ออนไลน์' : 'ออฟไลน์' }}
                  </span>
                </div>

                <!-- Last Update -->
                <p class="text-xs text-slate-400">
                  อัปเดตล่าสุด: {{ formatDate(device.updatedAt) }}
                </p>

                <!-- Selected Badge -->
                <div v-if="selectedDevice?.id === device.id" class="mt-3">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Icon name="lucide:check-circle" class="w-3 h-3 mr-1" />
                    เลือกแล้ว
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click.stop="viewDeviceDetails(device)"
                class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                ดูรายละเอียด
              </button>
              <button
                @click.stop="testConnection(device)"
                class="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                ทดสอบการเชื่อมต่อ
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredDevices.length === 0" class="text-center py-16">
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-md mx-auto">
          <Icon name="lucide:search-x" class="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-slate-800 mb-2">ไม่พบอุปกรณ์</h3>
          <p class="text-slate-500 mb-4">
            {{ searchQuery ? 'ไม่พบอุปกรณ์ที่ตรงกับการค้นหา' : 'ไม่มีอุปกรณ์ในระบบ' }}
          </p>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            ล้างการค้นหา
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="selectedDevice" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div class="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-blue-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-600" />
              <span class="text-sm font-medium text-slate-700">เลือก: {{ selectedDevice.deviceName }}</span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="confirmSelection"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                ยืนยัน
              </button>
              <button
                @click="clearSelection"
                class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>



// Reactive data
const isLoading = ref(true)
const searchQuery = ref('')
const selectedDevice = ref(null)
const currentFilter = ref('all')

// Sample devices data (replace with actual API call)
const devices = ref([
  {
    "id": "2cdde873-07f6-4fc1-86f4-51d27333580b",
    "deviceName": "My Smart Device 01",
    "ownerId": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
    "registeredAt": "2025-08-22T15:08:18.000Z",
    "updatedAt": "2025-08-22T15:08:18.000Z",
    "registered_at": "2025-08-22T15:08:18.000Z",
    "updated_at": "2025-08-22T15:08:18.000Z",
    "owner_id": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
    "owner": {
      "id": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
      "username": "testuser01"
    }
  },
  {
    "id": "3cdde873-07f6-4fc1-86f4-51d27333580c",
    "deviceName": "Smart Health Monitor Pro",
    "ownerId": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
    "registeredAt": "2025-08-21T10:30:45.000Z",
    "updatedAt": "2025-08-23T08:15:30.000Z",
    "registered_at": "2025-08-21T10:30:45.000Z",
    "updated_at": "2025-08-23T08:15:30.000Z",
    "owner_id": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
    "owner": {
      "id": "4278a7d8-d940-4f0c-ab6e-f2a477d7e7b1",
      "username": "testuser01"
    }
  },
  {
    "id": "4cdde873-07f6-4fc1-86f4-51d27333580d",
    "deviceName": "Fitness Tracker X200",
    "ownerId": "5278a7d8-d940-4f0c-ab6e-f2a477d7e7b2",
    "registeredAt": "2025-08-20T14:22:10.000Z",
    "updatedAt": "2025-08-22T16:45:20.000Z",
    "registered_at": "2025-08-20T14:22:10.000Z",
    "updated_at": "2025-08-22T16:45:20.000Z",
    "owner_id": "5278a7d8-d940-4f0c-ab6e-f2a477d7e7b2",
    "owner": {
      "id": "5278a7d8-d940-4f0c-ab6e-f2a477d7e7b2",
      "username": "healthuser02"
    }
  }
])

// Filter options
const filterOptions = ref([
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'online', label: 'ออนไลน์' },
  { value: 'offline', label: 'ออฟไลน์' },
  { value: 'recent', label: 'ใช้งานล่าสุด' }
])

// Computed properties
const filteredDevices = computed(() => {
  let filtered = devices.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(device =>
      device.deviceName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      device.owner.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by status
  if (currentFilter.value === 'online') {
    filtered = filtered.filter(device => getDeviceStatus(device) === 'online')
  } else if (currentFilter.value === 'offline') {
    filtered = filtered.filter(device => getDeviceStatus(device) === 'offline')
  } else if (currentFilter.value === 'recent') {
    filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }

  return filtered
})

const onlineDevices = computed(() => {
  return devices.value.filter(device => getDeviceStatus(device) === 'online').length
})

// Methods
const goBack = () => {
  // Navigate back to previous page
  // navigateTo('/')
  history.back()
}

const selectDevice = (device) => {
  if (selectedDevice.value?.id === device.id) {
    selectedDevice.value = null
  } else {
    selectedDevice.value = device
  }
}

const clearSelection = () => {
  selectedDevice.value = null
}

const clearSearch = () => {
  searchQuery.value = ''
}

const confirmSelection = async () => {
  if (!selectedDevice.value) return

  // Show loading state or confirmation
  const confirmed = confirm(`ยืนยันการเลือกอุปกรณ์: ${selectedDevice.value.deviceName}?`)
  
  if (confirmed) {
    // Store selected device (localStorage, store, etc.)
    console.log('Selected device:', selectedDevice.value)
    
    // Navigate to next page or emit event
    // await navigateTo('/health-check')
    alert(`เลือกอุปกรณ์: ${selectedDevice.value.deviceName} เรียบร้อยแล้ว`)
  }
}

const viewDeviceDetails = (device) => {
  console.log('View device details:', device)
  // Navigate to device details page
  // await navigateTo(`/device/${device.id}`)
  alert(`ดูรายละเอียดของ: ${device.deviceName}`)
}

const testConnection = async (device) => {
  console.log('Testing connection for:', device)
  // Test device connection
  alert(`ทดสอบการเชื่อมต่อกับ: ${device.deviceName}`)
}

const getDeviceStatus = (device) => {
  // Simple logic to determine device status
  // In real app, this would check actual device connectivity
  const now = new Date()
  const lastUpdate = new Date(device.updatedAt)
  const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60)
  
  return hoursDiff < 24 ? 'online' : 'offline'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle hooks
onMounted(async () => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 1500)

  // In real app, fetch devices from API
  // const { data } = await $fetch('/api/devices')
  // devices.value = data
})
</script>

<style scoped>
/* Custom animations */
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
</style>