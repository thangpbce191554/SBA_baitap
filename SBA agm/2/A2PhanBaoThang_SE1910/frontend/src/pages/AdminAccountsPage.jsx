/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import AccountModal from '../components/AccountModal';
import ConfirmModal from '../components/ConfirmModal';

function AdminAccountsPage({ currentUser }) {
  const [accounts, setAccounts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Confirm Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async (searchKw = '') => {
    setLoading(true);
    try {
      const data = searchKw.trim() 
        ? await accountService.search(searchKw.trim())
        : await accountService.getAll();
      setAccounts(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAccounts(keyword);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedAccount(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setModalMode('edit');
    setSelectedAccount(acc);
    setModalOpen(true);
  };

  const handleSaveAccount = async (formData) => {
    try {
      if (modalMode === 'create') {
        await accountService.create(formData);
        setSuccessMsg('Thêm mới tài khoản thành công!');
      } else {
        await accountService.update(selectedAccount.accountId, formData);
        setSuccessMsg('Cập nhật tài khoản thành công!');
      }
      setModalOpen(false);
      loadAccounts(keyword);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Thao tác thất bại');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleOpenDelete = (acc) => {
    if (currentUser && currentUser.accountId === acc.accountId) {
      setErrorMsg('Bạn không thể tự xóa tài khoản đang đăng nhập!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setAccountToDelete(acc);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      await accountService.delete(accountToDelete.accountId);
      setSuccessMsg(`Đã xóa tài khoản [${accountToDelete.accountName}] thành công!`);
      setConfirmOpen(false);
      setAccountToDelete(null);
      loadAccounts(keyword);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      // Backend chặn xóa nếu tài khoản đã từng tạo bài viết tin tức
      setConfirmOpen(false);
      setAccountToDelete(null);
      setErrorMsg(err.message || 'Không thể xóa tài khoản này!');
      setTimeout(() => setErrorMsg(''), 6000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Quản lý Tài khoản (Account Management)</h2>
          <p className="text-muted" style={{ color: '#6c757d' }}>
            Phân hệ Quản trị viên (Admin) - Tra cứu, thêm mới, sửa và xóa tài khoản hệ thống
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          + Thêm tài khoản mới
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Form tìm kiếm */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Tìm kiếm theo tên hoặc email tài khoản..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
            {keyword && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setKeyword(''); loadAccounts(''); }}
              >
                Xóa tìm
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Danh sách tài khoản ({accounts.length})</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '1.5rem' }}>Đang tải danh sách tài khoản...</p>
          ) : accounts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6c757d' }}>
              Không tìm thấy tài khoản nào.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th style={{ width: '160px' }}>Vai trò</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.accountId}>
                      <td><strong>#{acc.accountId}</strong></td>
                      <td>{acc.accountName}</td>
                      <td>{acc.accountEmail}</td>
                      <td>
                        {acc.accountRole === 1 ? (
                          <span className="badge badge-danger">Quản trị viên (Admin)</span>
                        ) : (
                          <span className="badge badge-info">Nhân viên (Staff)</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => handleOpenEdit(acc)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleOpenDelete(acc)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm / Sửa */}
      <AccountModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedAccount}
        onSave={handleSaveAccount}
        onClose={() => setModalOpen(false)}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Xác nhận xóa tài khoản"
        message={accountToDelete ? `Bạn có chắc chắn muốn xóa tài khoản "${accountToDelete.accountName}" (${accountToDelete.accountEmail}) không?` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setAccountToDelete(null); }}
      />
    </div>
  );
}

export default AdminAccountsPage;

