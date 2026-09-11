package com.parkease.user.controller;

import com.parkease.user.dto.OwnerApplicationResponse;
import com.parkease.user.dto.OwnerApplicationReviewRequest;
import com.parkease.user.entity.OwnerApplicationStatus;
import com.parkease.user.entity.User;
import com.parkease.user.service.OwnerApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/owner-applications")
@RequiredArgsConstructor
@Tag(name = "Admin Owner Applications", description = "Endpoints for administrators to review, approve, and reject parking owner partner applications")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOwnerApplicationController {

    private final OwnerApplicationService ownerApplicationService;

    @GetMapping
    @Operation(summary = "Get all owner partner applications with optional status and keyword filter (ADMIN only)")
    public ResponseEntity<List<OwnerApplicationResponse>> getAllApplications(
            @RequestParam(required = false) OwnerApplicationStatus status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ownerApplicationService.getAllApplications(status, search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information for a specific owner application by ID (ADMIN only)")
    public ResponseEntity<OwnerApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(ownerApplicationService.getApplicationById(id));
    }

    @RequestMapping(value = "/{id}/approve", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Operation(summary = "Approve an owner application, promoting applicant user role to OWNER (ADMIN only)")
    public ResponseEntity<OwnerApplicationResponse> approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) OwnerApplicationReviewRequest reviewRequest,
            @AuthenticationPrincipal User admin
    ) {
        String notes = (reviewRequest != null) ? reviewRequest.getReviewNotes() : null;
        return ResponseEntity.ok(ownerApplicationService.approveApplication(id, admin, notes));
    }

    @RequestMapping(value = "/{id}/reject", method = {RequestMethod.PUT, RequestMethod.PATCH})
    @Operation(summary = "Reject an owner application with a mandatory explanation note (ADMIN only)")
    public ResponseEntity<OwnerApplicationResponse> rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) OwnerApplicationReviewRequest reviewRequest,
            @AuthenticationPrincipal User admin
    ) {
        String reason = (reviewRequest != null) ? reviewRequest.getReviewNotes() : "Application rejected due to incomplete or unverified information.";
        return ResponseEntity.ok(ownerApplicationService.rejectApplication(id, admin, reason));
    }
}
