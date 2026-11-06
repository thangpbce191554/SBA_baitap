/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.repository;

import com.hotel.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    // Lấy các phòng đang hoạt động (Status = 1) cho khách xem
    List<RoomInformation> findByRoomStatus(Byte roomStatus);

    boolean existsByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndRoomIdNot(String roomNumber, Integer roomId);

    // Tìm kiếm phòng theo số phòng hoặc mô tả
    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:keyword IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.roomDetailDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:roomTypeId IS NULL OR r.roomTypeId = :roomTypeId)")
    List<RoomInformation> searchRooms(@Param("keyword") String keyword, @Param("roomTypeId") Integer roomTypeId);
}

