/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Header Component with Dynamic Role-Based Navigation
 */

import React from 'react';

export default function Header({ currentUser, activeTab, setActiveTab, onLogout }) {
  const isStaff = currentUser?.role === 'ROLE_STAFF' || currentUser?.role === 'STAFF';
  const isCustomer = currentUser?.role === 'ROLE_CUSTOMER' || currentUser?.role === 'CUSTOMER';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveTab(isStaff ? 'staff-rooms' : 'public-rooms')}>
          <div className="brand-icon">🏨</div>
          <div className="brand-text">
            <h1>FU MINI HOTEL</h1>
            <span>Phan Bảo Thắng - SE1910</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {/* Hiển thị cho khách vãng lai và Customer, ẩn với Staff */}
            {!isStaff && (
              <li key="nav-rooms">
                <button
                  className={`nav-item ${activeTab === 'public-rooms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('public-rooms')}
                >
                  Danh sách phòng
                </button>
              </li>
            )}

            {/* Customer Links */}
            {isCustomer && (
              <>
                <li key="nav-my-bookings">
                  <button
                    className={`nav-item ${activeTab === 'customer-bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('customer-bookings')}
                  >
                    Lịch sử đặt phòng
                  </button>
                </li>
                <li key="nav-profile">
                  <button
                    className={`nav-item ${activeTab === 'customer-profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('customer-profile')}
                  >
                    Hồ sơ cá nhân
                  </button>
                </li>
              </>
            )}

            {/* Staff Links */}
            {isStaff && (
              <>
                <li key="nav-staff-rooms">
                  <button
                    className={`nav-item ${activeTab === 'staff-rooms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('staff-rooms')}
                  >
                    Quản lý phòng
                  </button>
                </li>
                <li key="nav-staff-customers">
                  <button
                    className={`nav-item ${activeTab === 'staff-customers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('staff-customers')}
                  >
                    Quản lý khách hàng
                  </button>
                </li>
                <li key="nav-staff-bookings">
                  <button
                    className={`nav-item ${activeTab === 'staff-bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('staff-bookings')}
                  >
                    Quản lý đặt phòng
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="nav-auth">
          {currentUser ? (
            <>
              <div className="user-badge">
                <span className="user-name">{currentUser.fullName || currentUser.email}</span>
                <span className={`user-role ${isStaff ? 'staff' : 'customer'}`}>
                  {isStaff ? 'Quản trị viên (Staff)' : 'Khách hàng (Customer)'}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              className={`btn btn-primary btn-sm ${activeTab === 'login' ? 'btn-secondary' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

