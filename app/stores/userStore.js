import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // 1. STATE: เหมือนเดิม ไม่ต้องเพิ่ม age
  state: () => ({
    username: '',
    firstname: '',
    lastname: '',
    id: '',
    email: '',
    weight: '',
    height: '',
    gender: '',
    dob: '', // Date of Birth (e.g., '1990-12-31')
  }),

  // 2. GETTERS: เพิ่ม getter 'age' ที่นี่
  getters: {
    isLoggedIn: (state) => !!state.id,
    fullName: (state) => `${state.firstname} ${state.lastname}`,

    /**
     * คำนวณอายุจากวันเกิด (dob)
     * @param {object} state - The current state.
     * @returns {number | null} - อายุเป็นตัวเลข หรือ null ถ้าไม่มีข้อมูล dob
     */
    age: (state) => {
      // ถ้าไม่มีข้อมูล dob ให้ return null
      if (!state.dob) {
        return null;
      }
      
      try {
        const birthDate = new Date(state.dob);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        // ตรวจสอบว่าวันเกิดของปีนี้ผ่านไปแล้วหรือยัง
        // ถ้าเดือนยังมาไม่ถึง หรือเป็นเดือนเดียวกันแต่วันยังมาไม่ถึง ให้ลดอายุลง 1 ปี
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age;
      } catch (error) {
        // กรณี format ของ dob ไม่ถูกต้อง
        console.error("Invalid date format for dob:", state.dob);
        return null;
      }
    },

    // Getter เดิม สามารถรวม age เข้าไปได้เพื่อความสะดวก
    user: (state) => ({
      username: state.username,
      firstName: state.firstname,
      lastName: state.lastname,
      id: state.id,
      email: state.email,
      weight: state.weight,
      height: state.height,
      gender: state.gender,
      dob: state.dob,
    }),
  },

  // 3. ACTIONS: เหมือนเดิม
  actions: {
    setUser(user) {
      this.username = user.username
      this.firstname = user.firstName
      this.lastname = user.lastName
      this.id = user.id
      this.email = user.email
      this.weight = user.weight
      this.height = user.height
      this.gender = user.gender
      this.dob = user.dob
    },
    clearUser() {
      this.$reset();
    },
  },

  // 4. PERSIST PLUGIN: เหมือนเดิม ไม่ต้องเพิ่ม age
  persist: {
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['username', 'firstname', 'lastname', 'id', 'email', 'weight', 'height', 'gender', 'dob'],
  },
})