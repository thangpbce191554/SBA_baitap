/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Central API Client with JWT Bearer Token interceptor
 */

const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('hotel_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Lỗi HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;

