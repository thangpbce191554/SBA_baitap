/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Public Service (Rooms, Room Types, Room Details)
 */

import { api } from './api';

export const publicService = {
  async getRooms() {
    return await api.get('/public/rooms');
  },

  async getRoomDetail(roomId) {
    return await api.get(`/public/rooms/${roomId}`);
  },

  async getRoomTypes() {
    return await api.get('/public/room-types');
  }
};

export default publicService;

