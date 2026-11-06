/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.dto;

public class LoginResponse {

    private String token;
    private String role; // "STAFF" or "CUSTOMER"
    private Integer id;
    private String email;
    private String fullName;
    private String telephone;

    public LoginResponse() {
    }

    public LoginResponse(String token, String role, Integer id, String email, String fullName, String telephone) {
        this.token = token;
        this.role = role;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.telephone = telephone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}

