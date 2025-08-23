// composables/useDeviceApi.js

import { tr } from '@nuxt/ui/runtime/locale/index.js';
import { ref } from 'vue';

export const useDeviceApi = () => {
  // --- State Management ---
  const loading = ref(false);
  const error = ref(null);
  const devices = ref([]); //  மாநிலสำหรับเก็บข้อมูลเครื่องที่ดึงมาได้
  // --- Configuration ---
  const config = useRuntimeConfig();
  const API_URL = config.public.BASE_API_URL || 'http://localhost:8080';

  /**
   * 🔄 ฟังก์ชันสำหรับดึงข้อมูลเครื่องทั้งหมดของผู้ใช้
   * โดยจะอ่าน Token จาก sessionStorage มาใช้ยืนยันตัวตน
   */
  const fetchDevices = async () => {
    loading.value = true;
    error.value = null;

    // ✅ ตรวจสอบว่าโค้ดกำลังรันฝั่ง Client เท่านั้น เพราะต้องใช้ sessionStorage
    if (!import.meta.client) {
      loading.value = false;
      return; // หยุดการทำงานถ้าอยู่ฝั่ง Server
    }

    // ✅ ดึง Token ออกมาจาก sessionStorage
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return; // หยุดถ้าไม่มี Token
    }

    try {
      // ✅ ใช้ $fetch ส่ง request แบบ GET พร้อมใส่ Authorization Header
      const responseData = await $fetch(`${API_URL}/machines`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // ✅ นำข้อมูลที่ได้ไปเก็บใน state
      devices.value = responseData;
      return responseData; // ส่งข้อมูลกลับไปด้วย

    } catch (err) {
      // ✅ จัดการ Error กรณี Token หมดอายุ หรือ Server มีปัญหา
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเครื่อง';
      console.error('Fetch devices failed:', err);
      devices.value = []; // เคลียร์ข้อมูลเก่าทิ้งเมื่อเกิดข้อผิดพลาด
      return null;

    } finally {
      loading.value = false;
    }
  };


  /**
   * ดึงข้อมูลอุปกรณ์เครื่องเดียวจาก ID
   * @param {string} deviceId - ID ของอุปกรณ์ที่ต้องการดึงข้อมูล
   * @returns {Promise<object|null>} - คืนค่าเป็น object ของอุปกรณ์ถ้าสำเร็จ, หรือ null ถ้าล้มเหลว
   */
  const getDeviceById = async (deviceId) => {
    // 1. ตรวจสอบว่ามี deviceId ส่งมาหรือไม่
    if (!deviceId) {
      console.error("Device ID is required.");
      return null;
    }

    // ✅ (จำเป็น) ดึง Token มาใช้งาน
    if (!import.meta.client) return null; // ทำงานเฉพาะฝั่ง Client
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error("Authentication token not found.");
      return null;
    }

    try {
      // 2. เรียก API ด้วย $fetch
      const responseData = await $fetch(`${API_URL}/machines/${deviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // 3. คืนค่าข้อมูลที่ได้รับเมื่อสำเร็จ
      return responseData;
    } catch (err) {
      // 4. จัดการ Error และคืนค่า null
      console.error(`Failed to fetch device with ID ${deviceId}:`, err.data?.message || err);
      return null;
    }
  }


  return {
    // State
    loading,
    error,
    devices,
    // Methods
    fetchDevices,
    getDeviceById
  };
};