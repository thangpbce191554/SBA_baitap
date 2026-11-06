/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.service;

import com.hotel.dto.BookingDetailDTO;
import com.hotel.dto.BookingRequest;
import com.hotel.dto.BookingResponseDTO;
import com.hotel.entity.BookingDetail;
import com.hotel.entity.BookingDetailId;
import com.hotel.entity.BookingReservation;
import com.hotel.entity.RoomInformation;
import com.hotel.repository.BookingDetailRepository;
import com.hotel.repository.BookingReservationRepository;
import com.hotel.repository.CustomerRepository;
import com.hotel.repository.RoomInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingReservationRepository reservationRepository;

    @Autowired
    private BookingDetailRepository detailRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Khách hàng đặt 1 hoặc nhiều phòng (Online Booking Reservation)
    @Transactional
    public BookingResponseDTO createBooking(BookingRequest req) {
        if (req.getStartDate() == null || req.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày nhận và ngày trả phòng không được để trống!");
        }

        if (!req.getEndDate().isAfter(req.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!");
        }

        if (req.getRoomIds() == null || req.getRoomIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn ít nhất 1 phòng để đặt!");
        }

        customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khách hàng không tồn tại!"));

        // Tính số ngày thuê
        long days = ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate());
        if (days <= 0) days = 1;

        // Lấy danh sách các phòng được chọn
        List<RoomInformation> rooms = roomRepository.findAllById(req.getRoomIds());
        if (rooms.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy thông tin các phòng đã chọn!");
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<BookingDetail> detailsToSave = new ArrayList<>();

        for (RoomInformation r : rooms) {
            BigDecimal roomPrice = r.getRoomPricePerDay() != null ? r.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal roomActualPrice = roomPrice.multiply(BigDecimal.valueOf(days));
            totalPrice = totalPrice.add(roomActualPrice);
        }

        // 1. Lưu BookingReservation trước
        BookingReservation reservation = new BookingReservation();
        reservation.setBookingDate(LocalDate.now());
        reservation.setTotalPrice(totalPrice);
        reservation.setCustomerId(req.getCustomerId());
        reservation.setBookingStatus((byte) 1); // 1: Confirmed (Đã xác nhận)

        BookingReservation savedReservation = reservationRepository.save(reservation);

        // 2. Lưu từng BookingDetail
        for (RoomInformation r : rooms) {
            BigDecimal roomPrice = r.getRoomPricePerDay() != null ? r.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal roomActualPrice = roomPrice.multiply(BigDecimal.valueOf(days));

            BookingDetail detail = new BookingDetail();
            detail.setId(new BookingDetailId(savedReservation.getBookingReservationId(), r.getRoomId()));
            detail.setStartDate(req.getStartDate());
            detail.setEndDate(req.getEndDate());
            detail.setActualPrice(roomActualPrice);
            detail.setRoomInformation(r);
            detail.setBookingReservation(savedReservation);

            detailsToSave.add(detailRepository.save(detail));
        }

        savedReservation.setBookingDetails(detailsToSave);
        return toDTO(savedReservation);
    }

    // Xem lịch sử đặt phòng của Customer
    public List<BookingResponseDTO> getCustomerBookings(Integer customerId) {
        return reservationRepository.findByCustomerIdOrderByBookingDateDesc(customerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Xem toàn bộ danh sách đặt phòng cho Staff
    public List<BookingResponseDTO> getAllBookings() {
        return reservationRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Cập nhật trạng thái đặt phòng (Staff)
    @Transactional
    public void updateBookingStatus(Integer reservationId, Byte status) {
        BookingReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt phòng!"));
        reservation.setBookingStatus(status);
        reservationRepository.save(reservation);
    }

    private BookingResponseDTO toDTO(BookingReservation res) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingReservationId(res.getBookingReservationId());
        dto.setBookingDate(res.getBookingDate());
        dto.setTotalPrice(res.getTotalPrice());
        dto.setCustomerId(res.getCustomerId());
        dto.setBookingStatus(res.getBookingStatus());

        if (res.getCustomer() != null) {
            dto.setCustomerFullName(res.getCustomer().getCustomerFullName());
            dto.setCustomerEmail(res.getCustomer().getEmailAddress());
        }

        if (res.getBookingDetails() != null) {
            List<BookingDetailDTO> detailDTOs = res.getBookingDetails().stream()
                    .map(d -> {
                        String roomNum = d.getRoomInformation() != null ? d.getRoomInformation().getRoomNumber() : "N/A";
                        String typeName = (d.getRoomInformation() != null && d.getRoomInformation().getRoomType() != null)
                                ? d.getRoomInformation().getRoomType().getRoomTypeName() : "N/A";
                        return new BookingDetailDTO(
                                d.getId().getRoomId(),
                                roomNum,
                                typeName,
                                d.getStartDate(),
                                d.getEndDate(),
                                d.getActualPrice()
                        );
                    }).collect(Collectors.toList());
            dto.setBookingDetails(detailDTOs);
        }

        return dto;
    }
}

