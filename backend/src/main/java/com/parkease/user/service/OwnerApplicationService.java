package com.parkease.user.service;

import com.parkease.exception.BadRequestException;
import com.parkease.exception.ConflictException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.user.dto.OwnerApplicationRequest;
import com.parkease.user.dto.OwnerApplicationResponse;
import com.parkease.user.entity.OwnerApplication;
import com.parkease.user.entity.OwnerApplicationStatus;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.OwnerApplicationRepository;
import com.parkease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerApplicationService {

    private final OwnerApplicationRepository ownerApplicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public OwnerApplicationResponse submitApplication(OwnerApplicationRequest request, User currentUser) {
        if (currentUser == null) {
            throw new BadRequestException("Authenticated user context is required");
        }

        // Re-load fresh user state
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        if (!user.isActive()) {
            throw new BadRequestException("Your account is deactivated. Cannot submit partner application.");
        }

        if (user.getRole() == Role.OWNER) {
            throw new BadRequestException("You are already registered and approved as a verified parking facility owner.");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrators already possess root administrative privileges.");
        }

        // Check for active pending or under_review applications
        boolean hasActiveApplication = ownerApplicationRepository.existsByUserAndStatusIn(
                user,
                List.of(OwnerApplicationStatus.PENDING, OwnerApplicationStatus.UNDER_REVIEW)
        );
        if (hasActiveApplication) {
            throw new ConflictException("You already have an active partner application under review. Please wait for administrator verification.");
        }

        OwnerApplication application = OwnerApplication.builder()
                .user(user)
                .businessName(request.getBusinessName().trim())
                .businessType(request.getBusinessType().trim())
                .businessRegistrationNumber(request.getBusinessRegistrationNumber() != null ? request.getBusinessRegistrationNumber().trim() : null)
                .parkingName(request.getParkingName().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState() != null && !request.getState().isBlank() ? request.getState().trim() : "Uttar Pradesh")
                .pincode(request.getPincode().trim())
                .parkingType(request.getParkingType().trim())
                .approxCapacity(request.getApproxCapacity())
                .vehicleTypesSupported(request.getVehicleTypesSupported().trim().toUpperCase())
                .hasEVCharging(request.getHasEVCharging() != null ? request.getHasEVCharging() : false)
                .operatingHours(request.getOperatingHours().trim())
                .ownershipInfo(request.getOwnershipInfo() != null ? request.getOwnershipInfo().trim() : null)
                .verificationDocumentUrl(request.getVerificationDocumentUrl() != null ? request.getVerificationDocumentUrl().trim() : null)
                .status(OwnerApplicationStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        OwnerApplication saved = ownerApplicationRepository.save(application);
        return mapToResponse(saved);
    }

    public OwnerApplicationResponse getMyApplication(User currentUser) {
        if (currentUser == null) {
            throw new BadRequestException("Authenticated user context is required");
        }
        return ownerApplicationRepository.findTopByUserOrderBySubmittedAtDesc(currentUser)
                .map(this::mapToResponse)
                .orElse(null);
    }

    public List<OwnerApplicationResponse> getAllApplications(OwnerApplicationStatus status, String search) {
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        List<OwnerApplication> apps = ownerApplicationRepository.searchApplications(status, trimmedSearch);
        return apps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OwnerApplicationResponse getApplicationById(Long id) {
        OwnerApplication app = ownerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner application not found with id: " + id));
        return mapToResponse(app);
    }

    @Transactional
    public OwnerApplicationResponse approveApplication(Long id, User admin, String notes) {
        OwnerApplication app = ownerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner application not found with id: " + id));

        if (app.getStatus() == OwnerApplicationStatus.APPROVED) {
            throw new BadRequestException("This application has already been approved.");
        }

        // Transactional role promotion
        User applicant = app.getUser();
        applicant.setRole(Role.OWNER);
        userRepository.save(applicant);

        app.setStatus(OwnerApplicationStatus.APPROVED);
        app.setReviewedBy(admin != null ? admin.getEmail() : "admin@parkease.com");
        app.setReviewedAt(LocalDateTime.now());
        if (notes != null && !notes.isBlank()) {
            app.setReviewNotes(notes.trim());
        }

        OwnerApplication savedApp = ownerApplicationRepository.save(app);
        return mapToResponse(savedApp);
    }

    @Transactional
    public OwnerApplicationResponse rejectApplication(Long id, User admin, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new BadRequestException("A rejection reason/note is required to reject an application.");
        }

        OwnerApplication app = ownerApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner application not found with id: " + id));

        if (app.getStatus() == OwnerApplicationStatus.APPROVED) {
            throw new BadRequestException("Approved applications cannot be rejected. Manage user status in User Management.");
        }

        app.setStatus(OwnerApplicationStatus.REJECTED);
        app.setReviewNotes(reason.trim());
        app.setReviewedBy(admin != null ? admin.getEmail() : "admin@parkease.com");
        app.setReviewedAt(LocalDateTime.now());

        OwnerApplication savedApp = ownerApplicationRepository.save(app);
        return mapToResponse(savedApp);
    }

    public long getPendingCount() {
        return ownerApplicationRepository.countByStatus(OwnerApplicationStatus.PENDING);
    }

    public OwnerApplicationResponse mapToResponse(OwnerApplication app) {
        String appNumber = String.format("PA-%06d", app.getId());
        User applicant = app.getUser();

        return OwnerApplicationResponse.builder()
                .id(app.getId())
                .applicationNumber(appNumber)
                .userId(applicant != null ? applicant.getId() : null)
                .applicantName(applicant != null ? applicant.getName() : "Unknown")
                .applicantEmail(applicant != null ? applicant.getEmail() : "Unknown")
                .applicantPhone(applicant != null ? applicant.getPhone() : null)
                .businessName(app.getBusinessName())
                .businessType(app.getBusinessType())
                .businessRegistrationNumber(app.getBusinessRegistrationNumber())
                .parkingName(app.getParkingName())
                .address(app.getAddress())
                .city(app.getCity())
                .state(app.getState())
                .pincode(app.getPincode())
                .parkingType(app.getParkingType())
                .approxCapacity(app.getApproxCapacity())
                .vehicleTypesSupported(app.getVehicleTypesSupported())
                .hasEVCharging(app.isHasEVCharging())
                .operatingHours(app.getOperatingHours())
                .ownershipInfo(app.getOwnershipInfo())
                .verificationDocumentUrl(app.getVerificationDocumentUrl())
                .status(app.getStatus())
                .reviewNotes(app.getReviewNotes())
                .reviewedBy(app.getReviewedBy())
                .submittedAt(app.getSubmittedAt())
                .reviewedAt(app.getReviewedAt())
                .build();
    }
}
