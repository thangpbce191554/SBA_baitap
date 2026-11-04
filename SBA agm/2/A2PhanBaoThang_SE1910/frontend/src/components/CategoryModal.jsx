/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';

function CategoryModal({ isOpen, mode, initialData, categoriesList = [], onSave, onClose }) {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesciption: '',
    parentCategoryId: '',
    isActive: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        categoryName: initialData.categoryName || '',
        categoryDesciption: initialData.categoryDesciption || '',
        parentCategoryId: initialData.parentCategoryId !== null && initialData.parentCategoryId !== undefined ? String(initialData.parentCategoryId) : '',
        isActive: initialData.isActive !== false
      });
    } else {
      setFormData({
        categoryName: '',
        categoryDesciption: '',
        parentCategoryId: '',
        isActive: true
      });
    }
    setError('');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) {
      setError('Vui lòng nhập tên chuyên mục!');
      return;
    }
    if (!formData.categoryDesciption.trim()) {
      setError('Vui lòng nhập mô tả chuyên mục!');
      return;
    }

    const payload = {
      categoryName: formData.categoryName.trim(),
      categoryDesciption: formData.categoryDesciption.trim(),
      parentCategoryId: formData.parentCategoryId ? Number(formData.parentCategoryId) : null,
      isActive: formData.isActive
    };

    onSave(payload);
  };

  // Lọc ra các category khác với chính nó (tránh trỏ parent vào chính mình khi edit)
  const availableParents = categoriesList.filter(c => {
    if (mode === 'edit' && initialData) {
      return c.categoryId !== initialData.categoryId;
    }
    return true;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title">
              {mode === 'edit' ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}
            </h4>
            <button type="button" className="modal-close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="form-label">Tên chuyên mục *</label>
              <input
                type="text"
                name="categoryName"
                className="form-control"
                placeholder="Nhập tên chuyên mục..."
                value={formData.categoryName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chuyên mục *</label>
              <textarea
                name="categoryDesciption"
                className="form-control"
                rows="3"
                placeholder="Nhập mô tả chi tiết..."
                value={formData.categoryDesciption}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chuyên mục cha (Tùy chọn)</label>
              <select
                name="parentCategoryId"
                className="form-control"
                value={formData.parentCategoryId}
                onChange={handleChange}
              >
                <option value="">-- Không có (Chuyên mục gốc) --</option>
                {availableParents.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName} (ID: {cat.categoryId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái hoạt động</label>
              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>Kích hoạt (Active)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo chuyên mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;

