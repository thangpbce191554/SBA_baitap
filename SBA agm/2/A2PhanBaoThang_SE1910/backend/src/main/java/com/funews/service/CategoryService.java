/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.CategoryDTO;
import com.funews.entity.Category;
import com.funews.repository.CategoryRepository;
import com.funews.repository.NewsArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> searchCategories(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return getAllCategories();
        }
        return categoryRepository.searchCategories(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + id));
        return toDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        Category entity = new Category();
        entity.setCategoryName(dto.getCategoryName());
        entity.setCategoryDesciption(dto.getCategoryDesciption());
        entity.setParentCategoryId(dto.getParentCategoryId());
        entity.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        Category saved = categoryRepository.save(entity);
        return toDTO(saved);
    }

    public CategoryDTO updateCategory(Short id, CategoryDTO dto) {
        Category entity = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + id));

        entity.setCategoryName(dto.getCategoryName());
        entity.setCategoryDesciption(dto.getCategoryDesciption());
        entity.setParentCategoryId(dto.getParentCategoryId());
        entity.setIsActive(dto.getIsActive());

        Category updated = categoryRepository.save(entity);
        return toDTO(updated);
    }

    public void deleteCategory(Short id) {
        Category entity = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));

        // RÀNG BUỘC THEO ĐỀ: Chặn xóa danh mục nếu đang có bài viết tin tức sử dụng
        if (newsArticleRepository.existsByCategoryId(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Không thể xóa danh mục [" + entity.getCategoryName() + "] vì đang có bài viết tin tức thuộc danh mục này!");
        }

        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category entity) {
        return new CategoryDTO(
                entity.getCategoryId(),
                entity.getCategoryName(),
                entity.getCategoryDesciption(),
                entity.getParentCategoryId(),
                entity.getIsActive()
        );
    }
}

