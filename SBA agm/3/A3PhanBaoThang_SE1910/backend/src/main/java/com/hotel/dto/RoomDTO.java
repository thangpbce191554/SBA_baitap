/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RoomDTO {

    private Integer roomId;

    @NotBlank(message = "Số phòng không được để trống")
    private String roomNumber;

    private String roomDetailDescription;

    private Integer roomMaxCapacity;

    @NotNull(message = "Vui lòng chọn loại phòng")
    private Integer roomTypeId;

    private String roomTypeName;

    private Byte roomStatus; // 1: Active, 2: Deleted/Inactive

    @NotNull(message = "Giá phòng không được để trống")
    private BigDecimal roomPricePerDay;

    public RoomDTO() {
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public Integer getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Integer roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public Byte getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Byte roomStatus) {
        this.roomStatus = roomStatus;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }
}

