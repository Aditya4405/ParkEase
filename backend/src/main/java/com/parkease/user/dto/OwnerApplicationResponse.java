package com.parkease.user.dto;

import com.parkease.user.entity.OwnerApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerApplicationResponse {

    private Long id;
    private String applicationNumber; // Formatted e.g. PA-000123
    private Long userId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String businessName;
    private String businessType;
    private String businessRegistrationNumber;
    private String parkingName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String parkingType;
    private Integer approxCapacity;
    private String vehicleTypesSupported;
    private boolean hasEVCharging;
    private String operatingHours;
    private String ownershipInfo;
    private String verificationDocumentUrl;
    private OwnerApplicationStatus status;
    private String reviewNotes;
    private String reviewedBy;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}
