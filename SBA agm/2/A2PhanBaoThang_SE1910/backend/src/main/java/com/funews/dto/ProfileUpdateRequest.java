/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.dto;

import jakarta.validation.constraints.NotBlank;

public class ProfileUpdateRequest {

    @NotBlank(message = "Tên không được để trống")
    private String accountName;

    private String oldPassword;
    private String newPassword;

    public ProfileUpdateRequest() {
    }

    public ProfileUpdateRequest(String accountName, String oldPassword, String newPassword) {
        this.accountName = accountName;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

