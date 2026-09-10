package com.parkease.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotAvailabilityResponse {
    private Long parkingLotId;
    private String name;
    private String city;
    private String category;
    private String nearbyDestination;
    private int totalCapacity;
    private int occupiedSlots;
    private int reservedSlots;
    private int availableSlots;
    private String occupancyStatus; // AVAILABLE, LIMITED, FULL
    private LocalDateTime lastUpdated;
    private String dataSource;
}
