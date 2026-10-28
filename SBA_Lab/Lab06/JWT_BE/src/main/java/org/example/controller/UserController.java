package org.example.controller;

import org.example.entities.User;
import org.example.responses.UserResponse;
import org.example.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. API Lấy thông tin người dùng hiện tại: GET /users/me
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(toResponse(user));
    }

    // 2. API Lấy danh sách tất cả người dùng: GET /users
    @GetMapping
    public ResponseEntity<List<UserResponse>> allUsers() {
        List<UserResponse> users = userService.allUsers().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(users);
    }

    // Hàm chuyển đổi từ Entity sang DTO để loại bỏ password khỏi JSON response
    private UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }
}
