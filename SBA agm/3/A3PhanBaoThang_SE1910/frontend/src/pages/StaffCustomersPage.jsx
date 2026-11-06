/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 * Staff Customer Management Page (CRUD Customers)
 */

import React, { useState, useEffect } from 'react';
import staffService from '../services/staffService';
import CustomerModal from '../components/CustomerModal';
import ConfirmModal from '../components/ConfirmModal';

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await staffService.getCustomers();
      if (res.success) {
        setCustomers(res.data || []);
      } else {
        setError(res.message || 'Lỗi tải danh sách khách hàng');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      setError('');
      setFeedback('');
      const res = await staffService.deleteCustomer(deletingCustomer.customerId);
      if (res.success) {
        setFeedback(res.message || 'Xóa/vô hiệu hóa khách hàng thành công');
        loadCustomers();
      } else {
        setError(res.message || 'Xóa khách hàng thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa khách hàng');
    } finally {
      setDeletingCustomer(null);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchSearch = !search ||
      c.customerFullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.emailAddress?.toLowerCase().includes(search.toLowerCase()) ||
      c.telephone?.includes(search);
    const matchStatus = statusFilter === 'ALL' || c.customerStatus === parseInt(statusFilter, 10);
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý khách hàng</h2>
          <p className="page-subtitle">Xem danh sách, thêm mới, cập nhật và khóa tài khoản khách hàng</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          ➕ Thêm khách hàng mới
        </button>
      </div>

      {feedback && <div className="alert alert-success">{feedback}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="form-grid">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm theo họ tên, email hoặc số điện thoại..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="1">1 - Đang hoạt động (Active)</option>
            <option value="2">2 - Bị khóa (Disabled)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Đang tải danh sách khách hàng...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(cust => (
                <tr key={cust.customerId}>
                  <td>{cust.customerId}</td>
                  <td style={{ fontWeight: 600, color: '#1e3a8a' }}>{cust.customerFullName}</td>
                  <td>{cust.emailAddress}</td>
                  <td>{cust.telephone || '-'}</td>
                  <td>{cust.customerBirthday || '-'}</td>
                  <td>
                    <span className={`badge ${cust.customerStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {cust.customerStatus === 1 ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleOpenEdit(cust)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeletingCustomer(cust)}
                    >
                      Xóa / Khóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={isModalOpen}
        customer={editingCustomer}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setFeedback(editingCustomer ? 'Cập nhật thông tin khách hàng thành công!' : 'Tạo mới khách hàng thành công!');
          loadCustomers();
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deletingCustomer)}
        title={`Xác nhận xóa/khóa tài khoản: ${deletingCustomer?.customerFullName}`}
        message={`Bạn có chắc chắn muốn xóa/vô hiệu hóa tài khoản ${deletingCustomer?.emailAddress} không?`}
        warning="Tài khoản này sẽ chuyển trạng thái sang Bị khóa (Disabled = 2) và không thể đăng nhập đặt phòng nữa."
        confirmText="Xác nhận khóa"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingCustomer(null)}
      />
    </div>
  );
}

