package com.parkease.parking.controller;

import com.parkease.parking.dto.ParkingSlotRequest;
import com.parkease.parking.dto.ParkingSlotResponse;
import com.parkease.parking.service.ParkingSlotService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Parking Slots", description = "Endpoints for managing individual parking slots")
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    @GetMapping("/parking-lots/{lotId}/slots")
    @Operation(summary = "Get all slots in a parking lot (Public)")
    public ResponseEntity<List<ParkingSlotResponse>> getSlotsByLotId(@PathVariable Long lotId) {
        return ResponseEntity.ok(parkingSlotService.getSlotsByLotId(lotId));
    }

    @GetMapping("/parking-slots/{id}")
    @Operation(summary = "Get parking slot details by ID (Public)")
    public ResponseEntity<ParkingSlotResponse> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingSlotService.getSlotById(id));
    }

    @PostMapping("/parking-lots/{lotId}/slots")
    @Operation(summary = "Add a new parking slot to a parking lot (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ParkingSlotResponse> addSlotToLot(
            @PathVariable Long lotId,
            @Valid @RequestBody ParkingSlotRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return new ResponseEntity<>(parkingSlotService.addSlotToLot(lotId, request, currentUser), HttpStatus.CREATED);
    }

    @PutMapping("/parking-slots/{id}")
    @Operation(summary = "Update parking slot details/price/status (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ParkingSlotResponse> updateSlot(
            @PathVariable Long id,
            @Valid @RequestBody ParkingSlotRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(parkingSlotService.updateSlot(id, request, currentUser));
    }

    @DeleteMapping("/parking-slots/{id}")
    @Operation(summary = "Delete parking slot (OWNER or ADMIN)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteSlot(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        parkingSlotService.deleteSlot(id, currentUser);
        return ResponseEntity.ok(Map.of("message", "Parking slot deleted successfully"));
    }
}
