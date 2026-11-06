/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.service;

import com.hotel.dto.LoginRequest;
import com.hotel.dto.LoginResponse;
import com.hotel.dto.RegisterRequest;
import com.hotel.entity.Customer;
import com.hotel.repository.CustomerRepository;
import com.hotel.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lấy thông tin tài khoản Staff từ application.properties (Đúng yêu cầu đề
    // trang 5)
    @Value("${hotel.staff.email}")
    private String staffEmail;

    @Value("${hotel.staff.password}")
    private String staffPassword;

    @Value("${hotel.staff.name}")
    private String staffName;

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        String rawPassword = request.getPassword().trim();

        // 1. Kiểm tra nếu là tài khoản Staff (từ application.properties)
        if (staffEmail.equalsIgnoreCase(email)) {
            if (staffPassword.equals(rawPassword)) {
                String token = jwtTokenProvider.generateToken(staffEmail, "ROLE_STAFF", 0, staffName);
                return new LoginResponse(token, "ROLE_STAFF", 0, staffEmail, staffName, "N/A");
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sai mật khẩu tài khoản Staff!");
            }
        }

        // 2. Kiểm tra tài khoản Khách hàng (Customer trong DB)
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Email không tồn tại trong hệ thống!"));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tài khoản của bạn đã bị khóa!");
        }

        if (!passwordEncoder.matches(rawPassword, customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sai mật khẩu!");
        }

        // Đăng nhập thành công -> Sinh JWT Token với ROLE_CUSTOMER
        String token = jwtTokenProvider.generateToken(
                customer.getEmailAddress(),
                "ROLE_CUSTOMER",
                customer.getCustomerId(),
                customer.getCustomerFullName());

        return new LoginResponse(
                token,
                "ROLE_CUSTOMER",
                customer.getCustomerId(),
                customer.getEmailAddress(),
                customer.getCustomerFullName(),
                customer.getTelephone());
    }

    public void register(RegisterRequest request) {
        String email = request.getEmailAddress().trim();

        if (staffEmail.equalsIgnoreCase(email) || customerRepository.existsByEmailAddress(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email này đã được sử dụng!");
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : "");
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus((byte) 1); // 1: Active
        customer.setPassword(passwordEncoder.encode(request.getPassword().trim()));

        customerRepository.save(customer);
    }
}
