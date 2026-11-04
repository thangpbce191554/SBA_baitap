/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';

function NewsModal({ isOpen, mode, initialData, categories = [], tags = [], onSave, onClose, onQuickAddTag }) {
  const [formData, setFormData] = useState({
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryId: '',
    newsStatus: true,
    tagIds: []
  });
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        newsTitle: initialData.newsTitle || '',
        headline: initialData.headline || '',
        newsContent: initialData.newsContent || '',
        newsSource: initialData.newsSource || '',
        categoryId: initialData.categoryId ? String(initialData.categoryId) : '',
        newsStatus: initialData.newsStatus !== false,
        tagIds: initialData.tagIds || []
      });
    } else {
      setFormData({
        newsTitle: '',
        headline: '',
        newsContent: '',
        newsSource: 'FUNews',
        categoryId: categories.length > 0 ? String(categories[0].categoryId) : '',
        newsStatus: true,
        tagIds: []
      });
    }
    setError('');
  }, [initialData, mode, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const current = [...prev.tagIds];
      const index = current.indexOf(tagId);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(tagId);
      }
      return { ...prev, tagIds: current };
    });
  };

  const handleAddTagClick = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    if (onQuickAddTag) {
      const createdTag = await onQuickAddTag(newTagName.trim());
      if (createdTag) {
        setFormData(prev => ({
          ...prev,
          tagIds: [...prev.tagIds, createdTag.tagId]
        }));
        setNewTagName('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.newsTitle.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!formData.headline.trim()) {
      setError('Vui lòng nhập tóm tắt (Headline)!');
      return;
    }
    if (!formData.newsContent.trim()) {
      setError('Vui lòng nhập nội dung bài viết!');
      return;
    }
    if (!formData.categoryId) {
      setError('Vui lòng chọn chuyên mục!');
      return;
    }

    const payload = {
      newsTitle: formData.newsTitle.trim(),
      headline: formData.headline.trim(),
      newsContent: formData.newsContent.trim(),
      newsSource: formData.newsSource.trim() || 'N/A',
      categoryId: Number(formData.categoryId),
      newsStatus: formData.newsStatus,
      tagIds: formData.tagIds
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-dialog-lg">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h4 className="modal-title">
              {mode === 'edit' ? 'Chỉnh sửa bài viết tin tức' : 'Soạn bài viết tin tức mới'}
            </h4>
            <button type="button" className="modal-close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="form-label">Tiêu đề bài viết *</label>
              <input
                type="text"
                name="newsTitle"
                className="form-control"
                placeholder="Nhập tiêu đề tin tức..."
                value={formData.newsTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tóm tắt (Headline) *</label>
              <input
                type="text"
                name="headline"
                className="form-control"
                placeholder="Nhập tóm tắt ngắn gọn..."
                value={formData.headline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group form-col">
                <label className="form-label">Chuyên mục *</label>
                <select
                  name="categoryId"
                  className="form-control"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName} {c.isActive === false ? '(Tạm ẩn)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-col">
                <label className="form-label">Nguồn tin</label>
                <input
                  type="text"
                  name="newsSource"
                  className="form-control"
                  placeholder="Ví dụ: Internet, FUNews, Báo Giáo dục..."
                  value={formData.newsSource}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung chi tiết *</label>
              <textarea
                name="newsContent"
                className="form-control"
                rows="6"
                placeholder="Nhập toàn văn nội dung bài viết tin tức..."
                value={formData.newsContent}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gắn thẻ bài viết (Tags)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem', maxHeight: '100px', overflowY: 'auto', border: '1px solid #ced4da', padding: '0.5rem', borderRadius: '4px' }}>
                {tags.map(t => (
                  <label key={t.tagId} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', background: '#e9ecef', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(t.tagId)}
                      onChange={() => handleTagToggle(t.tagId)}
                    />
                    <span>#{t.tagName}</span>
                  </label>
                ))}
              </div>

              {/* Thêm nhanh Tag */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Thêm nhanh tag mới..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  style={{ maxWidth: '250px' }}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTagClick}>
                  + Thêm Tag
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái xuất bản</label>
              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="newsStatus"
                    checked={formData.newsStatus}
                    onChange={handleChange}
                  />
                  <span>Công khai hiển thị (Active - Khách vãng lai xem được)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Lưu thay đổi' : 'Đăng bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewsModal;

