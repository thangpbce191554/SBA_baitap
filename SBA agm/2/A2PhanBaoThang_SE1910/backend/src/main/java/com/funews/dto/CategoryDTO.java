/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryDTO {
    private Short categoryId;

    @NotBlank(message = "Tên danh mục không được để trống")
    private String categoryName;

    @NotBlank(message = "Mô tả danh mục không được để trống")
    private String categoryDesciption;

    private Short parentCategoryId;

    @NotNull(message = "Trạng thái không được để trống")
    private Boolean isActive;

    public CategoryDTO() {
    }

    public CategoryDTO(Short categoryId, String categoryName, String categoryDesciption, Short parentCategoryId, Boolean isActive) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategoryId = parentCategoryId;
        this.isActive = isActive;
    }

    public Short getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Short categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDesciption() {
        return categoryDesciption;
    }

    public void setCategoryDesciption(String categoryDesciption) {
        this.categoryDesciption = categoryDesciption;
    }

    public Short getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}

