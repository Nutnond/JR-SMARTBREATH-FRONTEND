// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // application configuration 
  app: {
    head: {
      charset: 'utf-8',
      // viewport: 'width=device-width, initial-scale=1',
      title: 'SMARTBREATH',
      link: [{ rel: 'icon', type: 'image/png', href: '/icons/icon.png' }]
    },
    // baseURL: '/pl1',  // ตั้งค่า base path สำหรับแอป
    // buildAssetsDir: '/asset/'
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      BASE_API_URL:'',
      AGENT_API_URL:''
    } 
  },
  css: [ '~/assets/css/main.css'],
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/scripts',
    '@pinia/nuxt',
  ]
})