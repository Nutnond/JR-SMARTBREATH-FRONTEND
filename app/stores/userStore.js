import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
  // 1. STATE: เหมือนเดิม แต่ไม่มีการระบุ type
  state: () => ({
    username: '',
    firstname: '',
    lastname: '',
    id: '',
    email: '',
    weight: '',
    height: '',
    gender: '',
  }),

  // 2. GETTERS: เหมือนเดิม
  getters: {
    isLoggedIn: (state) => !!state.id,
    fullName: (state) => `${state.firstname} ${state.lastname}`,
    user: (state) => ({
      username: state.username,
      firstName: state.firstname,
      lastName: state.lastname,
      id: state.id,
      email: state.email,
      weight: state.weight,
      height: state.height,
    }),
  },

  // 3. ACTIONS: ลบการระบุ type ของ parameter "newUser" ออก
  actions: {
    /**
     * @param {User} newUser - Object ข้อมูลผู้ใช้
     */
    setUser(user) {
      this.username = user.username
      this.firstname = user.firstName
      this.lastname = user.lastName
      this.id = user.id
      this.email = user.email
      this.weight = user.weight
      this.height = user.height
      this.gender = user.gender
    },
    clearUser() {
      this.$reset();
    },
  },

  // 4. PERSIST PLUGIN: ส่วนนี้ใช้ได้กับ JavaScript อยู่แล้ว
  persist: {
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['username', 'firstname', 'lastname', 'id', 'email', 'weight', 'height','gender'],
  },
})