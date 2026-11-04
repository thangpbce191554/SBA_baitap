/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.AccountDTO;
import com.funews.dto.ProfileUpdateRequest;
import com.funews.entity.SystemAccount;
import com.funews.repository.SystemAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    @Autowired
    private SystemAccountRepository accountRepository;

    public AccountDTO getProfile(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản với ID: " + id));
        return new AccountDTO(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                null
        );
    }

    public AccountDTO updateProfile(Short id, ProfileUpdateRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản với ID: " + id));

        account.setAccountName(request.getAccountName());

        // Nếu người dùng yêu cầu đổi mật khẩu
        if (StringUtils.hasText(request.getNewPassword())) {
            if (!StringUtils.hasText(request.getOldPassword()) || 
                !request.getOldPassword().equals(account.getAccountPassword())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác!");
            }
            account.setAccountPassword(request.getNewPassword());
        }

        SystemAccount saved = accountRepository.save(account);
        return new AccountDTO(
                saved.getAccountId(),
                saved.getAccountName(),
                saved.getAccountEmail(),
                saved.getAccountRole(),
                null
        );
    }
}
