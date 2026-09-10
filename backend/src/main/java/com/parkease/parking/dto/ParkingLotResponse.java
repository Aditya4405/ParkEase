package com.parkease.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String parkingType;
    private int totalCapacity;
    private int totalSlots;
    private int occupiedSlots;
    private int reservedSlots;
    private int availableSlots;
    private String openingTime;
    private String closingTime;
    private boolean hasEVCharging;
    private String category;
    private String nearbyDestination;
    private String dataSource;
    private String externalSourceId;
    private LocalDateTime lastOccupancyUpdate;
    private boolean active;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private Double startingPrice;
    private List<ParkingSlotResponse> slots;
    private LocalDateTime createdAt;
}
