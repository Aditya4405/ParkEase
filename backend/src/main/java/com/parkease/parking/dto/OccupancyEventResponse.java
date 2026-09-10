package com.parkease.parking.dto;

import com.parkease.parking.entity.OccupancyEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyEventResponse {
    private Long id;
    private Long parkingLotId;
    private String parkingLotName;
    private OccupancyEventType eventType;
    private String vehicleNumber;
    private LocalDateTime timestamp;
    private String source;
    private boolean processed;

    // Current State Snapshot after event
    private int totalCapacity;
    private int occupiedSlots;
    private int reservedSlots;
    private int availableSlots;
    private String message;
}
