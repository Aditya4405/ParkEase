package com.parkease.parking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_occupancy_events", indexes = {
        @Index(name = "idx_event_lot_time", columnList = "parking_lot_id, timestamp")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingOccupancyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "parking_lot_id", nullable = false)
    private Long parkingLotId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 20)
    private OccupancyEventType eventType;

    @Column(name = "vehicle_number", length = 50)
    private String vehicleNumber;

    @Builder.Default
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Builder.Default
    @Column(name = "source", length = 50)
    private String source = "DEMO_OPERATOR";

    @Builder.Default
    @Column(name = "processed", nullable = false)
    private boolean processed = true;
}
