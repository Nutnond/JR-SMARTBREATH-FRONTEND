<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button @click="goBack"
                class="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                <Icon name="lucide:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>กลับ</span>
            </button>

            <div class="mt-6 mb-10">
                <div class="text-center">
                    <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 bg-clip-text text-transparent mb-4">
                        Health Records
                    </h1>
                    <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full mx-auto mb-4"></div>
                    <p v-if="pagination" class="text-slate-600 text-lg">
                        รายการข้อมูลการตรวจวัดสุขภาพปอดทั้งหมด 
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ml-2">
                            {{ pagination.totalItems }} รายการ
                        </span>
                    </p>
                </div>
            </div>

            <div v-if="isLoading" class="text-center py-16">
                <div class="inline-flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p class="text-slate-600 text-lg">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
            
            <div v-else-if="error" class="text-center py-16">
                <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                    <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p class="text-red-700 text-lg">{{ error }}</p>
                </div>
            </div>

            <!-- Empty State: แสดงเมื่อไม่มีรายการ -->
            <div v-else-if="!isLoading && records && records.length === 0" class="text-center py-16">
                <div class="bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 border-2 border-dashed border-slate-300 rounded-3xl p-12 max-w-2xl mx-auto">
                    <div class="relative mb-8">
                        <!-- Background decoration -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-5">
                            <Icon name="lucide:monitor" class="w-64 h-64 text-slate-400" />
                        </div>
                        
                        <!-- Main icon with animation -->
                        <div class="relative animate-pulse">
                            <div class="bg-gradient-to-br from-blue-100 to-sky-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-blue-200">
                                <Icon name="lucide:file-text" class="w-12 h-12 text-blue-500 mx-auto" />
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
                        ไม่มีข้อมูลการตรวจวัด
                    </h3>
                    
                    <p class="text-slate-500 text-lg mb-6 max-w-md mx-auto leading-relaxed">
                        ยังไม่มีรายการข้อมูลการตรวจวัดสุขภาพปอดจากเครื่องนี้ 
                        เริ่มต้นการตรวจวัดเพื่อดูผลลัพธ์ที่นี่
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                
                        
                        <button @click="refreshData" 
                            class="group bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-medium px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 flex items-center space-x-2 hover:shadow-md">
                            <Icon name="lucide:refresh-cw" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            <span>รีเฟรช</span>
                        </button>
                    </div>

                    <!-- Additional info -->
                    <div class="mt-8 pt-6 border-t border-slate-200">
                        <div class="flex items-center justify-center space-x-2 text-sm text-slate-400">
                            <Icon name="lucide:info" class="w-4 h-4" />
                            <span>ข้อมูลจะแสดงที่นี่หลังจากการตรวจวัด</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Records List: แสดงเมื่อมีรายการ -->
            <div v-else-if="records && records.length > 0">
                <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="record in records" :key="record.id"
                        class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-200/50 hover:border-blue-300 hover:scale-105 overflow-hidden">
                        
                        <div class="bg-gradient-to-r from-blue-500 to-sky-500 p-4">
                            <div class="flex items-center justify-between text-white">
                                <div class="flex items-center space-x-2">
                                    <Icon name="lucide:monitor" class="w-5 h-5"/>
                                    <span class="text-sm font-medium">{{ deviceName || 'Unknown Device' }}</span>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs opacity-80">
                                        {{ formatDateTime(record.measuredAt) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gradient-to-br from-red-50 to-rose-100 p-4 rounded-xl border border-red-200/50 hover:shadow-md transition-all duration-200">
                                    <div class="flex items-center justify-between mb-2">
                                        <Icon name="lucide:heart-pulse" class="w-4 h-4 text-red-600" />
                                        <span class="text-xs font-medium text-red-700 bg-red-200/50 px-2 py-1 rounded-full">SpO2</span>
                                    </div>
                                    <p class="text-2xl font-bold text-red-800">{{ record.spo2 }}<span class="text-sm">%</span></p>
                                </div>

                                <div class="bg-gradient-to-br from-emerald-50 to-teal-100 p-4 rounded-xl border border-emerald-200/50 hover:shadow-md transition-all duration-200">
                                    <div class="flex items-center justify-between mb-2">
                                        <Icon name="lucide:wind" class="w-4 h-4 text-emerald-600" />
                                        <span class="text-xs font-medium text-emerald-700 bg-emerald-200/50 px-2 py-1 rounded-full">FEV1</span>
                                    </div>
                                    <p class="text-2xl font-bold text-emerald-800">{{ record.fev1 }}<span class="text-sm">L</span></p>
                                </div>

                                <div class="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-xl border border-amber-200/50 hover:shadow-md transition-all duration-200">
                                    <div class="flex items-center justify-between mb-2">
                                        <Icon name="lucide:activity" class="w-4 h-4 text-amber-600" />
                                        <span class="text-xs font-medium text-amber-700 bg-amber-200/50 px-2 py-1 rounded-full">FVC</span>
                                    </div>
                                    <p class="text-2xl font-bold text-amber-800">{{ record.fvc }}<span class="text-sm">L</span></p>
                                </div>

                                <div class="bg-gradient-to-br from-violet-50 to-purple-100 p-4 rounded-xl border border-violet-200/50 hover:shadow-md transition-all duration-200">
                                    <div class="flex items-center justify-between mb-2">
                                        <Icon name="lucide:zap" class="w-4 h-4 text-violet-600" />
                                        <span class="text-xs font-medium text-violet-700 bg-violet-200/50 px-2 py-1 rounded-full">PEF</span>
                                    </div>
                                    <p class="text-2xl font-bold text-violet-800">{{ record.pef }}<span class="text-sm">L/min</span></p>
                                </div>
                            </div>

                            <div class="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl mb-6 border border-slate-200/50">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                        <Icon name="lucide:target" class="w-4 h-4" />
                                        <span>FEV1/FVC Ratio</span>
                                    </span>
                                    <span class="text-lg font-bold text-slate-800 bg-white px-3 py-1 rounded-full shadow-sm">
                                        {{ (parseFloat(record.fev1Fvc) * 100).toFixed(1) }}%
                                    </span>
                                </div>
                                <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                    <div class="bg-gradient-to-r from-blue-400 to-sky-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                        :style="{ width: (parseFloat(record.fev1Fvc) * 100) + '%' }">
                                    </div>
                                </div>
                            </div>

                            <div class="flex space-x-3">
                                <button @click="navigateToResult(record.id)"
                                    class="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 group">
                                    <span>ดูรายละเอียด</span>
                                    <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <button @click="handleDeleteRecord(record.id)"
                                    class="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 hover:text-red-800 font-medium py-3 px-4 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md group">
                                    <Icon name="lucide:trash-2" class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="pagination && pagination.totalPages > 1"
                    class="mt-12 flex justify-center items-center space-x-4">
                    <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                        class="flex items-center space-x-2 px-6 py-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-slate-700 hover:text-blue-700">
                        <Icon name="lucide:chevron-left" class="w-4 h-4" />
                        <span>ก่อนหน้า</span>
                    </button>
                    
                    <div class="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                        <span class="text-sm font-medium text-slate-700">
                            หน้า <span class="text-blue-600 font-bold">{{ pagination.page }}</span> 
                            จาก <span class="text-slate-800 font-bold">{{ pagination.totalPages }}</span>
                        </span>
                    </div>

                    <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
                        class="flex items-center space-x-2 px-6 py-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-slate-700 hover:text-blue-700">
                        <span>ถัดไป</span>
                        <Icon name="lucide:chevron-right" class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// ✅ UPDATED: Standardized composable paths
import { useRecordApi } from '~/composable/record/get-record';
import { useDeviceApi } from '~/composable/devices/getDevice';
const { $swal } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const machineId = route.query.id;

// ✅ UPDATED: Use aliasing for the delete function to avoid name conflicts
const { 
    records, 
    pagination, 
    loading: isLoading,
    error,
    fetchRecords,
    deleteRecord: deleteRecordFromApi // Use the correct function name with an alias
} = useRecordApi();

const {
    getDeviceById
} = useDeviceApi();

const deviceName = ref(null);

onMounted(async () => {
    if (machineId) {
        let device = await getDeviceById(machineId);
        deviceName.value = device.deviceName;
        fetchRecords(machineId);
    } else {
        error.value = "ไม่พบ ID ของเครื่องใน URL";
    }
});

const changePage = (newPage) => {
    if (!isLoading.value) {
        fetchRecords(machineId, { page: newPage });
    }
}

// ✅ UPDATED: Renamed function to avoid confusion and call the aliased composable function
// ✅ UPDATED: ฟังก์ชันที่ใช้ SweetAlert2 สำหรับการยืนยันและแสดงผล
const handleDeleteRecord = async (recordId) => {
    const result = await $swal({
        title: 'ยืนยันการลบ',
        text: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e', // สีแดง
        cancelButtonColor: '#718096', // สีเทา
        confirmButtonText: 'ใช่, ลบเลย',
        cancelButtonText: 'ยกเลิก'
    });

    // ตรวจสอบว่าผู้ใช้กดยืนยันหรือไม่
    if (result.isConfirmed) {
        const success = await deleteRecordFromApi(recordId);
        
        if (success) {
            // แสดง Toast เมื่อลบสำเร็จ
            $swal({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 3000
            });
            
            // โหลดข้อมูลใหม่เพื่อให้ Pagination ทำงานถูกต้อง
            await fetchRecords(machineId, { page: pagination.value?.page || 1 });
        } else {
            // แสดง Toast เมื่อเกิดข้อผิดพลาด
            // error.value จะถูกกำหนดค่ามาจาก composable โดยอัตโนมัติ
            $swal({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: error.value || 'เกิดข้อผิดพลาดในการลบ',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
};

// ฟังก์ชันสำหรับ Empty State
const goToMeasurement = () => {
    // นำทางไปยังหน้าการตรวจวัด - ปรับ path ตามโครงสร้างของคุณ
    router.push(`/measurement?deviceId=${machineId}`);
}

const refreshData = async () => {
    if (machineId) {
        await fetchRecords(machineId);
    }
}

const goBack = () => {
    router.back();
}

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

const navigateToResult = (id) => {
    router.push(`/result/${id}`);
}

definePageMeta({
    layout: 'default',
    middleware: 'auth'
});
</script>