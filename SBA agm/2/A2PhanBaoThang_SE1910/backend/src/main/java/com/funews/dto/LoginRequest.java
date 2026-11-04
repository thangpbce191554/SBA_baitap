/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String accountEmail;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String accountPassword;

    public LoginRequest() {
    }

    public LoginRequest(String accountEmail, String accountPassword) {
        this.accountEmail = accountEmail;
        this.accountPassword = accountPassword;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}

