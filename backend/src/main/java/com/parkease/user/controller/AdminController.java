package com.parkease.user.controller;

import com.parkease.booking.dto.BookingResponse;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.dto.ParkingSlotResponse;
import com.parkease.user.dto.UserResponse;
import com.parkease.user.entity.Role;
import com.parkease.user.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin System Management", description = "System-wide administrative endpoints for users, owners, parking, bookings, and analytics")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get system-wide live dashboard metrics")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users with optional role and search filter")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(adminService.getAllUsersWithFilter(role, search));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Block or activate a user account")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @GetMapping("/owners")
    @Operation(summary = "Get all facility owners with lot and revenue overview")
    public ResponseEntity<List<Map<String, Object>>> getOwnersOverview() {
        return ResponseEntity.ok(adminService.getAllOwnersOverview());
    }

    @GetMapping("/parking-lots")
    @Operation(summary = "Get all parking lots system-wide")
    public ResponseEntity<List<ParkingLotResponse>> getAllParkingLots() {
        return ResponseEntity.ok(adminService.getAllParkingLots());
    }

    @PatchMapping("/parking-lots/{id}/toggle-status")
    @Operation(summary = "Activate or deactivate a parking facility")
    public ResponseEntity<ParkingLotResponse> toggleParkingLotStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleParkingLotStatus(id));
    }

    @GetMapping("/parking-slots")
    @Operation(summary = "Get all parking slots system-wide")
    public ResponseEntity<List<ParkingSlotResponse>> getAllParkingSlots() {
        return ResponseEntity.ok(adminService.getAllParkingSlots());
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings system-wide")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get system-wide analytics & breakdown")
    public ResponseEntity<Map<String, Object>> getSystemAnalytics() {
        return ResponseEntity.ok(adminService.getSystemAnalytics());
    }
}
