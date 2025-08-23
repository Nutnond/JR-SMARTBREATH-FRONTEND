<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          ยินดีต้อนรับ
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          เลือกเมนูด้านล่างเพื่อเริ่มใช้งานระบบติดตามและประเมินสุขภาพการหายใจของคุณ
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-12 max-w-4xl mx-auto">
        <Transition
          v-for="(item, index) in menuItems"
          :key="index"
          appear
          enter-active-class="transition-all duration-500 ease-out"
          :enter-from-class="`opacity-0 transform translate-y-8`"
          enter-to-class="opacity-100 transform translate-y-0"
          :style="{ 'transition-delay': `${index * 100}ms` }"
        >
          <button
            class="group bg-white/70 backdrop-blur-sm hover:bg-white border border-blue-100 hover:border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
            @click="handleMenuClick(item, index)"
          >
            <div class="flex items-start space-x-4">
              <div :class="`bg-gradient-to-r ${item.color} p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`">
                <Icon :name="item.icon" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-slate-600 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </button>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
// Nuxt 3 meta tags
useHead({
  title: 'HealthCare App - ระบบดูแลสุขภาพ',
  meta: [
    { name: 'description', content: 'แอปพลิเคชันดูแลสุขภาพอัจฉริยะ' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// Reactive data
const isMobileMenuOpen = ref(false)

// Menu items data with distinct colors
const menuItems = ref([
  {
    title: 'ตรวจสอบผลการวัด',
    description: 'ดูผลการตรวจวัดสุขภาพล่าสุด',
    icon: 'stash:search-results',
    color: 'from-sky-500 to-blue-600',
    route: '/health-check'
  },
  {
    title: 'จัดการอุปกรณ์',
    description: 'ตั้งค่าและจัดการอุปกรณ์วัดค่า',
    icon: 'material-symbols:device-hub',
    color: 'from-purple-500 to-violet-600',
    route: '/device-management'
  },
  {
    title: 'รายงานผล',
    description: 'สร้างและดาวน์โหลดรายงาน',
    icon: 'lucide:file-text',
    color: 'from-emerald-400 to-teal-600',
    route: '/reports'
  },
  {
    title: 'ประเมินผลโดย AI',
    description: 'รับคำแนะนำจาก AI ผู้เชี่ยวชาญ',
    icon: 'lucide:brain-circuit',
    color: 'from-amber-400 to-orange-600',
    route: '/ai-assessment'
  }
])

// Methods

const handleMenuClick = async (item, index) => {
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
    await new Promise(resolve => setTimeout(resolve, 300)); // wait for menu to close
  }
  console.log(`Navigating to: ${item.title}`)
  alert(`เปิดหน้า: ${item.title}`)
  // await navigateTo(item.route)
}

// Close mobile menu when clicking outside (logic improved for reliability)
onMounted(() => {
  // This watcher is simpler than event listeners for this case
  watch(isMobileMenuOpen, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
})

definePageMeta({
  layout: 'default',
  title: 'JR SMARTBREATH',
  middleware:'auth',
  meta: [
    { name: 'description', content: 'แอปพลิเคชันดูแลสุขภาพอัจฉริยะ' },
    { name: 'keywords', content: 'healthcare, health, fitness, AI, reports, device management' }
  ]
})
</script>