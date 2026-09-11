package com.parkease.user.controller;

import com.parkease.user.dto.OwnerApplicationRequest;
import com.parkease.user.dto.OwnerApplicationResponse;
import com.parkease.user.entity.User;
import com.parkease.user.service.OwnerApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/owner-applications")
@RequiredArgsConstructor
@Tag(name = "Owner Applications", description = "Endpoints for commuters/partners to apply as parking facility owners")
@SecurityRequirement(name = "BearerAuth")
public class OwnerApplicationController {

    private final OwnerApplicationService ownerApplicationService;

    @PostMapping
    @Operation(summary = "Submit a new parking facility owner application (Authenticated USER)")
    public ResponseEntity<OwnerApplicationResponse> submitApplication(
            @Valid @RequestBody OwnerApplicationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return new ResponseEntity<>(ownerApplicationService.submitApplication(request, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's latest owner application and status")
    public ResponseEntity<OwnerApplicationResponse> getMyApplication(
            @AuthenticationPrincipal User currentUser
    ) {
        OwnerApplicationResponse response = ownerApplicationService.getMyApplication(currentUser);
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
