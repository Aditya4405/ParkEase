package com.parkease.parking.dto;

import com.parkease.parking.entity.OccupancyEventType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyEventRequest {

    @NotNull(message = "Event type (ENTRY or EXIT) is required")
    private OccupancyEventType eventType;

    private String vehicleNumber;

    @Builder.Default
    private String source = "DEMO_OPERATOR";
}
