package com.parkease.parking.dto;

import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlotRequest {

    @NotBlank(message = "Slot number is required")
    private String slotNumber;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private Double price;

    @NotNull(message = "Slot size is required")
    private SlotSize size;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Boolean isAvailable = true;
}
