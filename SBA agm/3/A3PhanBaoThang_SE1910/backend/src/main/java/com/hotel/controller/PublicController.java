/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.RoomDTO;
import com.hotel.dto.RoomTypeDTO;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private RoomService roomService;

    // Xem thông tin phòng công khai không cần đăng nhập (Đúng yêu cầu đề trang 5)
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getPublicRooms() {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getPublicActiveRooms()));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<ApiResponse<RoomDTO>> getPublicRoomDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getRoomById(id)));
    }

    @GetMapping("/room-types")
    public ResponseEntity<ApiResponse<List<RoomTypeDTO>>> getRoomTypes() {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAllRoomTypes()));
    }
}

