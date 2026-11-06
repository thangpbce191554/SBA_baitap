/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Customer Service (Profile, Booking creation, Booking history)
 */

import { api } from './api';

export const customerService = {
  async getProfile() {
    return await api.get('/customer/profile');
  },

  async updateProfile(profileData) {
    return await api.put('/customer/profile', profileData);
  },

  async createBooking(bookingData) {
    return await api.post('/customer/bookings', bookingData);
  },

  async getBookingHistory() {
    return await api.get('/customer/bookings');
  }
};

export default customerService;

