/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';

function StaffHistoryPage({ currentUser }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser?.accountId) {
      loadHistory(currentUser.accountId);
    }
  }, [currentUser]);

  const loadHistory = async (staffId) => {
    setLoading(true);
    try {
      const data = await newsService.getStaffHistory(staffId);
      setHistoryList(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi tải lịch sử bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Lịch sử bài viết của tôi (News History)</h2>
        <p className="text-muted" style={{ color: '#6c757d' }}>
          Xem lại tất cả các bài viết tin tức do chính bạn ({currentUser?.accountName}) đã biên soạn trong hệ thống
        </p>
      </div>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Tổng số bài viết đã tạo: {historyList.length}</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '1.5rem' }}>Đang nạp lịch sử...</p>
          ) : historyList.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6c757d' }}>
              Bạn chưa tạo bài viết tin tức nào trong hệ thống.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Mã bài</th>
                    <th>Tiêu đề tin tức</th>
                    <th style={{ width: '160px' }}>Chuyên mục</th>
                    <th style={{ width: '140px' }}>Trạng thái</th>
                    <th style={{ width: '160px' }}>Ngày tạo</th>
                    <th style={{ width: '160px' }}>Lần sửa cuối</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map(item => (
                    <tr key={item.newsArticleId}>
                      <td><strong>#{item.newsArticleId}</strong></td>
                      <td>
                        <strong>{item.newsTitle}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          {item.headline}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{item.categoryName || 'N/A'}</span>
                      </td>
                      <td>
                        {item.newsStatus !== false ? (
                          <span className="badge badge-success">Đã xuất bản</span>
                        ) : (
                          <span className="badge badge-secondary">Bản nháp / Tạm ẩn</span>
                        )}
                      </td>
                      <td>
                        {item.createdDate ? new Date(item.createdDate).toLocaleString('vi-VN') : 'N/A'}
                      </td>
                      <td>
                        {item.modifiedDate ? new Date(item.modifiedDate).toLocaleString('vi-VN') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffHistoryPage;
