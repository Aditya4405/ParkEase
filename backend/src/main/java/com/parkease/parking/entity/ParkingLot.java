package com.parkease.parking.entity;

import com.parkease.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parking_lots", indexes = {
        @Index(name = "idx_lot_city", columnList = "city"),
        @Index(name = "idx_lot_owner", columnList = "owner_id"),
        @Index(name = "idx_lot_category", columnList = "category")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Builder.Default
    @Column(name = "state", nullable = false)
    private String state = "Uttar Pradesh";

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @Builder.Default
    @Column(name = "parking_type", length = 50)
    private String parkingType = "Multi-Level Covered";

    @Builder.Default
    @Column(name = "total_capacity", nullable = false)
    private int totalCapacity = 100;

    @Builder.Default
    @Column(name = "occupied_slots", nullable = false)
    private int occupiedSlots = 0;

    @Builder.Default
    @Column(name = "reserved_slots", nullable = false)
    private int reservedSlots = 0;

    @Builder.Default
    @Column(name = "opening_time", length = 30)
    private String openingTime = "08:00 AM";

    @Builder.Default
    @Column(name = "closing_time", length = 30)
    private String closingTime = "11:00 PM";

    @Builder.Default
    @Column(name = "has_ev_charging", nullable = false)
    private boolean hasEVCharging = true;

    @Builder.Default
    @Column(name = "category", length = 50)
    private String category = "MALL";

    @Column(name = "nearby_destination", length = 150)
    private String nearbyDestination;

    @Builder.Default
    @Column(name = "data_source", length = 50)
    private String dataSource = "OPENSTREETMAP";

    @Column(name = "external_source_id", length = 100)
    private String externalSourceId;

    @Builder.Default
    @Column(name = "last_occupancy_update")
    private LocalDateTime lastOccupancyUpdate = LocalDateTime.now();

    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Builder.Default
    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParkingSlot> slots = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public int getEffectiveTotalCapacity() {
        if (totalCapacity > 0) {
            if (slots != null && !slots.isEmpty()) {
                return Math.max(totalCapacity, slots.size());
            }
            return totalCapacity;
        }
        if (slots != null && !slots.isEmpty()) {
            return slots.size();
        }
        return 100;
    }

    public int getComputedAvailableSlots() {
        int capacity = getEffectiveTotalCapacity();
        int safeOccupied = Math.max(0, Math.min(occupiedSlots, capacity));
        int safeReserved = Math.max(0, Math.min(reservedSlots, capacity - safeOccupied));
        return Math.max(0, capacity - safeOccupied - safeReserved);
    }
}
