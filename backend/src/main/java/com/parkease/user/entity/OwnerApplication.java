package com.parkease.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "owner_applications", indexes = {
        @Index(name = "idx_owner_app_user", columnList = "user_id"),
        @Index(name = "idx_owner_app_status", columnList = "status"),
        @Index(name = "idx_owner_app_submitted_at", columnList = "submitted_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "business_type", nullable = false)
    private String businessType;

    @Column(name = "business_registration_number")
    private String businessRegistrationNumber;

    @Column(name = "parking_name", nullable = false)
    private String parkingName;

    @Column(name = "address", nullable = false, length = 500)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @Column(name = "parking_type", nullable = false)
    private String parkingType;

    @Column(name = "approx_capacity", nullable = false)
    private Integer approxCapacity;

    @Column(name = "vehicle_types_supported", nullable = false)
    private String vehicleTypesSupported;

    @Column(name = "has_ev_charging", nullable = false)
    private boolean hasEVCharging;

    @Column(name = "operating_hours", nullable = false)
    private String operatingHours;

    @Column(name = "ownership_info", length = 1000)
    private String ownershipInfo;

    @Column(name = "verification_document_url", length = 500)
    private String verificationDocumentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OwnerApplicationStatus status;

    @Column(name = "review_notes", length = 1000)
    private String reviewNotes;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = OwnerApplicationStatus.PENDING;
        }
    }
}
