package com.parkease.booking.dto;

import com.parkease.booking.entity.BookingStatus;
import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private Long parkingLotId;
    private String parkingLotName;
    private String parkingLotAddress;
    private String parkingLotCity;
    private Long parkingSlotId;
    private String slotNumber;
    private SlotSize slotSize;
    private VehicleType vehicleType;
    private Double pricePerHour;
    private Double totalPrice;
    private String vehicleNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
