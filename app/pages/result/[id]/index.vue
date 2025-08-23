<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div v-if="loading" class="text-center py-20">
        <p class="text-gray-500">กำลังโหลดข้อมูลผลการทดสอบ...</p>
        </div>
      
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 font-semibold">เกิดข้อผิดพลาด: {{ error }}</p>
        <button @click="goBack" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">กลับไปหน้าก่อนหน้า</button>
      </div>

      <div v-else-if="resultData">
        
        <div class="mb-4">
          <button @click="goBack"
            class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            ย้อนกลับ
          </button>
        </div>
        
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">ผลการทดสอบสมรรถภาพปอด</h1>
              <p class="text-gray-600">การวิเคราะห์ผลการทดสอบการทำงานของปอดอย่างละเอียด</p>
            </div>
            <button
              class="flex items-center justify-center gap-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>ดาวน์โหลด PDF</span>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">รหัสการทดสอบ</p>
                <p class="font-mono text-sm text-gray-800">{{ resultData.id.substring(0, 8) }}...</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">วันที่วัดผล</p>
                <p class="text-sm text-gray-800">{{ formatDateTime(resultData.measuredAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">อุปกรณ์</p>
                <p class="text-sm text-gray-800">{{ resultData.machine.deviceName }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">SpO2</p>
                <p class="text-3xl font-bold text-red-600">{{ resultData.spo2 }}%</p>
                <p class="text-sm text-green-600 mt-1">{{ getSpO2Status(resultData.spo2) }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">FEV1</p>
                <p class="text-3xl font-bold text-blue-600">{{ resultData.fev1 }} ล.</p>
                <p class="text-sm text-gray-600 mt-1">ปริมาตรอากาศที่หายใจออกใน 1 วินาที</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">FVC</p>
                <p class="text-3xl font-bold text-green-600">{{ resultData.fvc }} ล.</p>
                <p class="text-sm text-gray-600 mt-1">ปริมาตรอากาศที่หายใจออกเต็มที่</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path></svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">PEF</p>
                <p class="text-3xl font-bold text-purple-600">{{ resultData.pef }} ล./วินาที</p>
                <p class="text-sm text-gray-600 mt-1">อัตราการไหลของอากาศสูงสุด</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">พารามิเตอร์สมรรถภาพปอด</h3>
            <div class="h-80">
              <canvas ref="lungFunctionChart"></canvas>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">ความอิ่มตัวของออกซิเจนในเลือด (SpO2)</h3>
            <div class="h-80 flex items-center justify-center">
              <div class="relative w-64 h-64">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"></circle>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (resultData.spo2 / 100) * circumference"
                    class="transition-all duration-1000 ease-out"></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900">{{ resultData.spo2 }}%</div>
                    <div class="text-sm text-gray-500">ระดับ SpO2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">การวิเคราะห์อัตราส่วน FEV1/FVC</h3>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <div class="h-64">
                <canvas ref="ratioChart"></canvas>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-semibold text-blue-900 mb-2">อัตราส่วนปัจจุบัน</h4>
                <p class="text-2xl font-bold text-blue-600">{{ resultData.fev1Fvc }}</p>
                <p class="text-sm text-blue-700 mt-1">{{ getRatioStatus(parseFloat(resultData.fev1Fvc)) }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">ค่าอ้างอิง</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• ปกติ: > 0.75</li>
                  <li>• เล็กน้อย: 0.60 - 0.75</li>
                  <li>• ปานกลาง: 0.45 - 0.60</li>
                  <li>• รุนแรง: < 0.45</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 class="text-xl font-semibold mb-4">คำแนะนำและขั้นตอนถัดไป</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2">จากผลการทดสอบของคุณ:</h4>
              <ul class="space-y-2">
                <li v-for="recommendation in getRecommendations()" :key="recommendation"
                  class="flex items-start space-x-2">
                  <svg class="w-5 h-5 mt-0.5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span class="text-sm">{{ recommendation }}</span>
                </li>
              </ul>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecordApi } from '~/composable/record/get-record';
const router = useRouter();
const route = useRoute();

const { 
  record: resultData, 
  loading, 
  error, 
  fetchRecordById 
} = useRecordApi();

const goBack = () => {
  router.back();
}

const lungFunctionChart = ref(null);
const ratioChart = ref(null);

const circumference = 2 * Math.PI * 45;

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const getSpO2Status = (spo2) => {
  if (spo2 >= 95) return 'ปกติ';
  if (spo2 >= 90) return 'ภาวะออกซิเจนในเลือดต่ำเล็กน้อย';
  if (spo2 >= 85) return 'ภาวะออกซิเจนในเลือดต่ำปานกลาง';
  return 'ภาวะออกซิเจนในเลือดต่ำรุนแรง';
}

const getRatioStatus = (ratio) => {
  if (ratio > 0.75) return 'สมรรถภาพปอดปกติ';
  if (ratio >= 0.60) return 'การอุดกั้นเล็กน้อย';
  if (ratio >= 0.45) return 'การอุดกั้นปานกลาง';
  return 'การอุดกั้นรุนแรง';
}

const getRecommendations = () => {
  if (!resultData.value) return [];
  
  const recommendations = [];
  const spo2 = resultData.value.spo2;
  const ratio = parseFloat(resultData.value.fev1Fvc);

  if (spo2 >= 95) {
    recommendations.push('ระดับความอิ่มตัวของออกซิเจนของคุณอยู่ในเกณฑ์ปกติ');
  } else {
    recommendations.push('ควรปรึกษาแพทย์เพื่อพิจารณาการบำบัดด้วยออกซิเจน');
  }

  if (ratio > 0.75) {
    recommendations.push('รักษาสุขภาพทางเดินหายใจตามแนวทางปฏิบัติปัจจุบัน');
    recommendations.push('ออกกำลังกายอย่างสม่ำเสมอต่อไป');
  } else {
    recommendations.push('ควรปรึกษาอายุรแพทย์โรคระบบการหายใจเพื่อประเมินเพิ่มเติม');
    recommendations.push('พิจารณาเข้าร่วมโปรแกรมฟื้นฟูสมรรถภาพปอด');
  }

  recommendations.push('หลีกเลี่ยงการสูบบุหรี่และการสัมผัสควันบุหรี่มือสอง');
  recommendations.push('ควรติดตามผลในอีก 6-12 เดือน');

  return recommendations;
}

const initCharts = async () => {
  if (!resultData.value) return;

  await nextTick();
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);

  if (window.myLungChart) window.myLungChart.destroy();
  if (window.myRatioChart) window.myRatioChart.destroy();

  if (lungFunctionChart.value) {
    window.myLungChart = new Chart(lungFunctionChart.value, {
      type: 'bar',
      data: {
        labels: ['FEV1 (ลิตร)', 'FVC (ลิตร)', 'PEF (ลิตร/วินาที)', 'อัตราส่วน FEV1/FVC'],
        datasets: [{
          label: 'ค่าของคุณ',
          data: [
            parseFloat(resultData.value.fev1),
            parseFloat(resultData.value.fvc),
            parseFloat(resultData.value.pef),
            parseFloat(resultData.value.fev1Fvc)
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(245, 101, 101, 0.8)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(139, 92, 246)',
            'rgb(245, 101, 101)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  if (ratioChart.value) {
    window.myRatioChart = new Chart(ratioChart.value, {
      type: 'line',
      data: {
        labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.'],
        datasets: [{
          label: 'อัตราส่วน FEV1/FVC',
          data: [0.82, 0.85, 0.83, 0.86, 0.84, 0.87, 0.85, parseFloat(resultData.value.fev1Fvc)],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'rgb(255, 255, 255)',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: { beginAtZero: false, min: 0.4, max: 1.0, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

onMounted(async () => {
  const recordId = route.params.id;
  if (recordId) {
    await fetchRecordById(recordId);
    if (resultData.value) {
      initCharts();
    }
  } else {
    error.value = "ไม่พบรหัสการทดสอบใน URL";
  }
});

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});
</script>