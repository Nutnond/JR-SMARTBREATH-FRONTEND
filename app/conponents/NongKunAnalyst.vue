<template>
  <div class="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-blue-600 mb-2">🩺 วิเคราะห์สุขภาพกับน้องขุน</h1>
      <p class="text-gray-600">ระบบวิเคราะห์สุขภาพด้วย AI เพื่อให้คำแนะนำเบื้องต้น</p>
    </div>

    <div v-if="currentStep === 1" class="space-y-6">
      <div class="bg-blue-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">เลือกประเภทผู้ใช้</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button @click="selectUserType('owner')"
            class="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <div class="text-center">
              <div class="text-4xl mb-2">👤</div>
              <div class="font-semibold text-gray-800">เจ้าของบัญชี</div>
              <div class="text-sm text-gray-600">ใช้ข้อมูลจากโปรไฟล์</div>
            </div>
          </button>

          <button @click="selectUserType('other')"
            class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <div class="text-center">
              <div class="text-4xl mb-2">👥</div>
              <div class="font-semibold text-gray-800">คนอื่น</div>
              <div class="text-sm text-gray-600">กรอกข้อมูลใหม่</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="currentStep === 2 && userType === 'other'" class="space-y-6">
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">กรอกข้อมูล</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
            <input v-model="otherUserData.name" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อ" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">อายุ (ปี)</label>
            <input v-model.number="otherUserData.age" type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกอายุ" min="1" max="120" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
            <select v-model="otherUserData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">น้ำหนัก (กก.)</label>
            <input v-model.number="otherUserData.weight" type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกน้ำหนัก" min="1" max="500" step="0.1" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">ส่วนสูง (ซม.)</label>
            <input v-model.number="otherUserData.height" type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกส่วนสูง" min="50" max="250" />
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="goBack"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            ย้อนกลับ
          </button>
          <button @click="analyzeSymptoms" :disabled="!isUserDataValid || isAnalyzing"
            class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            <span v-if="isAnalyzing">กำลังวิเคราะห์...</span>
            <span v-else>วิเคราะห์</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="currentStep === 2 && userType === 'owner'" class="space-y-6">
      <div class="bg-blue-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">ข้อมูลของคุณ</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-3 rounded border">
            <div class="text-sm text-gray-600">ชื่อ</div>
            <div class="font-semibold">{{ ownerData.name || 'ไม่ระบุ' }}</div>
          </div>
          <div class="bg-white p-3 rounded border">
            <div class="text-sm text-gray-600">อายุ</div>
            <div class="font-semibold">{{ ownerData.age ?? 'ไม่ระบุ' }} <template v-if="ownerData.age">ปี</template>
            </div>
          </div>
          <div class="bg-white p-3 rounded border">
            <div class="text-sm text-gray-600">เพศ</div>
            <div class="font-semibold">{{ getGenderText(ownerData.gender) }}</div>
          </div>
          <div class="bg-white p-3 rounded border">
            <div class="text-sm text-gray-600">น้ำหนัก</div>
            <div class="font-semibold">{{ ownerData.weight ?? 'ไม่ระบุ' }} <template
                v-if="ownerData.weight">กก.</template></div>
          </div>
          <div class="bg-white p-3 rounded border md:col-span-2">
            <div class="text-sm text-gray-600">ส่วนสูง</div>
            <div class="font-semibold">{{ ownerData.height ?? 'ไม่ระบุ' }} <template
                v-if="ownerData.height">ซม.</template></div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="goBack"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            ย้อนกลับ
          </button>
          <button @click="analyzeSymptoms" :disabled="isAnalyzing"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            <span v-if="isAnalyzing">กำลังวิเคราะห์...</span>
            <span v-else>วิเคราะห์</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="currentStep === 4 && (isAnalyzing || analysisResult)" class="space-y-6">
      <div class="relative bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-md border border-purple-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            🤖 ผลการวิเคราะห์จากน้องขุน
          </h2>
          <div class="flex items-center gap-2">
            <button v-if="isAnalyzing" @click="resetAnalysis"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg">
              ยกเลิก
            </button>
          </div>
        </div>

        <!-- Premium Loading State -->
        <div v-if="isAnalyzing" class="relative">
          <!-- Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 rounded-xl opacity-50 animate-pulse"></div>
          
          <!-- Main Loading Container -->
          <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-purple-200 shadow-lg">
            <!-- AI Brain Animation -->
            <div class="flex flex-col items-center justify-center space-y-6">
              <div class="relative">
                <!-- Outer spinning ring -->
                <div class="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin">
                  <div class="absolute top-2 left-2 w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <div class="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-300"></div>
                  <div class="absolute bottom-2 left-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-500"></div>
                  <div class="absolute bottom-2 right-2 w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-700"></div>
                </div>
                
                <!-- Inner AI brain -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-3xl animate-bounce">🧠</div>
                </div>
              </div>
              
              <!-- Status Text -->
              <div class="text-center space-y-3">
                <h3 class="text-xl font-bold text-purple-800">น้องขุนกำลังวิเคราะห์ข้อมูลของคุณ</h3>
                
                <!-- Time Indicator -->
                <div class="flex items-center justify-center space-x-2 text-sm text-purple-500">
                  <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>โดยประมาณ 1-5 นาที</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Container -->
        <div v-if="!isAnalyzing && analysisResult" 
             ref="resultBox" 
             class="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-l-4 border-purple-500 shadow-lg max-h-[60vh] overflow-auto">
          <div class="prose max-w-none" v-html="renderedAnalysis"></div>
        </div>

        <!-- Warning Box -->
        <div v-if="!isAnalyzing && analysisResult" 
             class="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-xl mt-6 shadow-sm">
          <div class="flex">
            <div class="text-red-600 mr-3 text-lg">⚠️</div>
            <div class="text-sm text-red-800">
              <strong>คำเตือน:</strong> ข้อมูลนี้เป็นเพียงการวิเคราะห์เบื้องต้นเท่านั้น
              ไม่สามารถใช้แทนการตรวจวินิจฉัยของแพทย์ได้ หากมีข้อสงสัย ควรปรึกษาแพทย์
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-6">
          <button @click="resetAnalysis"
            class="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg">
            วิเคราะห์ใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ต้องติดตั้ง: npm i marked dompurify
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// 👉 ถ้าคุณใช้ Pinia/Store โปรเจคเดิม: เปลี่ยน path ตามจริง
import { useUserStore } from '#imports'

