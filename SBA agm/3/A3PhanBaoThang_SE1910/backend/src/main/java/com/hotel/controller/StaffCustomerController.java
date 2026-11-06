/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.CustomerDTO;
import com.hotel.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/customers")
public class StaffCustomerController {

    @Autowired
    private CustomerService customerService;

    // Xem danh sách và tìm kiếm khách hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerDTO>>> getAllCustomers(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getAllCustomers(keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getCustomerById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDTO>> createCustomer(@Valid @RequestBody CustomerDTO dto) {
        CustomerDTO created = customerService.createCustomer(dto);
        return ResponseEntity.ok(ApiResponse.ok("Thêm khách hàng mới thành công!", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerDTO dto) {
        CustomerDTO updated = customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật khách hàng thành công!", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa khách hàng thành công!", null));
    }
}

