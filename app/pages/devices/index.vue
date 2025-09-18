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
                    @click="editDevice(device)"
                    class="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group/btn"
                    title="แก้ไข"
                  >
                    <Icon name="lucide:edit" class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  <button
                    @click="handleResetDevice(device)"
                    class="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
                    title="ลบ"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
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
              <label class="block text-sm font-medium text-slate-700 mb-2">ชื่ออุปกรณ์</label>
              <input
                v-model="newDevice.name"
                type="text"
                placeholder="ระบุชื่ออุปกรณ์"
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

      <!-- Edit Device Modal -->
      <div v-if="showEditDeviceModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
          <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-800">แก้ไขอุปกรณ์</h3>
              <button
                @click="closeEditModal"
                class="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <Icon name="lucide:x" class="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">ชื่ออุปกรณ์</label>
              <input
                v-model="editingDevice.deviceName"
                type="text"
                placeholder="ระบุชื่ออุปกรณ์"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <!-- แสดงข้อมูลอื่น ๆ แต่ไม่สามารถแก้ไขได้ -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">รุ่น</label>
              <input
                :value="editingDevice.model || 'ไม่ระบุรุ่น'"
                type="text"
                disabled
                class="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">เจ้าของอุปกรณ์</label>
              <input
                :value="editingDevice.owner?.username || 'ไม่ระบุเจ้าของ'"
                type="text"
                disabled
                class="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div class="p-6 border-t border-slate-200 flex space-x-3">
            <button
              @click="closeEditModal"
              class="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all duration-200"
            >
              ยกเลิก
            </button>
            <button
              @click="handleEdit"
              :disabled="isUpdating"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <div v-if="isUpdating" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{{ isUpdating ? 'กำลังบันทึก...' : 'บันทึก' }}</span>
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
  fetchDevices,
  updateDevice,
  resetDevice,
  registerDevice
} = useDeviceApi()
const { $swal } = useNuxtApp();
const searchQuery = ref('')
const showAddDeviceModal = ref(false)
const showEditDeviceModal = ref(false)
const isUpdating = ref(false)

const newDevice = ref({
  name: '',
  deviceId: ''
})

const editingDevice = ref({
  id: '',
  deviceName: '',
  model: '',
  owner: null
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
  editingDevice.value = {
    id: device.id,
    deviceName: device.deviceName,
    model: device.model,
    owner: device.owner
  }
  showEditDeviceModal.value = true
}

const closeEditModal = () => {
  showEditDeviceModal.value = false
  editingDevice.value = {
    id: '',
    deviceName: '',
    model: '',
    owner: null
  }
}

const handleEdit = async () => {
  if (!editingDevice.value.deviceName.trim()) {
    alert('กรุณากรอกชื่ออุปกรณ์')
    return
  }

  isUpdating.value = true
  
  try {
     // เรียกใช้ฟังก์ชันใหม่จาก composable
    const success = await updateDevice(editingDevice.value.id, { 
      deviceName:editingDevice.value.deviceName
    });

    if (success) {
      $swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'แก้ไขข้อมูลอุปกรณ์สำเร็จ',
        showConfirmButton: false,
        timer: 2000
      });
      showEditDeviceModal.value = false;
      await fetchDevices(); // โหลดข้อมูลใหม่
    } else {
      // error.value จาก composable จะถูกตั้งค่าอัตโนมัติ
      throw new Error(error.value || 'Update failed');
    }
  } catch (error) {
     $swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: error.message || 'เกิดข้อผิดพลาดในการแก้ไข',
      showConfirmButton: false,
      timer: 3000
    });
    
  } finally {
    isUpdating.value = false
    await fetchDevices(); // โหลดข้อมูลใหม่
    closeEditModal()
  }
}

const handleResetDevice = async (device) => {
  const result = await $swal.fire({
    title: 'ยืนยันการลบ',
    text: `คุณต้องการลบอุปกรณ์ "${device.deviceName}" ใช่หรือไม่? ข้อมูลการวัดผลทั้งหมดจะถูกลบ`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F53914', // สีเหลืองอำพัน
    cancelButtonColor: '#718096',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  })

  if (result.isConfirmed) {
    try {
      // ✅ เรียกใช้ฟังก์ชัน resetDevice จาก composable
      const success = await resetDevice(device.id)

      if (success) {
        $swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'ลบอุปกรณ์สำเร็จ!',
          showConfirmButton: false,
          timer: 2000
        })
        // Refresh a list เพื่อแสดงผลล่าสุด
        await fetchDevices()
      } else {
        // หากล้มเหลว ให้โยน error ที่ได้จาก composable
        throw new Error(error.value || 'การลบอุปกรณ์ล้มเหลว')
      }
    } catch (err) {
      $swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.message || 'เกิดข้อผิดพลาดในการลบอุปกรณ์',
        showConfirmButton: false,
        timer: 3000
      })
      await fetchDevices()
    }
  }
}

const addDevice = async () => {
  // 1. ตรวจสอบข้อมูลจากฟอร์ม
  if (!newDevice.value.name) {
    $swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'กรุณากรอกชื่อของอุปกรณ์',
      showConfirmButton: false,
      timer: 3000
    })
    return
  }
  
  try {
    // 2. เตรียมข้อมูล (payload) ที่จะส่งไป API
    // สังเกตว่ามีการแปลง .name เป็น .deviceName ให้ตรงกับที่ backend ต้องการ
    const payload = {
        deviceName: newDevice.value.name,
    }

    // 3. เรียกใช้ฟังก์ชัน createDevice จาก composable
    const success = await registerDevice(newDevice.value.deviceId,payload)

    if (success) {
      $swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'ลงทะเบียนอุปกรณ์ใหม่สำเร็จ!',
        showConfirmButton: false,
        timer: 2000
      })
      
      // Reset form และปิด modal
      newDevice.value = { name: '', model: '', deviceId: '' }
      showAddDeviceModal.value = false
      
      // โหลดรายการอุปกรณ์ใหม่
      await fetchDevices()
    } else {
      // หากล้มเหลว ให้โยน error ที่ได้จาก composable
      throw new Error(error.value || 'การลงทะเบียนอุปกรณ์ล้มเหลว')
    }

  } catch (err) {
    // 4. แสดงข้อผิดพลาด
    $swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: err.message || 'เกิดข้อผิดพลาดในการลงทะเบียนอุปกรณ์',
      showConfirmButton: false,
      timer: 3000
    })
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
})

definePageMeta({
  title: "SMARTBREATH - จัดการอุปกรณ์",
  middleware: 'auth'
})
</script>