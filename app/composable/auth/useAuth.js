// composables/useAuth.js

import { useUserStore } from "~/stores/userStore";
import { ref } from 'vue';

/**
 * @typedef {object} LoginCredentials
 * @property {string} [username]
 * @property {string} [email]
 * @property {string} [password]
 */

export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);
  const userStore = useUserStore();
  const config = useRuntimeConfig();
  const API_URL = config.public.apiUrl || 'http://localhost:8080';

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: credentials,
      });

      if (response.token && response.user) {
        // ✅ ปรับปรุง: ตรวจสอบให้แน่ใจว่าทำงานเฉพาะฝั่ง Client
        if (import.meta.client) {
          sessionStorage.setItem('accessToken', response.token);
        }
        console.log('Login successful, user:', response.user);
        
        // setUser สามารถทำงานได้ทั้งสองฝั่ง เพราะ Pinia จัดการให้
        userStore.setUser(response.user);
        
        return true; 
      }
      
      return false; 
    } catch (err) {
      error.value = err.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      console.error('Login failed:', err);
      return false; 
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // ✅ ปรับปรุง: การ Logout เป็นกระบวนการที่ควรทำบน Client เท่านั้น
    if (process.client) {
      sessionStorage.removeItem('accessToken');
      userStore.clearUser();
      // การใช้ return navigateTo() เป็น Pattern ที่ดี
      return navigateTo('/login');
    }
  };

  return {
    login,
    logout,
    loading,
    error,
  };
};