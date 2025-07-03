export const authService = {
  // เก็บ Token
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // ดึง Token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // ตรวจสอบว่ามี Token หรือไม่ (ล็อกอินอยู่หรือไม่)
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // ลบ Token (ออกจากระบบ)
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }
};
