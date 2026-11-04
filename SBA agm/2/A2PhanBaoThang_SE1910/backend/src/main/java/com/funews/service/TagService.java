/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.TagDTO;
import com.funews.entity.Tag;
import com.funews.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagDTO(t.getTagId(), t.getTagName(), t.getNote()))
                .collect(Collectors.toList());
    }

    public TagDTO createTagIfNotExist(String tagName) {
        return tagRepository.findByTagName(tagName.trim())
                .map(t -> new TagDTO(t.getTagId(), t.getTagName(), t.getNote()))
                .orElseGet(() -> {
                    Integer maxId = tagRepository.findMaxTagId();
                    Tag newTag = new Tag(maxId + 1, tagName.trim(), tagName.trim());
                    Tag saved = tagRepository.save(newTag);
                    return new TagDTO(saved.getTagId(), saved.getTagName(), saved.getNote());
                });
    }
}

