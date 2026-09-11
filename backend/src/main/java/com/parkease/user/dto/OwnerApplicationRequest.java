package com.parkease.user.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerApplicationRequest {

    @NotBlank(message = "Business or company name is required")
    private String businessName;

    @NotBlank(message = "Business type is required (e.g., Commercial Operator, Real Estate, Individual)")
    private String businessType;

    private String businessRegistrationNumber;

    @NotBlank(message = "Parking facility name is required")
    private String parkingName;

    @NotBlank(message = "Full facility address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "Parking structure type is required (e.g., Multi-Level Covered, Open Ground)")
    private String parkingType;

    @NotNull(message = "Approximate capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer approxCapacity;

    @NotBlank(message = "Supported vehicle types are required")
    private String vehicleTypesSupported;

    private Boolean hasEVCharging;

    @NotBlank(message = "Operating hours are required (e.g. 24/7 or 06:00 AM - 11:00 PM)")
    private String operatingHours;

    private String ownershipInfo;

    private String verificationDocumentUrl;
}
