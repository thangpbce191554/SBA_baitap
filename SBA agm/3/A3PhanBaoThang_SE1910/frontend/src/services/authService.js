/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Authentication Service (Login, Register, Logout, Session management)
 */

import { api } from './api';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data?.token) {
      localStorage.setItem('hotel_token', res.data.token);
      localStorage.setItem('hotel_user', JSON.stringify({
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role,
      }));
    }
    return res;
  },

  async register(customerData) {
    return await api.post('/auth/register', customerData);
  },

  logout() {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('hotel_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('hotel_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('hotel_token');
  },

  isStaff() {
    const user = this.getCurrentUser();
    return user?.role === 'ROLE_STAFF' || user?.role === 'STAFF';
  },

  isCustomer() {
    const user = this.getCurrentUser();
    return user?.role === 'ROLE_CUSTOMER' || user?.role === 'CUSTOMER';
  }
};

export default authService;

