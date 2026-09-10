package com.parkease.parking.controller;

import com.parkease.parking.service.OwnerService;
import com.parkease.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/owner")
@RequiredArgsConstructor
@Tag(name = "Owner Facility Management", description = "Endpoints for facility owners to view occupancy, revenue, and metrics")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get owner live dashboard metrics and capacity overview")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ownerService.getDashboardStats(currentUser));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get owner revenue overview and transactions ledger")
    public ResponseEntity<Map<String, Object>> getRevenueOverview(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ownerService.getRevenueOverview(currentUser));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get owner facility statistics and slot utilization")
    public ResponseEntity<Map<String, Object>> getStatistics(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ownerService.getOwnerStatistics(currentUser));
    }
}