/** =========================
 * Config/Env
 * ========================= */
const config = useRuntimeConfig();
const AGENT_URL = config.public.AGENT_API_URL || 'http://127.0.0.1:8000/';
const API_URL = (AGENT_URL) + 'agent/analyze'
const props = defineProps({
  recordId: {
    type: String,
    required: true,
  }
});

/** =========================
 * State
 * ========================= */
const currentStep = ref(1)
const userType = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref('')
const autoScroll = ref(true)
const resultBox = ref(null)

// Loading animation states
const currentStepIndex = ref(0)

const userStore = useUserStore()

const ownerData = ref({
  name: '',
  age: undefined,
  gender: undefined,
  weight: undefined,
  height: undefined
})

const otherUserData = ref({
  name: '',
  age: null,
  gender: '',
  weight: null,
  height: null
})

/** =========================
 * Loading Animation
 * ========================= */
let loadingInterval = null

function startLoadingAnimation() {
  currentStepIndex.value = 0
}

function stopLoadingAnimation() {
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
  currentStepIndex.value = 0
}

/** =========================
 * Hydrate owner from store
 * ========================= */
function hydrateOwnerFromStore() {
  const p = userStore || {}
  const fullName = [p.firstname, p.lastname].filter(Boolean).join(' ').trim() || userStore?.username || ''
  ownerData.value = {
    name: fullName || 'ไม่ระบุ',
    age: p.age,
    gender: p.gender,
    weight: p.weight,
    height: p.height
  }
}

/** =========================
 * Computed
 * ========================= */
const isUserDataValid = computed(() => {
  const d = otherUserData.value
  return !!(d.name && d.age && d.gender && d.weight && d.height)
})
const currentUserData = computed(() => (userType.value === 'owner' ? ownerData.value : otherUserData.value))

/** =========================
 * Navigation
 * ========================= */
const selectUserType = (type) => {
  userType.value = type
  currentStep.value = 2
}
const goBack = () => {
  if (currentStep.value === 4) {
    currentStep.value = 2
    return
  }
  if (currentStep.value > 1) currentStep.value--
}
const resetAnalysis = () => {
  stopStreaming()
  stopLoadingAnimation()
  currentStep.value = 1
  userType.value = ''
  analysisResult.value = ''
  otherUserData.value = { name: '', age: null, gender: '', weight: null, height: null }
  hydrateOwnerFromStore()
}

/** =========================
 * Utils
 * ========================= */
