/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BookingRequest {

    private Integer customerId; // Có thể lấy từ JWT hoặc Staff chỉ định

    @NotNull(message = "Ngày nhận phòng không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày trả phòng không được để trống")
    private LocalDate endDate;

    @NotEmpty(message = "Vui lòng chọn ít nhất 1 phòng để đặt")
    private List<Integer> roomIds;

    public BookingRequest() {
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
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

    public List<Integer> getRoomIds() {
        return roomIds;
    }

    public void setRoomIds(List<Integer> roomIds) {
        this.roomIds = roomIds;
    }
}

