/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.controller;

import com.funews.dto.ApiResponse;
import com.funews.dto.CategoryDTO;
import com.funews.dto.NewsArticleDTO;
import com.funews.service.CategoryService;
import com.funews.service.NewsArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicNewsController {

    @Autowired
    private NewsArticleService newsArticleService;

    @Autowired
    private CategoryService categoryService;

    // Xem danh sách tin tức công khai (Active = 1) không cần đăng nhập
    @GetMapping("/news")
    public ResponseEntity<ApiResponse<List<NewsArticleDTO>>> getPublicNews() {
        List<NewsArticleDTO> list = newsArticleService.getPublicActiveNews();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    // Xem chi tiết một bài viết công khai
    @GetMapping("/news/{id}")
    public ResponseEntity<ApiResponse<NewsArticleDTO>> getPublicNewsDetail(@PathVariable String id) {
        NewsArticleDTO article = newsArticleService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.ok(article));
    }

    // Danh sách chuyên mục Active
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getPublicCategories() {
        List<CategoryDTO> list = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}

