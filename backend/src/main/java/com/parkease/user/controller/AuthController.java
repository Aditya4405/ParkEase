package com.parkease.user.controller;

import com.parkease.user.dto.AuthResponse;
import com.parkease.user.dto.LoginRequest;
import com.parkease.user.dto.RegisterRequest;
import com.parkease.user.entity.Role;
import com.parkease.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and JWT authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new regular customer/driver (USER)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request, Role.USER), HttpStatus.CREATED);
    }

    @PostMapping("/register-owner")
    @Operation(summary = "Register a new parking facility owner (OWNER)")
    public ResponseEntity<AuthResponse> registerOwner(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request, Role.OWNER), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password, returning JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
