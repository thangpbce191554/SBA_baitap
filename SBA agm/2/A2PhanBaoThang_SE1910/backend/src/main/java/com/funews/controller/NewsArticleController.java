/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.controller;

import com.funews.dto.ApiResponse;
import com.funews.dto.NewsArticleDTO;
import com.funews.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/news")
public class NewsArticleController {

    @Autowired
    private NewsArticleService newsArticleService;

    // Lấy toàn bộ danh sách bài viết để Staff quản lý
    @GetMapping
    public ResponseEntity<ApiResponse<List<NewsArticleDTO>>> getAllNews() {
        return ResponseEntity.ok(ApiResponse.ok(newsArticleService.getAllNews()));
    }

    // Lịch sử bài viết do chính Staff tạo ra (truyền staffId)
    @GetMapping("/history/{staffId}")
    public ResponseEntity<ApiResponse<List<NewsArticleDTO>>> getStaffHistory(@PathVariable Short staffId) {
        return ResponseEntity.ok(ApiResponse.ok(newsArticleService.getStaffHistory(staffId)));
    }

    // Tìm kiếm tin tức theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<NewsArticleDTO>>> searchNews(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(newsArticleService.searchNews(keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticleDTO>> getNewsById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(newsArticleService.getNewsById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NewsArticleDTO>> createNews(@Valid @RequestBody NewsArticleDTO dto) {
        NewsArticleDTO created = newsArticleService.createNews(dto);
        return ResponseEntity.ok(ApiResponse.ok("Tạo bài viết thành công!", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticleDTO>> updateNews(@PathVariable String id, 
                                                                 @Valid @RequestBody NewsArticleDTO dto) {
        NewsArticleDTO updated = newsArticleService.updateNews(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật bài viết thành công!", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable String id) {
        newsArticleService.deleteNews(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa bài viết thành công!", null));
    }
}
