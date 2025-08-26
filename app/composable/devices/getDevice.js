// composables/useDeviceApi.js

import { ref } from 'vue';

export const useDeviceApi = () => {
  // --- State Management ---
  const loading = ref(false);
  const error = ref(null);
  const devices = ref([]);
  
  // --- Configuration ---
  const config = useRuntimeConfig();
  const API_URL = config.public.BASE_API_URL || 'http://localhost:8080';

  /**
   * 🔄 ฟังก์ชันสำหรับดึงข้อมูลเครื่องทั้งหมดของผู้ใช้
   */
  const fetchDevices = async () => {
    loading.value = true;
    error.value = null;

    if (!import.meta.client) {
      loading.value = false;
      return;
    }

    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return;
    }

    try {
      const responseData = await $fetch(`${API_URL}/machines`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      devices.value = responseData;
      return responseData;
    } catch (err) {
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเครื่อง';
      console.error('Fetch devices failed:', err);
      devices.value = [];
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 📄 ดึงข้อมูลอุปกรณ์เครื่องเดียวจาก ID
   * @param {string} deviceId - ID ของอุปกรณ์ที่ต้องการดึงข้อมูล
   */
  const getDeviceById = async (deviceId) => {
    if (!deviceId) {
      console.error("Device ID is required.");
      return null;
    }
    if (!import.meta.client) return null;
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error("Authentication token not found.");
      return null;
    }
    try {
      const responseData = await $fetch(`${API_URL}/machines/${deviceId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return responseData;
    } catch (err) {
      console.error(`Failed to fetch device with ID ${deviceId}:`, err.data?.message || err);
      return null;
    }
  }

  /**
   * ✅ ADDED: ฟังก์ชันสำหรับอัปเดตชื่ออุปกรณ์
   * @param {string} deviceId - ID ของอุปกรณ์ที่ต้องการอัปเดต
   * @param {{ deviceName: string }} payload - ออบเจ็กต์ที่มีชื่ออุปกรณ์ใหม่
   * @returns {Promise<boolean>} - คืนค่า true ถ้าสำเร็จ, false ถ้าล้มเหลว
   */
  const updateDevice = async (deviceId, payload) => {
    // --- ตรวจสอบ Input ---
    if (!deviceId) {
      error.value = 'จำเป็นต้องระบุ ID ของอุปกรณ์';
      console.error(error.value);
      return false;
    }
    if (!payload || typeof payload.deviceName !== 'string' || !payload.deviceName.trim()) {
        error.value = 'จำเป็นต้องระบุชื่ออุปกรณ์ใหม่ (deviceName)';
        console.error(error.value);
        return false;
    }

    loading.value = true;
    error.value = null;

    // --- ดึง Token (เฉพาะ Client) ---
    if (!import.meta.client) {
      loading.value = false;
      return false;
    }
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return false;
    }

    try {
      // --- ส่ง Request ไปยัง API ---
      await $fetch(`${API_URL}/machines/${deviceId}`, {
        method: 'PUT', // หรือ 'PATCH' หาก API รองรับ
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload // ส่ง Body ที่มีแค่ deviceName
      });

      return true; // คืนค่า true เมื่อสำเร็จ

    } catch (err) {
      // --- จัดการ Error ---
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตอุปกรณ์';
      console.error(`Update device failed for ID ${deviceId}:`, err);
      return false; // คืนค่า false เมื่อล้มเหลว

    } finally {
      loading.value = false;
    }
  };

   /**
   * 🧹 รีเซ็ตข้อมูลอุปกรณ์และลบ Record ที่เกี่ยวข้อง
   * @param {string} deviceId - ID ของอุปกรณ์ที่ต้องการรีเซ็ต
   * @returns {Promise<boolean>} - คืนค่า true ถ้าสำเร็จ, false ถ้าล้มเหลว
   */
  const resetDevice = async (deviceId) => {
    // --- ตรวจสอบ Input ---
    if (!deviceId) {
      error.value = 'จำเป็นต้องระบุ ID ของอุปกรณ์';
      console.error(error.value);
      return false;
    }

    loading.value = true;
    error.value = null;

    // --- ดึง Token (เฉพาะ Client) ---
    if (!import.meta.client) {
      loading.value = false;
      return false;
    }
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return false;
    }

    try {
      // --- ส่ง Request ไปยัง API ---
      await $fetch(`${API_URL}/machines/reset/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return true; // คืนค่า true เมื่อสำเร็จ

    } catch (err) {
      // --- จัดการ Error ---
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการรีเซ็ตอุปกรณ์';
      console.error(`Reset device failed for ID ${deviceId}:`, err);
      return false; // คืนค่า false เมื่อล้มเหลว

    } finally {
      loading.value = false;
    }
  };
  /**
     * ✅ ADDED: ลงทะเบียนอุปกรณ์ (มอบหมายให้ผู้ใช้ปัจจุบัน)
     * @param {string} deviceId - ID ของอุปกรณ์ที่ต้องการลงทะเบียน
     * @param {{ deviceName: string }} payload - ออบเจ็กต์ที่มีชื่ออุปกรณ์ใหม่
     * @returns {Promise<boolean>} - คืนค่า true ถ้าสำเร็จ, false ถ้าล้มเหลว
     */
    const registerDevice = async (deviceId, payload) => {
        // --- ตรวจสอบ Input ---
        if (!deviceId) {
            error.value = 'จำเป็นต้องระบุ ID ของอุปกรณ์';
            console.error(error.value);
            return false;
        }
        if (!payload || typeof payload.deviceName !== 'string' || !payload.deviceName.trim()) {
            error.value = 'จำเป็นต้องระบุชื่ออุปกรณ์ใหม่ (deviceName)';
            console.error(error.value);
            return false;
        }

        loading.value = true;
        error.value = null;

        // --- ดึง Token (เฉพาะ Client) ---
        if (!import.meta.client) {
            loading.value = false;
            return false;
        }
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
            loading.value = false;
            return false;
        }

        try {
            // --- ส่ง Request ไปยัง API ---
            await $fetch(`${API_URL}/machines/register/${deviceId}`, {
                method: 'POST', // เปลี่ยนเป็น POST
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: payload // ส่ง Body ที่มี deviceName
            });

            return true; // คืนค่า true เมื่อสำเร็จ

        } catch (err) {
            // --- จัดการ Error ---
            error.value = err.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียนอุปกรณ์';
            console.error(`Register device failed for ID ${deviceId}:`, err);
            return false; // คืนค่า false เมื่อล้มเหลว

        } finally {
            loading.value = false;
        }
    };


  return {
    // State
    loading,
    error,
    devices,
    // Methods
    fetchDevices,
    getDeviceById,
    updateDevice,
    resetDevice,
    registerDevice 
  };
};