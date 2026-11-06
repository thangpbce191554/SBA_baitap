/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.repository;

import com.hotel.entity.BookingDetail;
import com.hotel.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    // Quy tắc xóa phòng theo đề bài: Kiểm tra phòng đã từng có trong giao dịch thuê (BookingDetail) hay chưa
    @Query("SELECT COUNT(b) > 0 FROM BookingDetail b WHERE b.id.roomId = :roomId")
    boolean existsByRoomId(@Param("roomId") Integer roomId);

    @Query("SELECT b FROM BookingDetail b WHERE b.id.bookingReservationId = :reservationId")
    List<BookingDetail> findByReservationId(@Param("reservationId") Integer reservationId);
}

