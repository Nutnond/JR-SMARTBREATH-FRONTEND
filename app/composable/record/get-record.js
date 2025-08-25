// composables/api/useRecordApi.js

import { ref } from 'vue';

export const useRecordApi = () => {
    // --- Reactive State ---
    const records = ref([]);
    const record = ref(null);
    const pagination = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // --- Configuration ---
    const config = useRuntimeConfig();
    const API_URL = config.public.BASE_API_URL || 'http://localhost:8080';

    // --- Function to fetch multiple records (paginated) ---
    const fetchRecords = async (machineId, options = {}) => {
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

    // --- Function to fetch a SINGLE record by its ID ---
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

    // --- ✅ UPDATED: Function to delete a record ---
    const deleteRecord = async (recordId) => {
        loading.value = true;
        error.value = null;

        if (!recordId) {
            error.value = "กรุณาระบุ Record ID ที่ต้องการลบ";
            loading.value = false;
            return false;
        }
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
            await $fetch(`${API_URL}/records/${recordId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // หากสำเร็จ ให้นำรายการที่ถูกลบออกจาก records array ใน state ด้วย
            records.value = records.value.filter(r => r.id !== recordId);
            return true; // คืนค่า true เพื่อบอกว่าการลบสำเร็จ
        } catch (err) {
            error.value = err.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล';
            return false; // คืนค่า false เพื่อบอกว่าการลบไม่สำเร็จ
        } finally {
            loading.value = false;
        }
    };

    return {
        records,
        record,
        pagination,
        loading,
        error,
        fetchRecords,
        fetchRecordById,
        deleteRecord // ✅ EXPORTED: ส่งฟังก์ชัน delete ที่ปรับปรุงแล้วออกไป
    };
};