package org.example.controller;

import jakarta.validation.Valid;
import org.example.dtos.LoginUserDto;
import org.example.dtos.RegisterUserDto;
import org.example.entities.User;
import org.example.responses.LoginResponse;
import org.example.responses.UserResponse;
import org.example.services.AuthenticationService;
import org.example.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService
    ) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    // 1. API Đăng ký tài khoản mới: POST /auth/signup
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserDto dto) {
        User registeredUser = authenticationService.signup(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(registeredUser));
    }

    // 2. API Đăng nhập lấy Token: POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody LoginUserDto dto) {
        // Kiểm tra thông tin đăng nhập
        User authenticatedUser = authenticationService.authenticate(dto);

        // Sinh JWT Token
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Trả về Token và thời hạn hết hạn
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    // Hàm chuyển đổi (User Entity sang UserResponse DTO để ẩn password
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
