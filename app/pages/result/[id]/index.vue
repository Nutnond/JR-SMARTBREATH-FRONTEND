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
            <button @click="handleDownloadPdf"
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
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">รหัสการทดสอบ</p>
                <p class="font-mono text-sm text-gray-800">{{ resultData.id.substring(0, 8) }}...</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">วันที่วัดผล</p>
                <p class="text-sm text-gray-800">{{ formatDateTime(resultData.measuredAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                  </path>
                </svg>
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
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                  </path>
                </svg>
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
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                  </path>
                </svg>
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
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11">
                  </path>
                </svg>
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
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2z">
                  </path>
                </svg>
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

        <!-- ปรับปรุงส่วนการวิเคราะห์อัตราส่วน FEV1/FVC ให้แสดงเฉพาะค่าปัจจุบัน -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">การวิเคราะห์อัตราส่วน FEV1/FVC</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- แสดงผลอัตราส่วน FEV1/FVC ในรูปแบบกราฟวงกลม -->
            <div class="flex items-center justify-center">
              <div class="relative w-80 h-80">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <!-- วงกลมพื้นหลัง -->
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" stroke-width="10"></circle>
                  <!-- วงกลมแสดงค่า -->
                  <circle cx="50" cy="50" r="40" fill="none" :stroke="getRatioColor(parseFloat(resultData.fev1Fvc))"
                    stroke-width="10" stroke-linecap="round" :stroke-dasharray="251.33"
                    :stroke-dashoffset="251.33 - (parseFloat(resultData.fev1Fvc) * 251.33)"
                    class="transition-all duration-1000 ease-out"></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-4xl font-bold text-gray-900">{{ resultData.fev1Fvc }}</div>
                    <div class="text-lg font-medium text-gray-600 mt-2">FEV1/FVC อัตราส่วน</div>
                    <div :class="'text-sm font-semibold mt-2 ' + getRatioColorClass(parseFloat(resultData.fev1Fvc))">
                      {{ getRatioStatus(parseFloat(resultData.fev1Fvc)) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ข้อมูลค่าอ้างอิงและการแปลผล -->
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h4 class="font-bold text-blue-900 mb-4 text-lg">ผลการวิเคราะห์ปัจจุบัน</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-blue-800">FEV1:</span>
                    <span class="font-semibold text-blue-900">{{ resultData.fev1 }} ลิตร</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-800">FVC:</span>
                    <span class="font-semibold text-blue-900">{{ resultData.fvc }} ลิตร</span>
                  </div>
                  <div class="border-t border-blue-200 pt-3">
                    <div class="flex justify-between items-center">
                      <span class="text-blue-800 font-medium">อัตราส่วน:</span>
                      <span class="font-bold text-xl text-blue-900">{{ resultData.fev1Fvc }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h4 class="font-bold text-gray-900 mb-4 text-lg">ค่าอ้างอิงการแปลผล</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <span class="text-green-800 font-medium">ปกติ</span>
                    <span class="text-green-900 font-semibold">> 0.75</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                    <span class="text-yellow-800 font-medium">การอุดกั้นเล็กน้อย</span>
                    <span class="text-yellow-900 font-semibold">0.60 - 0.75</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <span class="text-orange-800 font-medium">การอุดกั้นปานกลาง</span>
                    <span class="text-orange-900 font-semibold">0.45 - 0.60</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                    <span class="text-red-800 font-medium">การอุดกั้นรุนแรง</span>
                    <span class="text-red-900 font-semibold">
                      < 0.45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 class="text-xl font-semibold mb-4">คำแนะนำและขั้นตอนถัดไป</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2">จากผลการทดสอบของคุณ:</h4>
              <ul class="space-y-2">
                <li v-for="recommendation in getRecommendations()" :key="recommendation"
                  class="flex items-start space-x-2">
                  <svg class="w-5 h-5 mt-0.5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm">{{ recommendation }}</span>
                </li>
              </ul>
            </div>
            <div>
            </div>
          </div>
        </div> -->
        <PulmonaryFunctionTable class="mt-8" />
        <NongKunAnalyst class="mt-5" :record-id="route.params.id" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { onMounted, nextTick, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecordApi } from '~/composable/record/get-record';
import NongKunAnalyst from '~/conponents/NongKunAnalyst.vue';
import PulmonaryFunctionTable from '~/conponents/PulmonaryFunctionTable.vue';
// สมมติว่านี่คือการนำเข้า useAuthStore
import { useUserStore } from '#imports';
const router = useRouter();
const route = useRoute();
const { $swal } = useNuxtApp();

const {
  record: resultData,
  loading,
  error,
  fetchRecordById,
  downloadReportPdf
} = useRecordApi();

// สมมติข้อมูลผู้ใช้ปัจจุบัน (ใช้แทนการเรียกจาก useAuthStore)
const userStore = useUserStore();

const CurrentUser = {
  name: userStore.fullName,
  age: userStore.age,
  gender: userStore.gender,
  height: userStore.height,
  weight: userStore.weight
}

const goBack = () => {
  router.back();
}

const lungFunctionChart = ref(null);
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

const getRatioColor = (ratio) => {
  if (ratio > 0.75) return '#10b981'; // เขียว - ปกติ
  if (ratio >= 0.60) return '#f59e0b'; // เหลือง - เล็กน้อย
  if (ratio >= 0.45) return '#f97316'; // ส้ม - ปานกลาง
  return '#ef4444'; // แดง - รุนแรง
}

const getRatioColorClass = (ratio) => {
  if (ratio > 0.75) return 'text-green-600';
  if (ratio >= 0.60) return 'text-yellow-600';
  if (ratio >= 0.45) return 'text-orange-600';
  return 'text-red-600';
}

const initCharts = async () => {
  if (!resultData.value) return;

  await nextTick();
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);

  if (window.myLungChart) window.myLungChart.destroy();

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
}

const handleDownloadPdf = async () => {
  const recordId = route.params.id;
  if (!recordId) return;

  // 1. แสดง Modal ให้เลือกผู้รับรายงาน - สไตล์ใหม่
  const { value: recipientType } = await $swal.fire({
    title: '<strong>📋 รายงานนี้สำหรับใคร?</strong>',
    html: `
      <div class="mt-4 space-y-4">
        <div class="flex flex-col gap-4">
          <label class="relative flex items-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
            <input type="radio" name="recipient" value="current" class="sr-only">
            <div class="flex items-center justify-center w-5 h-5 border-2 border-blue-500 rounded-full mr-4">
              <div class="w-3 h-3 bg-blue-500 rounded-full opacity-0 transition-opacity duration-200"></div>
            </div>
            <div class="flex-1 text-left">
              <div class="font-semibold text-gray-900">👤 ผู้ใช้งานปัจจุบัน</div>
              <div class="text-sm text-gray-500">ใช้ข้อมูลจากโปรไฟล์ของคุณ</div>
            </div>
          </label>
          
          <label class="relative flex items-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all duration-200">
            <input type="radio" name="recipient" value="other" class="sr-only">
            <div class="flex items-center justify-center w-5 h-5 border-2 border-green-500 rounded-full mr-4">
              <div class="w-3 h-3 bg-green-500 rounded-full opacity-0 transition-opacity duration-200"></div>
            </div>
            <div class="flex-1 text-left">
              <div class="font-semibold text-gray-900">👥 บุคคลอื่น</div>
              <div class="text-sm text-gray-500">กรอกข้อมูลใหม่สำหรับผู้รับรายงาน</div>
            </div>
          </label>
        </div>
      </div>
    `,
    width: '500px',
    showCancelButton: true,
    confirmButtonText: 'ถัดไป',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl',
      confirmButton: 'rounded-lg px-6 py-2 font-medium',
      cancelButton: 'rounded-lg px-6 py-2 font-medium'
    },
    didOpen: () => {
      // เพิ่ม event listeners สำหรับ custom radio buttons
      const radioInputs = document.querySelectorAll('input[name="recipient"]');
      const radioVisuals = document.querySelectorAll('.w-3.h-3');
      
      // ตั้งค่าเริ่มต้น
      radioInputs[0].checked = true;
      radioVisuals[0].classList.remove('opacity-0');
      
      radioInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
          radioVisuals.forEach(visual => visual.classList.add('opacity-0'));
          if (input.checked) {
            radioVisuals[index].classList.remove('opacity-0');
          }
        });
      });
    },
    preConfirm: () => {
      const selectedRadio = document.querySelector('input[name="recipient"]:checked');
      if (!selectedRadio) {
        $swal.showValidationMessage('กรุณาเลือกผู้รับรายงาน');
        return false;
      }
      return selectedRadio.value;
    }
  });

  if (!recipientType) return;

  let reportBody = {};
  let userData = {};
  let isCurrentUser = recipientType === 'current';

  if (isCurrentUser) {
    userData = CurrentUser;
  } else {
    // 2. Modal สำหรับกรอกข้อมูลบุคคลอื่น - ปรับปรุงใหม่
    const { value: formValues } = await $swal.fire({
      title: '<strong>📝 กรอกข้อมูลผู้รับรายงาน</strong>',
      html: `
        <div class="mt-6 space-y-5">
          <!-- ชื่อ -->
          <div class="text-left">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-user mr-2"></i>ชื่อ-นามสกุล
            </label>
            <input 
              id="patient-name" 
              type="text" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200" 
              placeholder="กรอกชื่อ-นามสกุล"
              maxlength="100"
            >
            <div class="text-xs text-red-500 mt-1 hidden" id="name-error">กรุณากรอกชื่อ-นามสกุล</div>
          </div>

          <!-- อายุ -->
          <div class="text-left">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-birthday-cake mr-2"></i>อายุ (ปี)
            </label>
            <input 
              id="patient-age" 
              type="number" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200" 
              placeholder="กรอกอายุ"
              min="1" 
              max="150"
            >
            <div class="text-xs text-red-500 mt-1 hidden" id="age-error">อายุต้องอยู่ระหว่าง 1-150 ปี</div>
          </div>

          <!-- เพศ -->
          <div class="text-left">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-venus-mars mr-2"></i>เพศ
            </label>
            <select 
              id="patient-gender" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
            >
              <option value="">เลือกเพศ</option>
              <option value="ชาย">👨 ชาย</option>
              <option value="หญิง">👩 หญิง</option>
            </select>
            <div class="text-xs text-red-500 mt-1 hidden" id="gender-error">กรุณาเลือกเพศ</div>
          </div>

          <!-- ส่วนสูงและน้ำหนัก -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-left">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-ruler-vertical mr-2"></i>ส่วนสูง (ซม.)
              </label>
              <input 
                id="patient-height" 
                type="number" 
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200" 
                placeholder="เช่น 165"
                min="50" 
                max="250"
              >
              <div class="text-xs text-red-500 mt-1 hidden" id="height-error">ส่วนสูงต้องอยู่ระหว่าง 50-250 ซม.</div>
            </div>
            
            <div class="text-left">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-weight mr-2"></i>น้ำหนัก (กก.)
              </label>
              <input 
                id="patient-weight" 
                type="number" 
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200" 
                placeholder="เช่น 60"
                min="10" 
                max="300"
              >
              <div class="text-xs text-red-500 mt-1 hidden" id="weight-error">น้ำหนักต้องอยู่ระหว่าง 10-300 กก.</div>
            </div>
          </div>
        </div>
      `,
      width: '600px',
      focusConfirm: false,
      confirmButtonText: 'สร้างรายงาน',
      cancelButtonText: 'ย้อนกลับ',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-xl',
        htmlContainer: 'text-left',
        confirmButton: 'rounded-lg px-6 py-2 font-medium',
        cancelButton: 'rounded-lg px-6 py-2 font-medium'
      },
      didOpen: () => {
        // เพิ่ม Font Awesome สำหรับไอคอน
        if (!document.querySelector('link[href*="font-awesome"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
          document.head.appendChild(link);
        }

        // เพิ่ม real-time validation
        const inputs = ['name', 'age', 'gender', 'height', 'weight'];
        inputs.forEach(inputName => {
          const element = document.getElementById(`patient-${inputName}`);
          if (element) {
            element.addEventListener('input', () => validateField(inputName));
            element.addEventListener('blur', () => validateField(inputName));
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById('patient-name').value.trim();
        const age = parseInt(document.getElementById('patient-age').value);
        const gender = document.getElementById('patient-gender').value;
        const height = parseInt(document.getElementById('patient-height').value);
        const weight = parseInt(document.getElementById('patient-weight').value);

        let isValid = true;
        
        // Validate ชื่อ
        if (!name || name.length < 2) {
          showFieldError('name', 'กรุณากรอกชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)');
          isValid = false;
        }

        // Validate อายุ
        if (!age || age < 1 || age > 150) {
          showFieldError('age', 'อายุต้องอยู่ระหว่าง 1-150 ปี');
          isValid = false;
        }

        // Validate เพศ
        if (!gender) {
          showFieldError('gender', 'กรุณาเลือกเพศ');
          isValid = false;
        }

        // Validate ส่วนสูง
        if (!height || height < 50 || height > 250) {
          showFieldError('height', 'ส่วนสูงต้องอยู่ระหว่าง 50-250 ซม.');
          isValid = false;
        }

        // Validate น้ำหนัก
        if (!weight || weight < 10 || weight > 300) {
          showFieldError('weight', 'น้ำหนักต้องอยู่ระหว่าง 10-300 กก.');
          isValid = false;
        }

        // ตรวจสอบ BMI ว่าสมเหตุสมผลหรือไม่
        if (height && weight) {
          const bmi = weight / Math.pow(height / 100, 2);
          if (bmi < 10 || bmi > 60) {
            $swal.showValidationMessage('ค่า BMI ผิดปกติ กรุณาตรวจสอบส่วนสูงและน้ำหนักอีกครั้ง');
            isValid = false;
          }
        }

        if (!isValid) {
          return false;
        }

        return { name, age, gender, height, weight };
      }
    });

    if (!formValues) return;
    userData = formValues;
  }

  // Helper functions สำหรับ validation
  function validateField(fieldName) {
    const element = document.getElementById(`patient-${fieldName}`);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!element || !errorElement) return;

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        const name = element.value.trim();
        if (!name || name.length < 2) {
          isValid = false;
          errorMessage = 'กรุณากรอกชื่อ-นามสกุล (อย่างน้อย 2 ตัวอักษร)';
        }
        break;
      case 'age':
        const age = parseInt(element.value);
        if (!age || age < 1 || age > 150) {
          isValid = false;
          errorMessage = 'อายุต้องอยู่ระหว่าง 1-150 ปี';
        }
        break;
      case 'gender':
        if (!element.value) {
          isValid = false;
          errorMessage = 'กรุณาเลือกเพศ';
        }
        break;
      case 'height':
        const height = parseInt(element.value);
        if (!height || height < 50 || height > 250) {
          isValid = false;
          errorMessage = 'ส่วนสูงต้องอยู่ระหว่าง 50-250 ซม.';
        }
        break;
      case 'weight':
        const weight = parseInt(element.value);
        if (!weight || weight < 10 || weight > 300) {
          isValid = false;
          errorMessage = 'น้ำหนักต้องอยู่ระหว่าง 10-300 กก.';
        }
        break;
    }

    if (isValid) {
      element.classList.remove('border-red-500');
      element.classList.add('border-green-500');
      errorElement.classList.add('hidden');
    } else {
      element.classList.remove('border-green-500');
      element.classList.add('border-red-500');
      errorElement.textContent = errorMessage;
      errorElement.classList.remove('hidden');
    }

    return isValid;
  }

  function showFieldError(fieldName, message) {
    const element = document.getElementById(`patient-${fieldName}`);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (element && errorElement) {
      element.classList.add('border-red-500');
      element.classList.remove('border-green-500');
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  // 3. เตรียม Body สำหรับ API Call
  reportBody = {
    patientInfo: {
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
    },
    isCurrentUser: isCurrentUser
  };

  // 4. แสดง loading modal - สไตล์ใหม่
  $swal.fire({
    title: '<div class="flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>กำลังสร้างรายงาน...</div>',
    html: `
      <div class="mt-4">
        <div class="bg-blue-50 rounded-lg p-4 mb-4">
          <p class="text-blue-800 font-medium">📊 กำลังประมวลผลข้อมูล</p>
          <p class="text-blue-600 text-sm mt-1">ระบบกำลังจัดทำไฟล์ PDF สำหรับ <strong>${userData.name}</strong></p>
        </div>
        <div class="flex justify-center">
          <div class="animate-pulse flex space-x-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    `,
    allowOutsideClick: false,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-lg'
    }
  });

  try {
    const blob = await downloadReportPdf(recordId, reportBody);

    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lung-function-report-${userData.name}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Success modal - สไตล์ใหม่
      $swal.fire({
        icon: 'success',
        title: '<strong>🎉 ดาวน์โหลดสำเร็จ!</strong>',
        html: `
          <div class="mt-4 bg-green-50 rounded-lg p-4">
            <p class="text-green-800">รายงานสำหรับ <strong>${userData.name}</strong> พร้อมใช้งานแล้ว</p>
            <p class="text-green-600 text-sm mt-2">📄 ไฟล์ได้รับการบันทึกในโฟลเดอร์ดาวน์โหลดของคุณ</p>
          </div>
        `,
        confirmButtonText: 'เรียบร้อย',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });

    } else {
      throw new Error(error.value || 'ไม่สามารถดาวน์โหลดไฟล์ PDF ได้');
    }
  } catch (err) {
    console.error("Download error:", err);
    
    // Error modal - สไตล์ใหม่
    $swal.fire({
      icon: 'error',
      title: '<strong>⚠️ เกิดข้อผิดพลาด</strong>',
      html: `
        <div class="mt-4 bg-red-50 rounded-lg p-4">
          <p class="text-red-800 font-medium">ไม่สามารถสร้างรายงานได้</p>
          <p class="text-red-600 text-sm mt-2">กรุณาลองใหม่อีกครั้ง หรือติดต่อฝ่ายสนับสนุน</p>
          <div class="mt-3 text-xs text-red-500 font-mono bg-red-100 p-2 rounded">
            Error: ${err.message || 'Unknown error'}
          </div>
        </div>
      `,
      confirmButtonText: 'ลองใหม่',
      showCancelButton: true,
      cancelButtonText: 'ปิด',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'rounded-lg px-6 py-2 font-medium',
        cancelButton: 'rounded-lg px-6 py-2 font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleDownloadPdf(); // เรียกใช้ฟังก์ชันซ้ำ
      }
    });
  }
};


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