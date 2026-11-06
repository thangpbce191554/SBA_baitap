/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id = new BookingDetailId();

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "ActualPrice")
    private BigDecimal actualPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("roomId")
    @JoinColumn(name = "RoomID")
    private RoomInformation roomInformation;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationId")
    @JoinColumn(name = "BookingReservationID")
    private BookingReservation bookingReservation;

    public BookingDetail() {
    }

    public BookingDetailId getId() {
        return id;
    }

    public void setId(BookingDetailId id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }

    public RoomInformation getRoomInformation() {
        return roomInformation;
    }

    public void setRoomInformation(RoomInformation roomInformation) {
        this.roomInformation = roomInformation;
    }

    public BookingReservation getBookingReservation() {
        return bookingReservation;
    }

    public void setBookingReservation(BookingReservation bookingReservation) {
        this.bookingReservation = bookingReservation;
    }
}

