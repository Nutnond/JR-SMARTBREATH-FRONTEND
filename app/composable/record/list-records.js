// composables/api/useRecordApi.js

import { ref } from 'vue';

export const useRecordApi = () => {
    // --- Reactive State ---
    const records = ref([]);      // เก็บข้อมูล Record ที่ได้จาก API
    const pagination = ref(null); // เก็บข้อมูล Pagination
    const loading = ref(false);   // สถานะกำลังโหลด
    const error = ref(null);      // เก็บข้อความ Error

    // --- Configuration ---
    const config = useRuntimeConfig();
    const API_URL = config.public.apiUrl || 'http://localhost:8080';

    /**
     * ฟังก์ชันสำหรับดึงข้อมูล Health Records ของเครื่องที่ระบุ
     * @param {string} machineId - ID ของเครื่องที่ต้องการดูข้อมูล
     * @param {object} options - ตัวเลือกเพิ่มเติม เช่น page, pageSize
     */
    const fetchRecords = async (machineId, options = {}) => {
        // 1. ตรวจสอบ Input พื้นฐาน
        if (!machineId) {
            error.value = "กรุณาระบุ Machine ID";
            return;
        }

        // 2. รีเซ็ตสถานะก่อนเริ่มการดึงข้อมูลใหม่
        loading.value = true;
        error.value = null;
        records.value = []; // เคลียร์ข้อมูลเก่า

        // 3. ดึง Token จาก sessionStorage (ทำงานเฉพาะฝั่ง Client)
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

        // 4. เตรียม Query Parameters (รองรับ Pagination)
        const { page = 1, pageSize = 5 } = options;
        const params = new URLSearchParams({
            machineId,
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        try {
            const response = await $fetch(`${API_URL}/records?${params.toString()}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // ✅ CHANGED: ปรับการดึงข้อมูลให้ตรงกับ JSON ที่ได้รับ
            const { items, totalCount, ...paginationData } = response;

            // 1. นำ Array ที่อยู่ใน `items` ไปใส่ใน records ref
            records.value = items || [];

            // 2. นำข้อมูล pagination ที่เหลือมาสร้างเป็น object ใหม่
            //    พร้อมแปลง totalCount เป็น totalItems เพื่อให้ Component เดิมใช้งานได้ทันที
            pagination.value = {
                ...paginationData,
                totalItems: totalCount
            };

        } catch (err) {
            error.value = err.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล Record';
            console.error('Fetch records failed:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
    * ✅ ADDED: ฟังก์ชันสำหรับลบ Record
    * @param {string} recordId - ID ของ Record ที่ต้องการลบ
    * @returns {Promise<boolean>} - คืนค่า true ถ้าลบสำเร็จ, false ถ้าล้มเหลว
    */
    const deleteRecordApi = async (recordId) => {
        if (!import.meta.client) return false;
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            error.value = 'ไม่พบ Token สำหรับการยืนยันตัวตน';
            return false;
        }

        try {
            await $fetch(`${API_URL}/records/${recordId}`, { // สมมติว่า Endpoint เป็น /records/:id
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return true; // ลบสำเร็จ
        } catch (err) {
            console.error('Delete record failed:', err);
            // สามารถตั้งค่า error ref แยกสำหรับ action การลบได้ถ้าต้องการ
            alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
            return false; // ลบไม่สำเร็จ
        }
    };

    // --- Return state and methods ---
    return {
        records,
        pagination,
        loading,
        error,
        fetchRecords,
        deleteRecordApi
    };
};