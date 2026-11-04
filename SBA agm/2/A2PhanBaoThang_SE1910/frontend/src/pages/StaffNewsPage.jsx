/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';
import { tagService } from '../services/tagService';
import NewsModal from '../components/NewsModal';
import ConfirmModal from '../components/ConfirmModal';

function StaffNewsPage({ currentUser }) {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedNews, setSelectedNews] = useState(null);

  // Confirm Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [nData, cData, tData] = await Promise.all([
        newsService.getAll(),
        categoryService.getAll(),
        tagService.getAll()
      ]);
      setNewsList(nData);
      setCategories(cData);
      setTags(tData);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải dữ liệu bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = keyword.trim() ? await newsService.search(keyword.trim()) : await newsService.getAll();
      setNewsList(data);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddTag = async (tagName) => {
    try {
      const newTag = await tagService.create(tagName);
      setTags(prev => [...prev.filter(t => t.tagId !== newTag.tagId), newTag]);
      return newTag;
    } catch (err) {
      alert('Không thể tạo tag mới: ' + err.message);
      return null;
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedNews(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedNews(item);
    setModalOpen(true);
  };

  const handleSaveNews = async (formData) => {
    try {
      if (modalMode === 'create') {
        const payload = {
          ...formData,
          createdById: currentUser?.accountId || 1
        };
        await newsService.create(payload);
        setSuccessMsg('Đăng bài viết mới thành công!');
      } else {
        const payload = {
          ...formData,
          updatedById: currentUser?.accountId || 1
        };
        await newsService.update(selectedNews.newsArticleId, payload);
        setSuccessMsg('Cập nhật bài viết thành công!');
      }
      setModalOpen(false);
      loadAll();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Thao tác thất bại');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleOpenDelete = (item) => {
    setNewsToDelete(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!newsToDelete) return;
    try {
      await newsService.delete(newsToDelete.newsArticleId);
      setSuccessMsg(`Đã xóa bài viết [${newsToDelete.newsTitle}] thành công!`);
      setConfirmOpen(false);
      setNewsToDelete(null);
      loadAll();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setConfirmOpen(false);
      setNewsToDelete(null);
      setErrorMsg(err.message || 'Không thể xóa bài viết này!');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  // Lọc thêm theo categoryFilter tại Client
  const displayedNews = newsList.filter(item => {
    if (!categoryFilter) return true;
    return String(item.categoryId) === String(categoryFilter);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Quản lý Tin tức (News Article Management)</h2>
          <p className="text-muted" style={{ color: '#6c757d' }}>
            Phân hệ Nhân viên (Staff) - Soạn thảo, liên kết chuyên mục, quản lý tags và xuất bản bài viết
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          + Viết bài mới
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Form tìm kiếm & Bộ lọc */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: '1', display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Tìm kiếm theo tiêu đề, tóm tắt hoặc nội dung..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
            {keyword && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setKeyword(''); loadAll(); }}
              >
                Xóa tìm
              </button>
            )}
          </form>

          <div style={{ width: '220px' }}>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">-- Lọc theo chuyên mục --</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách bài viết */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Danh sách bài viết tin tức ({displayedNews.length})</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '1.5rem' }}>Đang tải bài viết...</p>
          ) : displayedNews.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6c757d' }}>
              Không tìm thấy bài viết tin tức nào.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>Mã ID</th>
                    <th>Tiêu đề & Tóm tắt</th>
                    <th style={{ width: '140px' }}>Chuyên mục</th>
                    <th style={{ width: '130px' }}>Người đăng</th>
                    <th style={{ width: '120px' }}>Trạng thái</th>
                    <th style={{ width: '160px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedNews.map(item => (
                    <tr key={item.newsArticleId}>
                      <td><strong>#{item.newsArticleId}</strong></td>
                      <td>
                        <strong>{item.newsTitle}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.2rem' }}>
                          {item.headline}
                        </div>
                        {item.tagNames && item.tagNames.length > 0 && (
                          <div style={{ marginTop: '0.35rem' }}>
                            {item.tagNames.map((tag, idx) => (
                              <span key={idx} className="tag-badge">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-info">{item.categoryName || 'N/A'}</span>
                      </td>
                      <td>
                        <div>{item.createdByName || 'Staff'}</div>
                        <small style={{ color: '#6c757d' }}>
                          {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : ''}
                        </small>
                      </td>
                      <td>
                        {item.newsStatus !== false ? (
                          <span className="badge badge-success">Công khai</span>
                        ) : (
                          <span className="badge badge-secondary">Tạm ẩn</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => handleOpenEdit(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleOpenDelete(item)}
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

      {/* Modal Thêm / Sửa bài viết */}
      <NewsModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedNews}
        categories={categories}
        tags={tags}
        onSave={handleSaveNews}
        onClose={() => setModalOpen(false)}
        onQuickAddTag={handleQuickAddTag}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Xác nhận xóa bài viết"
        message={newsToDelete ? `Bạn có chắc chắn muốn xóa bài viết "${newsToDelete.newsTitle}" không?` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setNewsToDelete(null); }}
      />
    </div>
  );
}

export default StaffNewsPage;

