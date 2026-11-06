/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.service;

import com.hotel.dto.RoomDTO;
import com.hotel.dto.RoomTypeDTO;
import com.hotel.entity.RoomInformation;
import com.hotel.entity.RoomType;
import com.hotel.repository.BookingDetailRepository;
import com.hotel.repository.RoomInformationRepository;
import com.hotel.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    // Xem danh sách phòng đang hoạt động (Public / Customer)
    public List<RoomDTO> getPublicActiveRooms() {
        return roomRepository.findByRoomStatus((byte) 1).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Danh sách toàn bộ phòng cho Staff (Hỗ trợ tìm kiếm theo số phòng hoặc loại phòng)
    public List<RoomDTO> getAllRoomsForStaff(String keyword, Integer roomTypeId) {
        String cleanKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;
        return roomRepository.searchRooms(cleanKeyword, roomTypeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng với ID: " + id));
        return toDTO(room);
    }

    @Transactional
    public RoomDTO createRoom(RoomDTO dto) {
        if (roomRepository.existsByRoomNumber(dto.getRoomNumber().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số phòng [" + dto.getRoomNumber() + "] đã tồn tại!");
        }

        roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại phòng không hợp lệ!"));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomDetailDescription(dto.getRoomDetailDescription());
        room.setRoomMaxCapacity(dto.getRoomMaxCapacity());
        room.setRoomTypeId(dto.getRoomTypeId());
        room.setRoomStatus(dto.getRoomStatus() != null ? dto.getRoomStatus() : (byte) 1);
        room.setRoomPricePerDay(dto.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        return toDTO(saved);
    }

    @Transactional
    public RoomDTO updateRoom(Integer id, RoomDTO dto) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng cần sửa!"));

        if (roomRepository.existsByRoomNumberAndRoomIdNot(dto.getRoomNumber().trim(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số phòng [" + dto.getRoomNumber() + "] đã tồn tại ở phòng khác!");
        }

        roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại phòng không hợp lệ!"));

        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomDetailDescription(dto.getRoomDetailDescription());
        room.setRoomMaxCapacity(dto.getRoomMaxCapacity());
        room.setRoomTypeId(dto.getRoomTypeId());
        room.setRoomStatus(dto.getRoomStatus());
        room.setRoomPricePerDay(dto.getRoomPricePerDay());

        RoomInformation updated = roomRepository.save(room);
        return toDTO(updated);
    }

    /**
     * QUY TẮC XÓA PHÒNG BẮT BUỘC THEO ĐỀ BÀI (Mục 4 - Trang 5):
     * - Nếu phòng CHƯA TỪNG có giao dịch đặt phòng nào -> Xóa hẳn khỏi CSDL (Hard delete).
     * - Nếu phòng ĐÃ TỪNG nằm trong chi tiết đặt phòng (BookingDetail) -> Chỉ đổi trạng thái RoomStatus = 2 (Soft delete).
     */
    @Transactional
    public String deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng!"));

        boolean hasBooking = bookingDetailRepository.existsByRoomId(id);

        if (hasBooking) {
            // Đã có booking -> Xóa mềm (chuyển sang trạng thái 2: Ngưng hoạt động)
            room.setRoomStatus((byte) 2);
            roomRepository.save(room);
            return "Phòng [" + room.getRoomNumber() + "] đã có lịch sử đặt phòng, hệ thống đã chuyển trạng thái sang [Ngưng hoạt động] (Xóa mềm)!";
        } else {
            // Chưa từng có booking -> Xóa cứng
            roomRepository.deleteById(id);
            return "Đã xóa phòng [" + room.getRoomNumber() + "] thành công khỏi hệ thống!";
        }
    }

    // Danh sách loại phòng
    public List<RoomTypeDTO> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(t -> new RoomTypeDTO(t.getRoomTypeId(), t.getRoomTypeName(), t.getTypeDescription(), t.getTypeNote()))
                .collect(Collectors.toList());
    }

    private RoomDTO toDTO(RoomInformation room) {
        RoomDTO dto = new RoomDTO();
        dto.setRoomId(room.getRoomId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setRoomDetailDescription(room.getRoomDetailDescription());
        dto.setRoomMaxCapacity(room.getRoomMaxCapacity());
        dto.setRoomTypeId(room.getRoomTypeId());
        dto.setRoomStatus(room.getRoomStatus());
        dto.setRoomPricePerDay(room.getRoomPricePerDay());

        if (room.getRoomType() != null) {
            dto.setRoomTypeName(room.getRoomType().getRoomTypeName());
        }
        return dto;
    }
}

