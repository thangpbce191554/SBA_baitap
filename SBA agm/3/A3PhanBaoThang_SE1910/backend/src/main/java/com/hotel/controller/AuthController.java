/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.LoginRequest;
import com.hotel.dto.LoginResponse;
import com.hotel.dto.RegisterRequest;
import com.hotel.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công!", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.", null));
    }
}

