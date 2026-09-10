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
    private String pincode;
    private boolean active;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private int totalSlots;
    private int availableSlots;
    private Double startingPrice;
    private List<ParkingSlotResponse> slots;
    private LocalDateTime createdAt;
}
