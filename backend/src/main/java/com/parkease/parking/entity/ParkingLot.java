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
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Builder.Default
    @Column(nullable = false)
    private String state = "Uttar Pradesh";

    @Column(nullable = false)
    private String pincode;

    @Builder.Default
    @Column(length = 50)
    private String parkingType = "Multi-Level Covered";

    @Builder.Default
    @Column(nullable = false)
    private int totalCapacity = 100;

    @Builder.Default
    @Column(nullable = false)
    private int occupiedSlots = 0;

    @Builder.Default
    @Column(nullable = false)
    private int reservedSlots = 0;

    @Builder.Default
    @Column(length = 30)
    private String openingTime = "08:00 AM";

    @Builder.Default
    @Column(length = 30)
    private String closingTime = "11:00 PM";

    @Builder.Default
    @Column(nullable = false)
    private boolean hasEVCharging = true;

    @Builder.Default
    @Column(length = 50)
    private String category = "MALL";

    @Column(length = 150)
    private String nearbyDestination;

    @Builder.Default
    @Column(length = 50)
    private String dataSource = "OPENSTREETMAP";

    @Column(length = 100)
    private String externalSourceId;

    @Builder.Default
    @Column
    private LocalDateTime lastOccupancyUpdate = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
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
        if (slots != null && !slots.isEmpty()) {
            return slots.size();
        }
        return totalCapacity > 0 ? totalCapacity : 100;
    }

    public int getComputedAvailableSlots() {
        int capacity = getEffectiveTotalCapacity();
        int available = capacity - occupiedSlots - reservedSlots;
        return Math.max(0, available);
    }
}
