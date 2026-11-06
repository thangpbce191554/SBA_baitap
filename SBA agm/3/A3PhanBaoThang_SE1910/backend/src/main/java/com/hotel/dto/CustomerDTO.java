/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CustomerDTO {

    private Integer customerId;

    @NotBlank(message = "Họ và tên không được để trống")
    private String customerFullName;

    private String telephone;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String emailAddress;

    private LocalDate customerBirthday;

    private Byte customerStatus; // 1: Active, 0: Inactive

    private String password; // Tùy chọn khi cập nhật

    public CustomerDTO() {
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Byte getCustomerStatus() {
        return customerStatus;
    }

    public void setCustomerStatus(Byte customerStatus) {
        this.customerStatus = customerStatus;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

