/**
 * Author: Phan Bảo Thắng - SE1910 - CE191554
 * FUMiniHotelSystem - Assignment 03
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingRequest;
import com.hotel.dto.BookingResponseDTO;
import com.hotel.dto.CustomerDTO;
import com.hotel.entity.Customer;
import com.hotel.repository.CustomerRepository;
import com.hotel.service.BookingService;
import com.hotel.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CustomerRepository customerRepository;

    // 1. Quản lý hồ sơ cá nhân qua Token của người đang đăng nhập
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDTO>> getMyProfile(Authentication auth) {
        String email = auth.getName();
        Customer cust = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng"));
        return ResponseEntity.ok(ApiResponse.ok(customerService.getCustomerById(cust.getCustomerId())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateMyProfile(Authentication auth, @Valid @RequestBody CustomerDTO dto) {
        String email = auth.getName();
        Customer cust = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng"));
        CustomerDTO updated = customerService.updateCustomer(cust.getCustomerId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin cá nhân thành công!", updated));
    }

    // 1b. Quản lý theo ID (hỗ trợ cả REST path variable)
    @GetMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> getProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getCustomerById(id)));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateProfile(@PathVariable Integer id, @Valid @RequestBody CustomerDTO dto) {
        CustomerDTO updated = customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin cá nhân thành công!", updated));
    }

    // 2. Đặt phòng trực tuyến (Booking Online)
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(Authentication auth, @Valid @RequestBody BookingRequest req) {
        if (req.getCustomerId() == null && auth != null) {
            String email = auth.getName();
            customerRepository.findByEmailAddress(email).ifPresent(c -> req.setCustomerId(c.getCustomerId()));
        }
        BookingResponseDTO created = bookingService.createBooking(req);
        return ResponseEntity.ok(ApiResponse.ok("Đặt phòng thành công!", created));
    }

    // 3. Xem lịch sử đặt phòng qua Token
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getMyBookings(Authentication auth) {
        String email = auth.getName();
        Customer cust = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng"));
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getCustomerBookings(cust.getCustomerId())));
    }

    // 3b. Xem lịch sử đặt phòng theo ID
    @GetMapping("/bookings/history/{customerId}")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getBookingHistory(@PathVariable Integer customerId) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getCustomerBookings(customerId)));
    }
}
