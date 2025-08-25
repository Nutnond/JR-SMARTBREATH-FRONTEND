// plugins/sweetalert.ts
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Create a custom Swal instance using mixin
  const swalMixin = Swal.mixin({
    // Global settings can go here
  });

  // 2. Provide a NEW function that calls the correct method
  // This preserves the context of `swalMixin`
  return {
    provide: {
      swal: (options: import('sweetalert2').SweetAlertOptions) => {
        return swalMixin.fire(options); // <-- The key change is here
      },
    },
  };
});