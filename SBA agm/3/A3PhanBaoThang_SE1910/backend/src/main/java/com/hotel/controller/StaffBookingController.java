/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingResponseDTO;
import com.hotel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/bookings")
public class StaffBookingController {

    @Autowired
    private BookingService bookingService;

    // Xem toàn bộ danh sách đặt phòng và chi tiết đặt phòng (Staff)
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAllBookings()));
    }

    // Cập nhật trạng thái đặt phòng (hỗ trợ cả param và request body)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable Integer id,
            @RequestParam(required = false) Byte status,
            @RequestBody(required = false) Map<String, Object> body) {
        Byte targetStatus = status;
        if (targetStatus == null && body != null && body.get("status") != null) {
            targetStatus = Byte.valueOf(body.get("status").toString());
        }
        if (targetStatus == null) {
            targetStatus = 2;
        }
        bookingService.updateBookingStatus(id, targetStatus);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái đặt phòng thành công!", null));
    }
}
