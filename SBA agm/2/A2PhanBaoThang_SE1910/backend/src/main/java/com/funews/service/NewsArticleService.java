/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.NewsArticleDTO;
import com.funews.entity.NewsArticle;
import com.funews.entity.Tag;
import com.funews.repository.CategoryRepository;
import com.funews.repository.NewsArticleRepository;
import com.funews.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NewsArticleService {

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    // Xem tin tức công khai (Active = true) cho khách vãng lai
    public List<NewsArticleDTO> getPublicActiveNews() {
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Danh sách toàn bộ tin tức cho Staff quản lý (Sắp xếp ID giảm dần: bài mới nhất lên đầu)
    public List<NewsArticleDTO> getAllNews() {
        return newsArticleRepository.findAll().stream()
                .sorted((a, b) -> {
                    long idA = parseId(a.getNewsArticleId());
                    long idB = parseId(b.getNewsArticleId());
                    return Long.compare(idB, idA); // Giảm dần
                })
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Lịch sử bài viết do chính Staff đang đăng nhập tạo ra
    public List<NewsArticleDTO> getStaffHistory(Short staffId) {
        return newsArticleRepository.findByCreatedByIdOrderByCreatedDateDesc(staffId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Tìm kiếm tin tức theo từ khóa
    public List<NewsArticleDTO> searchNews(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return getAllNews();
        }
        return newsArticleRepository.searchNews(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public NewsArticleDTO getNewsById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết với ID: " + id));
        return toDTO(article);
    }

    @Transactional
    public NewsArticleDTO createNews(NewsArticleDTO dto) {
        // Kiểm tra Category tồn tại
        categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không tồn tại!"));

        // Tự động sinh ID kế tiếp (ví dụ: '6', '7' tiếp nối từ dữ liệu gốc)
        long maxId = newsArticleRepository.findAll().stream()
                .mapToLong(a -> parseId(a.getNewsArticleId()))
                .max().orElse(0L);
        String nextId = String.valueOf(maxId + 1);

        NewsArticle entity = new NewsArticle();
        entity.setNewsArticleId(nextId);
        entity.setNewsTitle(dto.getNewsTitle());
        entity.setHeadline(dto.getHeadline());
        entity.setNewsContent(dto.getNewsContent());
        entity.setNewsSource(dto.getNewsSource());
        entity.setCategoryId(dto.getCategoryId());
        entity.setNewsStatus(dto.getNewsStatus() != null ? dto.getNewsStatus() : true);
        entity.setCreatedById(dto.getCreatedById());
        entity.setCreatedDate(LocalDateTime.now());

        // Gắn tags nếu có
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(dto.getTagIds()));
            entity.setTags(tags);
        }

        NewsArticle saved = newsArticleRepository.save(entity);
        return toDTO(saved);
    }

    @Transactional
    public NewsArticleDTO updateNews(String id, NewsArticleDTO dto) {
        NewsArticle entity = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết!"));

        categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không tồn tại!"));

        entity.setNewsTitle(dto.getNewsTitle());
        entity.setHeadline(dto.getHeadline());
        entity.setNewsContent(dto.getNewsContent());
        entity.setNewsSource(dto.getNewsSource());
        entity.setCategoryId(dto.getCategoryId());
        entity.setNewsStatus(dto.getNewsStatus());
        entity.setUpdatedById(dto.getUpdatedById() != null ? dto.getUpdatedById() : dto.getCreatedById());
        entity.setModifiedDate(LocalDateTime.now());

        // Cập nhật tags
        if (dto.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(dto.getTagIds()));
            entity.setTags(tags);
        }

        NewsArticle updated = newsArticleRepository.save(entity);
        return toDTO(updated);
    }

    @Transactional
    public void deleteNews(String id) {
        if (!newsArticleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết!");
        }
        newsArticleRepository.deleteById(id);
    }

    private long parseId(String idStr) {
        try {
            return Long.parseLong(idStr.trim());
        } catch (Exception e) {
            return 0L;
        }
    }

    private NewsArticleDTO toDTO(NewsArticle entity) {
        NewsArticleDTO dto = new NewsArticleDTO();
        dto.setNewsArticleId(entity.getNewsArticleId());
        dto.setNewsTitle(entity.getNewsTitle());
        dto.setHeadline(entity.getHeadline());
        dto.setNewsContent(entity.getNewsContent());
        dto.setNewsSource(entity.getNewsSource());
        dto.setCategoryId(entity.getCategoryId());
        dto.setNewsStatus(entity.getNewsStatus());
        dto.setCreatedById(entity.getCreatedById());
        dto.setUpdatedById(entity.getUpdatedById());
        dto.setCreatedDate(entity.getCreatedDate());
        dto.setModifiedDate(entity.getModifiedDate());

        if (entity.getCategory() != null) {
            dto.setCategoryName(entity.getCategory().getCategoryName());
        }

        if (entity.getCreatedBy() != null) {
            dto.setCreatedByName(entity.getCreatedBy().getAccountName());
        }

        if (entity.getTags() != null) {
            dto.setTagIds(entity.getTags().stream().map(Tag::getTagId).collect(Collectors.toList()));
            dto.setTagNames(entity.getTags().stream().map(Tag::getTagName).collect(Collectors.toList()));
        }

        return dto;
    }
}
