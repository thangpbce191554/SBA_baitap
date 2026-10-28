/**
 * Phan Bảo Thắng
 * SE1910
 */
import React, { useState, useEffect } from "react";

export default function NewsModal({
  isOpen,
  mode = "create",
  initialData = null,
  categories = [],
  onSubmit,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "update" && initialData) {
        setTitle(initialData.title || "");
        setContent(initialData.content || "");
        setCategoryId(initialData.categoryId || (categories[0]?.id || ""));
        setTags(initialData.tags || "");
        setStatus(initialData.status ?? 1);
      } else {
        // Mode create
        setTitle("");
        setContent("");
        setCategoryId(categories[0]?.id || "");
        setTags("");
        setStatus(1);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài viết!";
    }
    if (!content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung bài viết!";
    }
    if (!categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục bài viết!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      categoryId,
      tags: tags.trim(),
      status: Number(status),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "560px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === "create" ? "Thêm mới Bài viết Tin tức" : "Cập nhật Bài viết Tin tức"}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="news-title">
                Tiêu đề bài viết <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="news-title"
                type="text"
                className={`form-control ${errors.title ? "input-error" : ""}`}
                placeholder="Nhập tiêu đề tin tức..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="news-category">
                  Danh mục bài viết <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  id="news-category"
                  className={`form-select ${errors.categoryId ? "input-error" : ""}`}
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: "" }));
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.status === 0 ? "(Tạm ẩn)" : ""}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="news-status">
                  Trạng thái xuất bản
                </label>
                <select
                  id="news-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  <option value={1}>Công khai (Active)</option>
                  <option value={0}>Bản nháp (Inactive)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="news-tags">
                Thẻ phân loại (Tags)
              </label>
              <input
                id="news-tags"
                type="text"
                className="form-control"
                placeholder="Ví dụ: Công nghệ, AI, React..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="news-content">
                Nội dung chi tiết <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                id="news-content"
                rows={4}
                className={`form-textarea ${errors.content ? "input-error" : ""}`}
                placeholder="Nhập nội dung bài viết tin tức tại đây..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
                }}
              />
              {errors.content && <span className="form-error">{errors.content}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "create" ? "Tạo bài viết" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
