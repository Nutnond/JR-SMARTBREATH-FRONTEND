<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button @click="goBack"
                class="flex items-center space-x-2 px-4 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>กลับ</span>
            </button>
            <div class="mt-4 flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Health Records</h1>
                    <p class="mt-2 text-gray-600">รายการข้อมูลการตรวจวัดสุขภาพทั้งหมด ({{ pagination.totalCount }} รายการ)</p>
                </div>
            </div>

            <div v-if="isLoading" class="text-center py-10">
                <p class="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>

            <div v-else>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="record in records" :key="record.id"
                        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs text-gray-500">
                                    {{ formatDateTime(record.timestamp) }}
                                </span>
                            </div>

                            <div class="flex items-center space-x-2 mb-4">
                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <span class="text-sm text-gray-700">{{ record.machine_name }}</span>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mb-6">
                                <div class="bg-red-50 p-3 rounded-lg">
                                    <div class="flex items-center space-x-2">
                                        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                            </path>
                                        </svg>
                                        <span class="text-xs font-medium text-red-700">SpO2</span>
                                    </div>
                                    <p class="text-lg font-bold text-red-900 mt-1">{{ record.spo2 }}%</p>
                                </div>

                                <div class="bg-blue-50 p-3 rounded-lg">
                                    <div class="flex items-center space-x-2">
                                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        <span class="text-xs font-medium text-blue-700">FEV1</span>
                                    </div>
                                    <p class="text-lg font-bold text-blue-900 mt-1">{{ record.fev1 }}L</p>
                                </div>

                                <div class="bg-green-50 p-3 rounded-lg">
                                    <div class="flex items-center space-x-2">
                                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3z">
                                            </path>
                                        </svg>
                                        <span class="text-xs font-medium text-green-700">FVC</span>
                                    </div>
                                    <p class="text-lg font-bold text-green-900 mt-1">{{ record.fvc }}L</p>
                                </div>

                                <div class="bg-purple-50 p-3 rounded-lg">
                                    <div class="flex items-center space-x-2">
                                        <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                        <span class="text-xs font-medium text-purple-700">PEF</span>
                                    </div>
                                    <p class="text-lg font-bold text-purple-900 mt-1">{{ record.pef }}L/min</p>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-3 rounded-lg mb-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">FEV1/FVC Ratio</span>
                                    <span class="text-sm font-bold text-gray-900">{{ (parseFloat(record.fev1_fvc) *
                                        100).toFixed(1) }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        :style="{ width: (parseFloat(record.fev1_fvc) * 100) + '%' }"></div>
                                </div>
                            </div>

                            <div class="flex space-x-2">
                                <button @click="navigateToResult(record.id)"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                        </path>
                                    </svg>
                                    <span>ดูรายละเอียด</span>
                                </button>
                                <button @click="deleteRecord(record.id)"
                                    class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!isLoading && pagination.totalPages > 1"
                    class="mt-8 flex justify-center items-center space-x-4">
                    <button @click="changePage(pagination.page - 1)" :disabled="!pagination.hasPrev"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        ก่อนหน้า
                    </button>
                    <span class="text-sm text-gray-700">
                        หน้า {{ pagination.page }} จาก {{ pagination.totalPages }}
                    </span>
                    <button @click="changePage(pagination.page + 1)" :disabled="!pagination.hasNext"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        ถัดไป
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { de } from '@nuxt/ui/runtime/locale/index.js';
import { ref, onMounted } from 'vue'

const router = useRouter()

// Reactive state for data and pagination
const records = ref([]);
const pagination = ref({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
});
const isLoading = ref(true);

// --- SIMULATED API CALL ---
const fetchRecords = async (page = 1) => {
    isLoading.value = true;
    console.log(`Fetching data for page ${page}...`);

    // In a real application, you would make an API call here.
    // e.g., const response = await fetch(`/api/records?page=${page}`);
    // const data = await response.json();

    // Simulating a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Using the provided sample data structure as a mock response
    const mockApiResponse = {
        page: page,
        pageSize: 10,
        totalPages: 3,
        totalCount: 25,
        hasNext: page < 3,
        hasPrev: page > 1,
        items: Array.from({ length: 10 }, (_, i) => ({
            id: `id-${page}-${i}`,
            machineId: "2cdde873-07f6-4fc1-86f4-51d27333580b",
            spo2: 97 + Math.floor(Math.random() * 3), // 97-99
            fev1: (3.8 + Math.random() * 0.4).toFixed(2),
            fvc: (4.5 + Math.random() * 0.4).toFixed(2),
            pef: (8.4 + Math.random() * 0.4).toFixed(2),
            fev1_fvc: (0.84 + Math.random() * 0.02).toFixed(4),
            timestamp: new Date().toISOString()
        }))
    };
    
    // Since device_name is not in the new data, we simulate fetching it.
    // In a real app, you might have a map of machineId -> machineName or fetch it separately.
    const machines = { "2cdde873-07f6-4fc1-86f4-51d27333580b": "My Smart Device 01" };
    mockApiResponse.items.forEach(item => {
        item.machine_name = machines[item.machineId] || 'Unknown Device';
    });


    // Update state with fetched data
    records.value = mockApiResponse.items;
    pagination.value = {
        page: mockApiResponse.page,
        pageSize: mockApiResponse.pageSize,
        totalPages: mockApiResponse.totalPages,
        totalCount: mockApiResponse.totalCount,
        hasNext: mockApiResponse.hasNext,
        hasPrev: mockApiResponse.hasPrev,
    };

    isLoading.value = false;
};

// Fetch initial data when component is mounted
onMounted(() => {
    fetchRecords(1);
});

const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pagination.value.totalPages && !isLoading.value) {
        fetchRecords(newPage);
    }
}

const goBack = () => {
    router.back();
}

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString)
    return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const navigateToResult = (id) => {
    navigateTo(`/result/${id}`)
}

const deleteRecord = async (recordId) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
        console.log(`Deleting record ${recordId}...`);
        // --- REAL-WORLD IMPLEMENTATION ---
        // 1. Call API to delete the record from the database
        //    await fetch(`/api/records/${recordId}`, { method: 'DELETE' });
        
        // 2. Refetch the data for the current page to reflect the change
        //    await fetchRecords(pagination.value.page);

        // --- SIMULATION FOR DEMO ---
        // For this example, we'll just filter it out from the local array.
        records.value = records.value.filter(record => record.id !== recordId);
        pagination.value.totalCount--; // Decrement total count for display
        
        console.log(`Record ${recordId} deleted locally.`);
    }
}

// SEO Meta
definePageMeta({
    layout: 'default',
    middleware:'auth'
});
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bg-white {
    animation: fadeIn 0.3s ease-out;
}
</style>