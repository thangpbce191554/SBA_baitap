/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Main Application Component
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import authService from './services/authService';

// Pages
import LoginPage from './pages/LoginPage';
import PublicRoomsPage from './pages/PublicRoomsPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CustomerBookingHistoryPage from './pages/CustomerBookingHistoryPage';
import StaffRoomsPage from './pages/StaffRoomsPage';
import StaffCustomersPage from './pages/StaffCustomersPage';
import StaffBookingsPage from './pages/StaffBookingsPage';

export default function App() {
  const isStaff = (user) => user?.role === 'ROLE_STAFF' || user?.role === 'STAFF';
  const isCustomer = (user) => user?.role === 'ROLE_CUSTOMER' || user?.role === 'CUSTOMER';

  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState(() => {
    const user = authService.getCurrentUser();
    if (isStaff(user)) return 'staff-rooms';
    return 'public-rooms';
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (isStaff(user)) {
      setActiveTab('staff-rooms');
    } else {
      setActiveTab('public-rooms');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('public-rooms');
  };

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {/* Public view (chỉ hiển thị khi chưa đăng nhập hoặc là Customer) */}
        {activeTab === 'public-rooms' && !isStaff(currentUser) && (
          <PublicRoomsPage
            currentUser={currentUser}
            onNavigateToLogin={() => setActiveTab('login')}
            onNavigateToBookings={() => setActiveTab('customer-bookings')}
          />
        )}

        {/* Authentication view */}
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRooms={() => setActiveTab('public-rooms')}
          />
        )}

        {/* Customer-only views */}
        {isCustomer(currentUser) && (
          <>
            {activeTab === 'customer-bookings' && (
              <CustomerBookingHistoryPage
                onNavigateToRooms={() => setActiveTab('public-rooms')}
              />
            )}
            {activeTab === 'customer-profile' && (
              <CustomerProfilePage />
            )}
          </>
        )}

        {/* Staff-only views */}
        {isStaff(currentUser) && (
          <>
            {activeTab === 'staff-rooms' && <StaffRoomsPage />}
            {activeTab === 'staff-customers' && <StaffCustomersPage />}
            {activeTab === 'staff-bookings' && <StaffBookingsPage />}
          </>
        )}
      </main>
    </div>
  );
}

