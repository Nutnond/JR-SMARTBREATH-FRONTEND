// composables/useAuth.js

import { useUserStore } from "~/stores/userStore";
import { ref } from 'vue';

/**
 * @typedef {object} LoginCredentials
 * @property {string} [username]
 * @property {string} [password]
 */

/**
 * @typedef {object} UserRegistrationData
 * @property {string} username
 * @property {string} firstName      // ✅ UPDATED
 * @property {string} lastName       // ✅ UPDATED
 * @property {string} email
 * @property {string} password
 * @property {number} weight
 * @property {number} height
 * @property {string} gender
 * @property {number} age
 */

export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);
  const userStore = useUserStore();
  const config = useRuntimeConfig();
  const API_URL = config.public.BASE_API_URL || 'http://localhost:8080';

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: credentials,
      });

      if (response.token && response.user) {
        if (import.meta.client) {
          sessionStorage.setItem('accessToken', response.token);
        }
        console.log('Login successful, user:', response.user);

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

  /**
   * Registers a new user with the provided details.
   * @param {UserRegistrationData} userData The user's registration data.
   * @returns {Promise<boolean>} True if registration was successful, otherwise false.
   */
  const register = async (userData) => {
    loading.value = true;
    error.value = null;    
    try {
      const response = await $fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: userData,
      });

      if (response && response.id) {
        console.log('Registration successful:', response);
        return true;
      }
      return false;

    } catch (err) {
      error.value = err.data?.message || 'เกิดข้อผิดพลาดระหว่างการสมัครสมาชิก';
      console.error('Registration failed:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    if (process.client) {
      sessionStorage.removeItem('accessToken');
      userStore.clearUser();
      return navigateTo('/login');
    }
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};