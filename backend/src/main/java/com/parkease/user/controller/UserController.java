package com.parkease.user.controller;

import com.parkease.user.dto.UpdateUserRequest;
import com.parkease.user.dto.UserResponse;
import com.parkease.user.entity.Role;
import com.parkease.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management (Admin)", description = "Administrative endpoints for managing system users and owners")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) Role role
    ) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID (Admin only)")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new user/owner/admin account directly (Admin only)")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UpdateUserRequest request,
            @RequestParam(defaultValue = "Password@123") String password
    ) {
        return new ResponseEntity<>(userService.createUser(request, password), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user details or status (Admin only)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user account (Admin only)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
