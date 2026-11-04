/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.controller;

import com.funews.dto.AccountDTO;
import com.funews.dto.ApiResponse;
import com.funews.dto.ProfileUpdateRequest;
import com.funews.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/common/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> getProfile(@PathVariable Short id) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfile(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateProfile(@PathVariable Short id,
                                                                @Valid @RequestBody ProfileUpdateRequest request) {
        AccountDTO updated = profileService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin cá nhân thành công!", updated));
    }
}
