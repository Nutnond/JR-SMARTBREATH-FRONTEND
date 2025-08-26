// plugins/sweetalert.ts
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const swalMixin = Swal.mixin({
    // Global settings can go here
  });

  // ✅ ส่งออกเป็น Object ที่มีทั้ง .fire และ .Swal
  return {
    provide: {
      swal: {
        // ฟังก์ชันสำหรับ "ยิง" modal (ยังใช้งานเหมือนเดิม)
        fire: (options: import('sweetalert2').SweetAlertOptions) => {
          return swalMixin.fire(options);
        },
        // ส่งออก Class หลักของ Swal เพื่อให้เรียก static methods ได้
        Swal: Swal,
      },
    },
  };
});