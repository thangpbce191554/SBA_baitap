/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.RoomDTO;
import com.hotel.dto.RoomTypeDTO;
import com.hotel.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/rooms")
public class StaffRoomController {

    @Autowired
    private RoomService roomService;

    // Xem danh sách toàn bộ phòng (Staff)
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getAllRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeId) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAllRoomsForStaff(keyword, roomTypeId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomDTO>> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getRoomById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoomDTO>> createRoom(@Valid @RequestBody RoomDTO dto) {
        RoomDTO created = roomService.createRoom(dto);
        return ResponseEntity.ok(ApiResponse.ok("Tạo phòng mới thành công!", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomDTO>> updateRoom(@PathVariable Integer id, @Valid @RequestBody RoomDTO dto) {
        RoomDTO updated = roomService.updateRoom(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật phòng thành công!", updated));
    }

    // Xóa phòng: Tự động xóa cứng nếu chưa có booking, hoặc xóa mềm nếu đã có booking (Đúng yêu cầu đề)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRoom(@PathVariable Integer id) {
        String message = roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.ok(message, null));
    }

    @GetMapping("/room-types")
    public ResponseEntity<ApiResponse<List<RoomTypeDTO>>> getRoomTypes() {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAllRoomTypes()));
    }
}

