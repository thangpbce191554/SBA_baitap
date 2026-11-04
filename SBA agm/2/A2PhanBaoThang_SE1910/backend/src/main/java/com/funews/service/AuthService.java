/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.LoginRequest;
import com.funews.dto.LoginResponse;
import com.funews.entity.SystemAccount;
import com.funews.repository.SystemAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private SystemAccountRepository accountRepository;

    public LoginResponse login(LoginRequest request) {
        String email = request.getAccountEmail() != null ? request.getAccountEmail().trim() : "";
        String password = request.getAccountPassword() != null ? request.getAccountPassword().trim() : "";

        // Tìm tài khoản theo Email
        SystemAccount account = accountRepository.findByAccountEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác!"));

        // So khớp mật khẩu dạng chuỗi (khớp với mật khẩu mặc định '@1' của đề bài)
        if (!password.equals(account.getAccountPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác!");
        }

        return new LoginResponse(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );
    }
}
