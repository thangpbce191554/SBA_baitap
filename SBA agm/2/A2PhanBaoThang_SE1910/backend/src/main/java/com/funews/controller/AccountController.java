/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.controller;

import com.funews.dto.AccountDTO;
import com.funews.dto.ApiResponse;
import com.funews.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getAllAccounts() {
        return ResponseEntity.ok(ApiResponse.ok(accountService.getAllAccounts()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<AccountDTO>>> searchAccounts(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(accountService.searchAccounts(keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> getAccountById(@PathVariable Short id) {
        return ResponseEntity.ok(ApiResponse.ok(accountService.getAccountById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountDTO>> createAccount(@Valid @RequestBody AccountDTO dto) {
        AccountDTO created = accountService.createAccount(dto);
        return ResponseEntity.ok(ApiResponse.ok("Tạo tài khoản thành công!", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(@PathVariable Short id, @Valid @RequestBody AccountDTO dto) {
        AccountDTO updated = accountService.updateAccount(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tài khoản thành công!", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa tài khoản thành công!", null));
    }
}

