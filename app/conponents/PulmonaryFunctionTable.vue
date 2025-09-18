<template>
  <div class="pulmonary-function-table">
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">ตารางค่าเปรียบเทียบการทำงานของปอด<br/><span class="text-sm text-gray-400">อ้างอิงจาก สมาคมอุรเวชช์แห่งประเทศไทย</span></h2>
      
      <!-- Form Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
          <select 
            v-model="selectedGender" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">อายุ (ปี)</label>
          <select 
            v-model="selectedAge" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="age in availableAges" :key="age" :value="age">
              {{ age }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ส่วนสูง (cm)</label>
          <select 
            v-model="selectedHeight" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="height in availableHeights" :key="height" :value="height">
              {{ height }}
            </option>
          </select>
        </div>
      </div>

      <!-- Result Display -->
      <div v-if="currentValues" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">
          ค่าปกติสำหรับ {{ selectedGender === 'male' ? 'ชาย' : 'หญิง' }} 
          อายุ {{ selectedAge }} ปี ส่วนสูง {{ selectedHeight }} cm
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-sm text-blue-600 font-medium">FVC (Forced Vital Capacity)</div>
            <div class="text-2xl font-bold text-blue-800">{{ currentValues.FVC }}</div>
            <div class="text-xs text-blue-600">ลิตร</div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-sm text-green-600 font-medium">FEV1 (Forced Expiratory Volume)</div>
            <div class="text-2xl font-bold text-green-800">{{ currentValues.FEV1 }}</div>
            <div class="text-xs text-green-600">ลิตร</div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-sm text-purple-600 font-medium">PEF (Peak Expiratory Flow)</div>
            <div class="text-2xl font-bold text-purple-800">{{ currentValues.PEF }}</div>
            <div class="text-xs text-purple-600">ลิตร/นาที</div>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="overflow-x-auto">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">ตารางเปรียบเทียบตามช่วงอายุ</h3>
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                อายุ (ปี)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                FVC (ลิตร)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                FEV1 (ลิตร)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                PEF (ลิตร/นาที)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="age in availableAges" 
              :key="age"
              :class="{ 'bg-yellow-50': age == selectedAge }"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ age }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForAge('FVC', age) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForAge('FEV1', age) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForAge('PEF', age) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Height Comparison Table -->
      <div class="overflow-x-auto mt-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">ตารางเปรียบเทียบตามส่วนสูง (อายุ {{ selectedAge }} ปี)</h3>
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                ส่วนสูง (cm)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                FVC (ลิตร)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                FEV1 (ลิตร)
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                PEF (ลิตร/นาที)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="height in availableHeights" 
              :key="height"
              :class="{ 'bg-yellow-50': height == selectedHeight }"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ height }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForHeight('FVC', height) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForHeight('FEV1', height) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ getValueForHeight('PEF', height) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { pulmonaryData } from '~/data/pulmonaryData';

// Reactive variables
const selectedGender = ref('male')
const selectedAge = ref('25')
const selectedHeight = ref('170')

// Computed properties
const availableAges = computed(() => {
  return Object.keys(pulmonaryData.FVC[selectedGender.value]).sort((a, b) => parseInt(a) - parseInt(b))
})

const availableHeights = computed(() => {
  const ageData = pulmonaryData.FVC[selectedGender.value][selectedAge.value]
  return Object.keys(ageData).sort((a, b) => parseInt(a) - parseInt(b))
})

const currentValues = computed(() => {
  if (!pulmonaryData.FVC[selectedGender.value][selectedAge.value]) return null
  
  const height = selectedHeight.value.toString()
  return {
    FVC: pulmonaryData.FVC[selectedGender.value][selectedAge.value][height] || '-',
    FEV1: pulmonaryData.FEV1[selectedGender.value][selectedAge.value][height] || '-',
    PEF: pulmonaryData.PEF[selectedGender.value][selectedAge.value][height] || '-'
  }
})

// Methods
const getValueForAge = (type, age) => {
  const height = selectedHeight.value.toString()
  const ageData = pulmonaryData[type][selectedGender.value][age]
  return ageData && ageData[height] ? ageData[height] : '-'
}

const getValueForHeight = (type, height) => {
  const age = selectedAge.value.toString()
  const ageData = pulmonaryData[type][selectedGender.value][age]
  return ageData && ageData[height] ? ageData[height] : '-'
}
</script>