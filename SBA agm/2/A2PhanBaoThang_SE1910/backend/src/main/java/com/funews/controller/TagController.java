/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.controller;

import com.funews.dto.ApiResponse;
import com.funews.dto.TagDTO;
import com.funews.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TagDTO>>> getAllTags() {
        return ResponseEntity.ok(ApiResponse.ok(tagService.getAllTags()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TagDTO>> createTag(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.ok(tagService.createTagIfNotExist(name)));
    }
}

