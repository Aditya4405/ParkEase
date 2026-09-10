package com.parkease.user.controller;

import com.parkease.user.dto.ProfileResponse;
import com.parkease.user.dto.UpdateUserRequest;
import com.parkease.user.entity.User;
import com.parkease.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for viewing and updating the authenticated user's profile")
@SecurityRequirement(name = "BearerAuth")
public class ProfileController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get authenticated user profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PutMapping
    @Operation(summary = "Update authenticated user profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(currentUser, request));
    }
}
