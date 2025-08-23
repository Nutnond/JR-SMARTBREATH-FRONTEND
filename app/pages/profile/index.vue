
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile Header -->
       <button @click="goBack"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          ย้อนกลับ
        </button>
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <!-- Cover Image -->
        <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div class="absolute inset-0 bg-blue-300 bg-opacity-20"></div>
        </div>
        
        <div class="relative px-6 pb-6">
          <!-- Profile Image -->
          <div class="absolute -top-16 left-6">
            <div class="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
              <div class="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span class="text-white text-3xl font-bold">{{ getInitials() }}</span>
              </div>
            </div>
          </div>
          
          <!-- Profile Info -->
          <div class="pt-20">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  {{ userData.firstName }} {{ userData.lastName }}
                </h1>
                <p class="text-lg text-gray-600 mt-1">@{{ userData.username }}</p>
                <p class="text-gray-500 mt-1">{{ userData.email }}</p>
              </div>
              
              <div class="mt-4 md:mt-0">
                <!-- <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                  Edit Profile
                </button> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Personal Information
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">First Name</label>
                <p class="text-lg text-gray-900 mt-1">{{ userData.firstName }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Name</label>
                <p class="text-lg text-gray-900 mt-1">{{ userData.lastName }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</label>
                <p class="text-lg text-gray-900 mt-1">@{{ userData.username }}</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p class="text-lg text-gray-900 mt-1">{{ userData.email }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                <p class="text-lg text-gray-900 mt-1">{{ userData.gender }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</label>
                <p class="text-sm text-gray-600 mt-1 font-mono">{{ userData.id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Physical Stats Card -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Physical Stats
            </h2>
            
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-blue-700 font-medium">Height</span>
                  <span class="text-2xl font-bold text-blue-900">{{ userData.height }} cm</span>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-green-700 font-medium">Weight</span>
                  <span class="text-2xl font-bold text-green-900">{{ userData.weight }} kg</span>
                </div>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-purple-700 font-medium">BMI</span>
                  <span class="text-2xl font-bold text-purple-900">{{ bmi }}</span>
                </div>
                <div class="text-sm text-purple-600 mt-1">{{ bmiCategory }}</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore} from '~/stores/userStore'
// Mock data

const userStore = useUserStore()
const userData = ref(userStore.user)

// Computed properties
const getInitials = () => {
  return `${userData.value.firstName.charAt(0)}${userData.value.lastName.charAt(0)}`.toUpperCase()
}

const bmi = computed(() => {
  const weight = parseFloat(userData.value.weight)
  const height = parseFloat(userData.value.height) / 100 // Convert cm to m
  const bmiValue = weight / (height * height)
  return bmiValue.toFixed(1)
})

const bmiCategory = computed(() => {
  const bmiValue = parseFloat(bmi.value)
  if (bmiValue < 18.5) return 'Underweight'
  if (bmiValue < 25) return 'Normal weight'
  if (bmiValue < 30) return 'Overweight'
  return 'Obese'
})

const goBack = () => {
    navigateTo('/menu')
}



definePageMeta({
  layout: 'default',
  title: 'JR SMARTBREATH',
  middleware:'auth',
  meta: [
    { name: 'description', content: 'User profile page for JR SMARTBREATH application.' },
    { name: 'keywords', content: 'profile, user, JR SMARTBREATH, health, fitness' }
  ]
})
</script>
