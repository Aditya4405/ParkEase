package com.parkease.parking.controller;

import com.parkease.parking.dto.*;
import com.parkease.parking.entity.ParkingOccupancyEvent;
import com.parkease.parking.service.ParkingLotService;
import com.parkease.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/parking-lots")
@RequiredArgsConstructor
@Tag(name = "Parking Lots", description = "Endpoints for discovering, creating, and managing parking lots & real-time telemetry")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    @GetMapping
    @Operation(summary = "Search active parking lots by destination, city, keyword or category (Public)")
    public ResponseEntity<List<ParkingLotResponse>> searchParkingLots(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(parkingLotService.searchParkingLots(city, search, category));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get parking lot details and slots by ID (Public)")
    public ResponseEntity<ParkingLotResponse> getParkingLotById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingLotService.getParkingLotById(id));
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Get real-time dynamic occupancy breakdown (Public)")
    public ResponseEntity<ParkingLotAvailabilityResponse> getAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(parkingLotService.getAvailability(id));
    }

    @GetMapping("/owner/my")
    @Operation(summary = "Get parking lots owned by authenticated owner (OWNER only)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<ParkingLotResponse>> getMyParkingLots(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(parkingLotService.getParkingLotsByOwner(currentUser));
    }

    @PostMapping
    @Operation(summary = "Create a new parking lot (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ParkingLotResponse> createParkingLot(
            @Valid @RequestBody ParkingLotRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parkingLotService.createParkingLot(request, currentUser));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update parking lot details (OWNER of lot or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ParkingLotResponse> updateParkingLot(
            @PathVariable Long id,
            @Valid @RequestBody ParkingLotRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(parkingLotService.updateParkingLot(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete parking lot (OWNER of lot or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteParkingLot(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        parkingLotService.deleteParkingLot(id, currentUser);
        return ResponseEntity.ok(Map.of("message", "Parking lot deleted successfully"));
    }

    // -------------------------------------------------------------
    // Real-Time Occupancy Telemetry Endpoints
    // -------------------------------------------------------------
    @PostMapping("/{id}/occupancy")
    @Operation(summary = "Record vehicle ENTRY or EXIT event (Simulated Operator / Boom Barrier telemetry) (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<OccupancyEventResponse> recordOccupancyEvent(
            @PathVariable Long id,
            @Valid @RequestBody OccupancyEventRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(parkingLotService.recordOccupancyEvent(id, request, currentUser));
    }

    @GetMapping("/{id}/occupancy-events")
    @Operation(summary = "Get recent occupancy telemetry events for audit/history (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<List<ParkingOccupancyEvent>> getOccupancyEvents(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(parkingLotService.getOccupancyEvents(id, currentUser));
    }
}
