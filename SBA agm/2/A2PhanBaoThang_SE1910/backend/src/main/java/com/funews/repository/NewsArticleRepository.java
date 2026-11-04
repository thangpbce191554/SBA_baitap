/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.repository;

import com.funews.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    // Kiểm tra Category có đang được News nào sử dụng không (Chặn xóa Category)
    boolean existsByCategoryId(Short categoryId);

    // Kiểm tra Account có từng tạo News nào không (Chặn xóa Account)
    boolean existsByCreatedById(Short createdById);

    // Lấy tin tức có trạng thái Active (1) cho người dùng vãng lai (Public)
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    // Lấy lịch sử tin tức do chính Staff này tạo
    List<NewsArticle> findByCreatedByIdOrderByCreatedDateDesc(Short createdById);

    // Tìm kiếm tin tức theo tiêu đề hoặc nội dung hoặc headline
    @Query("SELECT n FROM NewsArticle n WHERE " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchNews(@Param("keyword") String keyword);
}

