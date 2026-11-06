/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.repository;

import com.hotel.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    // Xem lịch sử đặt phòng của một khách hàng cụ thể (sắp xếp mới nhất lên đầu)
    List<BookingReservation> findByCustomerIdOrderByBookingDateDesc(Integer customerId);

    // Lấy toàn bộ danh sách đặt phòng cho Staff
    List<BookingReservation> findAllByOrderByBookingDateDesc();
}

