package com.parkease.parking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_slots", uniqueConstraints = {
        @UniqueConstraint(name = "uk_lot_slotnumber", columnNames = {"parking_lot_id", "slot_number"})
}, indexes = {
        @Index(name = "idx_slot_lot_vehicletype", columnList = "parking_lot_id, vehicle_type"),
        @Index(name = "idx_slot_active", columnList = "active, is_available")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "slot_number", nullable = false)
    private String slotNumber;

    @Column(name = "price", nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "size", nullable = false)
    private SlotSize size;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_lot_id", nullable = false)
    private ParkingLot parkingLot;
}
