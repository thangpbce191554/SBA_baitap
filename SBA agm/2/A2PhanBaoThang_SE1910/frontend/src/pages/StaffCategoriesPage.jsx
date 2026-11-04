/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import CategoryModal from '../components/CategoryModal';
import ConfirmModal from '../components/ConfirmModal';

function StaffCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Confirm Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (searchKw = '') => {
    setLoading(true);
    try {
      const data = searchKw.trim() 
        ? await categoryService.search(searchKw.trim())
        : await categoryService.getAll();
      setCategories(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải danh sách chuyên mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCategories(keyword);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  const handleSaveCategory = async (formData) => {
    try {
      if (modalMode === 'create') {
        await categoryService.create(formData);
        setSuccessMsg('Thêm mới chuyên mục thành công!');
      } else {
        await categoryService.update(selectedCategory.categoryId, formData);
        setSuccessMsg('Cập nhật chuyên mục thành công!');
      }
      setModalOpen(false);
      loadCategories(keyword);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Thao tác thất bại');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.categoryId);
      setSuccessMsg(`Đã xóa chuyên mục [${categoryToDelete.categoryName}] thành công!`);
      setConfirmOpen(false);
      setCategoryToDelete(null);
      loadCategories(keyword);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      // Backend chặn xóa nếu chuyên mục đang được tin tức sử dụng
      setConfirmOpen(false);
      setCategoryToDelete(null);
      setErrorMsg(err.message || 'Không thể xóa chuyên mục này!');
      setTimeout(() => setErrorMsg(''), 6000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Quản lý Chuyên mục (Category Management)</h2>
          <p className="text-muted" style={{ color: '#6c757d' }}>
            Phân hệ Nhân viên (Staff) - Quản lý cây danh mục tin tức và xuất bản
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          + Thêm chuyên mục mới
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
              placeholder="🔍 Tìm kiếm theo tên hoặc mô tả chuyên mục..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
            {keyword && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setKeyword(''); loadCategories(''); }}
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
          <h4 className="card-title">Danh sách chuyên mục ({categories.length})</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '1.5rem' }}>Đang tải danh sách chuyên mục...</p>
          ) : categories.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6c757d' }}>
              Không tìm thấy chuyên mục nào.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>Tên chuyên mục</th>
                    <th>Mô tả chi tiết</th>
                    <th style={{ width: '130px' }}>Chuyên mục cha</th>
                    <th style={{ width: '130px' }}>Trạng thái</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.categoryId}>
                      <td><strong>#{cat.categoryId}</strong></td>
                      <td><strong>{cat.categoryName}</strong></td>
                      <td>{cat.categoryDesciption}</td>
                      <td>
                        {cat.parentCategoryId ? (
                          <span className="badge badge-secondary">ID: {cat.parentCategoryId}</span>
                        ) : (
                          <span style={{ color: '#6c757d' }}>- Gốc -</span>
                        )}
                      </td>
                      <td>
                        {cat.isActive !== false ? (
                          <span className="badge badge-success">Hoạt động (Active)</span>
                        ) : (
                          <span className="badge badge-secondary">Tạm ẩn</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => handleOpenEdit(cat)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleOpenDelete(cat)}
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
      <CategoryModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedCategory}
        categoriesList={categories}
        onSave={handleSaveCategory}
        onClose={() => setModalOpen(false)}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Xác nhận xóa chuyên mục"
        message={categoryToDelete ? `Bạn có chắc chắn muốn xóa chuyên mục "${categoryToDelete.categoryName}" không? (Hệ thống sẽ từ chối nếu có bài viết đang thuộc chuyên mục này).` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setCategoryToDelete(null); }}
      />
    </div>
  );
}

export default StaffCategoriesPage;

