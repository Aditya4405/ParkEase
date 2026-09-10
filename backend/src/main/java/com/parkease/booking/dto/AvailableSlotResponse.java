package com.parkease.booking.dto;

import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotResponse {
    private Long id;
    private String slotNumber;
    private Double price;
    private SlotSize size;
    private VehicleType vehicleType;
    private boolean available;
    private Long parkingLotId;
    private String parkingLotName;
}
