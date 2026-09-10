package com.parkease.parking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotRequest {

    @NotBlank(message = "Parking lot name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String parkingType;
    private Integer totalCapacity;
    private String openingTime;
    private String closingTime;
    private Boolean hasEVCharging;
    private String category;
    private String nearbyDestination;
    private String dataSource;
    private String externalSourceId;

    @Builder.Default
    private Boolean active = true;

    private List<ParkingSlotRequest> initialSlots;
}
