/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Service (Manage Rooms, Manage Customers, Manage Bookings)
 */

import { api } from './api';

export const staffService = {
  // Room Management
  async getRooms() {
    return await api.get('/staff/rooms');
  },

  async createRoom(roomData) {
    return await api.post('/staff/rooms', roomData);
  },

  async updateRoom(roomId, roomData) {
    return await api.put(`/staff/rooms/${roomId}`, roomData);
  },

  async deleteRoom(roomId) {
    return await api.delete(`/staff/rooms/${roomId}`);
  },

  // Customer Management
  async getCustomers() {
    return await api.get('/staff/customers');
  },

  async createCustomer(customerData) {
    return await api.post('/staff/customers', customerData);
  },

  async updateCustomer(customerId, customerData) {
    return await api.put(`/staff/customers/${customerId}`, customerData);
  },

  async deleteCustomer(customerId) {
    return await api.delete(`/staff/customers/${customerId}`);
  },

  // Booking Reservation Management
  async getBookings() {
    return await api.get('/staff/bookings');
  },

  async updateBookingStatus(bookingId, status) {
    return await api.put(`/staff/bookings/${bookingId}/status?status=${status}`, {});
  }
};

export default staffService;