const getGenderText = (gender) => {
  if (!gender) {
    return 'ไม่ระบุ';
  }
  const map = { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' };
  return map[gender.toLowerCase()] || 'ไม่ระบุ';
}

function mdToSafeHtml(md) {
  const html = marked(md || '', { gfm: true, breaks: true })
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}
const renderedAnalysis = computed(() => mdToSafeHtml(analysisResult.value))

/** =========================
 * Token helpers
 * ========================= */
function readCookie(name) {
  const m = document.cookie.match(new RegExp('(^|; )' + encodeURIComponent(name) + '=([^;]*)'))
  return m ? decodeURIComponent(m[2]) : ''
}

function getAccessToken() {
  const s = sessionStorage.getItem('accessToken')
  if (s) return s
  if (userStore?.accessToken) return userStore.accessToken
  const c = readCookie('AccessToken')
  if (c) return c
  return ''
}

/** =========================
 * Streaming helpers
 * ========================= */
const decoder = new TextDecoder('utf-8', { fatal: false })
let pendingText = ''
let rafScheduled = false

function scheduleFlush() {
  if (rafScheduled) return
  rafScheduled = true
  requestAnimationFrame(async () => {
    if (pendingText) {
      analysisResult.value += pendingText
      pendingText = ''
      await nextTick()
      if (autoScroll.value && resultBox.value) {
        resultBox.value.scrollTop = resultBox.value.scrollHeight
      }
    }
    rafScheduled = false
  })
}

function normalizeChunk(raw) {
  let text = raw.replace(/^\uFEFF/, '')
  if (text.includes('data:')) {
    const lines = text.split(/\r?\n/).filter(Boolean)
    const payloads = []
    for (const ln of lines) {
      if (ln.startsWith('data:')) payloads.push(ln.slice(5).trimStart())
    }
    text = payloads.join('\n')
  }
  return text
}

async function streamToResult(readable) {
  const reader = readable.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      const clean = normalizeChunk(chunk)
      if (!clean) continue
      pendingText += clean
      scheduleFlush()
    }
    const final = decoder.decode()
    if (final) {
      pendingText += normalizeChunk(final)
      scheduleFlush()
    }
  } finally {
    scheduleFlush()
  }
}

/** =========================
 * Abort/Timeout
 * ========================= */
let controller = null
let timeoutId = null
const STREAM_TIMEOUT_MS = 120000

function startTimeout() {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    stopStreaming()
    friendlyError('หมดเวลาเชื่อมต่อ (timeout) กรุณาลองใหม่อีกครั้ง')
  }, STREAM_TIMEOUT_MS)
}

function clearAllTimers() {
  clearTimeout(timeoutId)
  timeoutId = null
}

function stopStreaming() {
  clearAllTimers()
  stopLoadingAnimation()
  if (controller) {
    controller.abort()
    controller = null
  }
  isAnalyzing.value = false
}

function friendlyError(msg) {
  const banner =
    `เกิดข้อขัดข้องในการเชื่อมต่อกับเซิร์ฟเวอร์ AI ของเรา
----------------------------------------
${msg}
หากปัญหายังคงอยู่ โปรดติดต่อผู้ดูแลระบบหรือทดลองในภายหลัง

`
  analysisResult.value += (analysisResult.value.endsWith('\n') ? '' : '\n') + banner
}

/** =========================
 * Actions
 * ========================= */
const analyzeSymptoms = async () => {
  isAnalyzing.value = true
  analysisResult.value = ''
  currentStep.value = 4
  startLoadingAnimation()

  const userData = currentUserData.value
  const prompt =
    `ช่วยวิเคราะห์สุขภาพทีปอดและความเสี่ยงด้านสุขภาพของผู้ใช้ตามข้อมูลนี้:` +
    `ชื่อ: ${userData.name || 'ไม่ระบุ'}, อายุ: ${userData.age ?? 'ไม่ระบุ'} ปี, เพศ: ${getGenderText(userData.gender)}, ` +
    `น้ำหนัก: ${userData.weight ?? 'ไม่ระบุ'} กก., ส่วนสูง: ${userData.height ?? 'ไม่ระบุ'} ซม. ` + `โดยใช้ record id = ${props.recordId}`

  console.log(prompt);

  const token = getAccessToken()
  if (!token) {
    isAnalyzing.value = false
    stopLoadingAnimation()
    friendlyError('ไม่พบโทเคนสำหรับยืนยันตัวตน (No Token Found)')
    return
  }

  try {
    controller = new AbortController()
    startTimeout()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    })

    if (!response.ok) {
      stopStreaming()
      friendlyError(`การเชื่อมต่อล้มเหลว (HTTP ${response.status})`)
      return
    }
    if (!response.body) {
      stopStreaming()
      friendlyError('ไม่พบเนื้อหาสำหรับสตรีมจากเซิร์ฟเวอร์')
      return
    }

    await streamToResult(response.body)
  } catch (err) {
    if (err?.name === 'AbortError') {
      // User aborted, handled by resetAnalysis/stopStreaming
    } else {
      friendlyError(`ข้อผิดพลาดเครือข่าย: ${(err && err.message) || 'ไม่ทราบสาเหตุ'}`)
    }
  } finally {
    stopStreaming()
  }
}

/** =========================
 * Lifecycle
 * ========================= */
onMounted(() => {
  hydrateOwnerFromStore()
})
onBeforeUnmount(() => {
  stopStreaming()
})
</script>

<style scoped>
.prose {
  line-height: 1.7;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

/* Gradient animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}
</style>