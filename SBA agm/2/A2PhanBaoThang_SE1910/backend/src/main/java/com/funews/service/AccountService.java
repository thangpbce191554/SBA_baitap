/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.service;

import com.funews.dto.AccountDTO;
import com.funews.entity.SystemAccount;
import com.funews.repository.NewsArticleRepository;
import com.funews.repository.SystemAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private SystemAccountRepository accountRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AccountDTO> searchAccounts(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return getAllAccounts();
        }
        return accountRepository.searchAccounts(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AccountDTO getAccountById(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản với ID: " + id));
        return toDTO(account);
    }

    public AccountDTO createAccount(AccountDTO dto) {
        if (accountRepository.existsByAccountEmail(dto.getAccountEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng bởi tài khoản khác!");
        }

        Short maxId = accountRepository.findMaxAccountId();
        Short nextId = (short) (maxId == null ? 1 : maxId + 1);

        String rawPass = StringUtils.hasText(dto.getAccountPassword()) ? dto.getAccountPassword() : "@1";

        SystemAccount entity = new SystemAccount();
        entity.setAccountId(nextId);
        entity.setAccountName(dto.getAccountName());
        entity.setAccountEmail(dto.getAccountEmail());
        entity.setAccountRole(dto.getAccountRole());
        entity.setAccountPassword(rawPass);

        SystemAccount saved = accountRepository.save(entity);
        return toDTO(saved);
    }

    public AccountDTO updateAccount(Short id, AccountDTO dto) {
        SystemAccount entity = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản với ID: " + id));

        // Kiểm tra trùng email nếu đổi sang email khác
        if (!entity.getAccountEmail().equalsIgnoreCase(dto.getAccountEmail()) 
                && accountRepository.existsByAccountEmail(dto.getAccountEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng bởi tài khoản khác!");
        }

        entity.setAccountName(dto.getAccountName());
        entity.setAccountEmail(dto.getAccountEmail());
        entity.setAccountRole(dto.getAccountRole());

        // Nếu người dùng có nhập mật khẩu mới
        if (StringUtils.hasText(dto.getAccountPassword())) {
            entity.setAccountPassword(dto.getAccountPassword());
        }

        SystemAccount updated = accountRepository.save(entity);
        return toDTO(updated);
    }

    public void deleteAccount(Short id) {
        SystemAccount entity = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));

        // RÀNG BUỘC THEO ĐỀ: Chặn xóa tài khoản nếu đã từng tạo bài viết tin tức
        if (newsArticleRepository.existsByCreatedById(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Không thể xóa tài khoản [" + entity.getAccountName() + "] vì tài khoản này đã từng tạo bài viết tin tức trong hệ thống!");
        }

        accountRepository.deleteById(id);
    }

    private AccountDTO toDTO(SystemAccount entity) {
        return new AccountDTO(
                entity.getAccountId(),
                entity.getAccountName(),
                entity.getAccountEmail(),
                entity.getAccountRole(),
                null // Không trả về mật khẩu ra client
        );
    }
}
