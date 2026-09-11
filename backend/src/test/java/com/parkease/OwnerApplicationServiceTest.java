package com.parkease;

import com.parkease.exception.BadRequestException;
import com.parkease.exception.ConflictException;
import com.parkease.user.dto.AuthResponse;
import com.parkease.user.dto.OwnerApplicationRequest;
import com.parkease.user.dto.OwnerApplicationResponse;
import com.parkease.user.dto.RegisterRequest;
import com.parkease.user.entity.OwnerApplicationStatus;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.UserRepository;
import com.parkease.user.service.AuthService;
import com.parkease.user.service.OwnerApplicationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class OwnerApplicationServiceTest {

    @Autowired
    private OwnerApplicationService ownerApplicationService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private User createTestUser(String email, String name) {
        RegisterRequest request = RegisterRequest.builder()
                .name(name)
                .email(email)
                .password("Password@123")
                .phone("+91 9876543210")
                .vehicleNumber("UP32AA1122")
                .build();
        AuthResponse res = authService.register(request, Role.USER);
        return userRepository.findById(res.getId()).orElseThrow();
    }

    private User createTestAdmin() {
        return userRepository.findByEmail("admin@parkease.com")
                .orElseGet(() -> {
                    User admin = User.builder()
                            .name("System Admin")
                            .email("admin@parkease.com")
                            .password("dummy")
                            .role(Role.ADMIN)
                            .active(true)
                            .build();
                    return userRepository.save(admin);
                });
    }

    private OwnerApplicationRequest createSampleRequest() {
        return OwnerApplicationRequest.builder()
                .businessName("Avadh Park Management Ltd")
                .businessType("Commercial Operator")
                .businessRegistrationNumber("GSTIN-09AAACH7409R1ZZ")
                .parkingName("Gomti Nagar Multi-Level Parking")
                .address("Vibhuti Khand, Gomti Nagar")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226010")
                .parkingType("Multi-Level Covered")
                .approxCapacity(250)
                .vehicleTypesSupported("CAR,BIKE,EV")
                .hasEVCharging(true)
                .operatingHours("24/7 Open")
                .ownershipInfo("Authorized facility concessionaire")
                .verificationDocumentUrl("DOC-REF-LKO-2026-001")
                .build();
    }

    @Test
    @DisplayName("Should submit owner application in PENDING status and preserve USER role")
    void testSubmitApplicationSuccess() {
        User applicant = createTestUser("applicant1@example.com", "Ramesh Kumar");

        OwnerApplicationResponse response = ownerApplicationService.submitApplication(createSampleRequest(), applicant);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertTrue(response.getApplicationNumber().startsWith("PA-"));
        assertEquals(OwnerApplicationStatus.PENDING, response.getStatus());
        assertEquals("Gomti Nagar Multi-Level Parking", response.getParkingName());

        // Verify applicant user role is still USER
        User freshUser = userRepository.findById(applicant.getId()).orElseThrow();
        assertEquals(Role.USER, freshUser.getRole());
    }

    @Test
    @DisplayName("Should reject duplicate pending application with ConflictException")
    void testSubmitDuplicateApplicationFails() {
        User applicant = createTestUser("applicant2@example.com", "Suresh Verma");

        ownerApplicationService.submitApplication(createSampleRequest(), applicant);

        assertThrows(ConflictException.class, () -> {
            ownerApplicationService.submitApplication(createSampleRequest(), applicant);
        });
    }

    @Test
    @DisplayName("Should reject owner application if user is already an OWNER")
    void testSubmitByExistingOwnerFails() {
        User applicant = createTestUser("alreadyowner@example.com", "Vikram Singh");
        applicant.setRole(Role.OWNER);
        userRepository.save(applicant);

        assertThrows(BadRequestException.class, () -> {
            ownerApplicationService.submitApplication(createSampleRequest(), applicant);
        });
    }

    @Test
    @DisplayName("Admin approval should update application to APPROVED and promote user role to OWNER")
    void testAdminApproveApplication() {
        User applicant = createTestUser("applicant3@example.com", "Neha Sharma");
        User admin = createTestAdmin();

        OwnerApplicationResponse submitted = ownerApplicationService.submitApplication(createSampleRequest(), applicant);
        assertEquals(OwnerApplicationStatus.PENDING, submitted.getStatus());

        OwnerApplicationResponse approved = ownerApplicationService.approveApplication(
                submitted.getId(),
                admin,
                "All facility credentials and lease documents verified successfully."
        );

        assertEquals(OwnerApplicationStatus.APPROVED, approved.getStatus());
        assertEquals(admin.getEmail(), approved.getReviewedBy());
        assertNotNull(approved.getReviewedAt());
        assertEquals("All facility credentials and lease documents verified successfully.", approved.getReviewNotes());

        // Verify user is now OWNER
        User promotedUser = userRepository.findById(applicant.getId()).orElseThrow();
        assertEquals(Role.OWNER, promotedUser.getRole());
    }

    @Test
    @DisplayName("Admin rejection should set status to REJECTED with note, leaving role as USER")
    void testAdminRejectApplication() {
        User applicant = createTestUser("applicant4@example.com", "Pooja Gupta");
        User admin = createTestAdmin();

        OwnerApplicationResponse submitted = ownerApplicationService.submitApplication(createSampleRequest(), applicant);

        OwnerApplicationResponse rejected = ownerApplicationService.rejectApplication(
                submitted.getId(),
                admin,
                "Unable to verify property authorization proof provided."
        );

        assertEquals(OwnerApplicationStatus.REJECTED, rejected.getStatus());
        assertEquals("Unable to verify property authorization proof provided.", rejected.getReviewNotes());
        assertEquals(admin.getEmail(), rejected.getReviewedBy());
        assertNotNull(rejected.getReviewedAt());

        // Verify user remains USER
        User stillUser = userRepository.findById(applicant.getId()).orElseThrow();
        assertEquals(Role.USER, stillUser.getRole());
    }

    @Test
    @DisplayName("Admin rejection without a reason should throw BadRequestException")
    void testAdminRejectWithoutReasonFails() {
        User applicant = createTestUser("applicant5@example.com", "Deepak Patel");
        User admin = createTestAdmin();

        OwnerApplicationResponse submitted = ownerApplicationService.submitApplication(createSampleRequest(), applicant);

        assertThrows(BadRequestException.class, () -> {
            ownerApplicationService.rejectApplication(submitted.getId(), admin, "   ");
        });
    }

    @Test
    @DisplayName("Should retrieve applications by status and search keyword")
    void testSearchApplications() {
        User applicant = createTestUser("searchapp@example.com", "Ananya Mishra");
        ownerApplicationService.submitApplication(createSampleRequest(), applicant);

        List<OwnerApplicationResponse> pending = ownerApplicationService.getAllApplications(OwnerApplicationStatus.PENDING, "Lucknow");
        assertFalse(pending.isEmpty());
        assertTrue(pending.stream().anyMatch(a -> a.getCity().equals("Lucknow")));
    }
}
