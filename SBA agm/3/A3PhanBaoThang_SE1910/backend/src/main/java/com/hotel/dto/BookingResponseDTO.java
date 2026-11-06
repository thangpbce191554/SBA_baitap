/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookingResponseDTO {

    private Integer bookingReservationId;
    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private Integer customerId;
    private String customerFullName;
    private String customerEmail;
    private Byte bookingStatus; // 1: Confirmed, 2: Completed, 0: Cancelled
    private List<BookingDetailDTO> bookingDetails = new ArrayList<>();

    public BookingResponseDTO() {
    }

    public Integer getBookingReservationId() {
        return bookingReservationId;
    }

    public void setBookingReservationId(Integer bookingReservationId) {
        this.bookingReservationId = bookingReservationId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Byte getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Byte bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public List<BookingDetailDTO> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetailDTO> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}

