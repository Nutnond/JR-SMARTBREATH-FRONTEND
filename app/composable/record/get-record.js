// composables/api/useRecordApi.js

import { ref } from 'vue';

export const useRecordApi = () => {
  // --- Reactive State ---
  const records = ref([]);      // For a list of records
  const record = ref(null);       // For a single record object
  const pagination = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // --- Configuration ---
  const config = useRuntimeConfig();
  const API_URL = config.public.apiUrl || 'http://localhost:8080';

  // --- Function to fetch multiple records (paginated) ---
  const fetchRecords = async (machineId, options = {}) => {
    // ... (This function remains unchanged)
    if (!machineId) {
      error.value = "กรุณาระบุ Machine ID";
      return;
    }
    loading.value = true;
    error.value = null;
    if (!import.meta.client) { loading.value = false; return; }
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return;
    }
    const { page = 1, pageSize = 5 } = options;
    const params = new URLSearchParams({ machineId, page: page.toString(), pageSize: pageSize.toString() });
    try {
      const response = await $fetch(`${API_URL}/records?${params.toString()}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const { items, totalCount, ...paginationData } = response;
      records.value = items || [];
      pagination.value = { ...paginationData, totalItems: totalCount };
    } catch (err) {
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล Record';
    } finally {
      loading.value = false;
    }
  };

  // --- ✅ Function to fetch a SINGLE record by its ID ---
  const fetchRecordById = async (recordId) => {
    if (!recordId) {
      error.value = "กรุณาระบุ Record ID";
      return null;
    }
    loading.value = true;
    error.value = null;
    record.value = null;
    if (!import.meta.client) { loading.value = false; return null; }
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
      loading.value = false;
      return null;
    }
    try {
      const responseData = await $fetch(`${API_URL}/records/${recordId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      record.value = responseData;
      return responseData;
    } catch (err) {
      error.value = err.data?.message || `ไม่สามารถดึงข้อมูล Record ID: ${recordId}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // --- Function to delete a record ---
  const deleteRecordApi = async (recordId) => {
    // ... (This function remains unchanged)
    if (!import.meta.client) return false;
    const token = sessionStorage.getItem('accessToken');
    if (!token) { error.value = 'ไม่พบ Token'; return false; }
    try {
      await $fetch(`${API_URL}/records/${recordId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch (err) {
      alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      return false;
    }
  };

  // --- ✅ This return statement is the key part ---
  // Make sure fetchRecordById is included here.
  return {
    records,
    record,
    pagination,
    loading,
    error,
    fetchRecords,
    fetchRecordById, // This line makes the function available to your component
    deleteRecordApi
  };
};