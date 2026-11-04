/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';

function PublicNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [readingArticle, setReadingArticle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [newsData, catData] = await Promise.all([
        newsService.getPublicNews(),
        categoryService.getPublicCategories()
      ]);
      setNewsList(newsData);
      setCategories(catData);
    } catch (err) {
      console.error('Lỗi tải tin tức công khai:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc tin tức theo từ khóa và chuyên mục ở client
  const filteredNews = newsList.filter(item => {
    const matchKeyword = !keyword.trim() || 
      (item.newsTitle && item.newsTitle.toLowerCase().includes(keyword.trim().toLowerCase())) ||
      (item.headline && item.headline.toLowerCase().includes(keyword.trim().toLowerCase())) ||
      (item.newsContent && item.newsContent.toLowerCase().includes(keyword.trim().toLowerCase()));

    const matchCategory = !selectedCategory || String(item.categoryId) === String(selectedCategory);

    return matchKeyword && matchCategory;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Bản tin Tin tức Công khai</h2>
        <p className="text-muted" style={{ color: '#6c757d' }}>
          Xem các tin tức mới nhất từ Trường Đại học FPT (Dành cho độc giả vãng lai)
        </p>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Tìm kiếm tin tức theo tiêu đề, nội dung..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div style={{ width: '220px' }}>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Tất cả chuyên mục --</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách tin tức */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Đang nạp tin tức từ máy chủ...</p>
      ) : filteredNews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
            Không tìm thấy bài viết tin tức nào phù hợp.
          </p>
        </div>
      ) : (
        <div className="news-grid">
          {filteredNews.map(item => (
            <div key={item.newsArticleId} className="news-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">{item.categoryName || 'Tin tức'}</span>
                  <small style={{ color: '#6c757d' }}>
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : ''}
                  </small>
                </div>
                <h3 className="news-card-title">{item.newsTitle}</h3>
                <p className="news-card-meta">
                  Tác giả: <strong>{item.createdByName || 'Ban Biên tập'}</strong> • Nguồn: {item.newsSource || 'FUNews'}
                </p>
                <p className="news-card-content" style={{ fontWeight: '500', color: '#333' }}>
                  {item.headline}
                </p>
                <p className="news-card-content" style={{ fontSize: '0.85rem' }}>
                  {item.newsContent.length > 180 ? `${item.newsContent.substring(0, 180)}...` : item.newsContent}
                </p>

                {item.tagNames && item.tagNames.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {item.tagNames.map((tag, idx) => (
                      <span key={idx} className="tag-badge">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setReadingArticle(item)}
                >
                  Đọc toàn văn &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Đọc chi tiết bài viết */}
      {readingArticle && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-dialog-lg">
            <div className="modal-header">
              <h4 className="modal-title">{readingArticle.newsTitle}</h4>
              <button type="button" className="modal-close" onClick={() => setReadingArticle(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
                <span>Chuyên mục: <strong>{readingArticle.categoryName}</strong></span> | 
                <span> Người đăng: <strong>{readingArticle.createdByName || 'Staff'}</strong></span> | 
                <span> Ngày đăng: {readingArticle.createdDate ? new Date(readingArticle.createdDate).toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
              <p style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: '1rem', color: '#495057' }}>
                {readingArticle.headline}
              </p>
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#212529', marginBottom: '1.5rem' }}>
                {readingArticle.newsContent}
              </div>
              {readingArticle.tagNames && readingArticle.tagNames.length > 0 && (
                <div>
                  <strong>Thẻ liên quan: </strong>
                  {readingArticle.tagNames.map((tag, idx) => (
                    <span key={idx} className="tag-badge">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setReadingArticle(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicNewsPage;

