package com.parkease.booking.controller;

import com.parkease.booking.dto.AvailableSlotResponse;
import com.parkease.booking.dto.BookingRequest;
import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.service.BookingService;
import com.parkease.parking.entity.VehicleType;
import com.parkease.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints for slot reservation, availability checking, and cancellation")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a parking slot reservation (Authenticated)")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return new ResponseEntity<>(bookingService.createBooking(request, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get bookings of authenticated user (Authenticated)")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookingService.getUserBookings(currentUser));
    }

    @GetMapping("/owner/my")
    @Operation(summary = "Get all customer bookings across owned parking facilities (OWNER only)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<BookingResponse>> getOwnerBookings(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookingService.getOwnerBookings(currentUser));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all platform bookings (ADMIN only)")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID (Authenticated)")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookingService.getBookingById(id, currentUser));
    }

    @PutMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel an existing booking (Authenticated User or Admin)")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, currentUser));
    }

    @GetMapping("/{lotId}/available-slots")
    @Operation(summary = "Check available slots in a parking lot for specific vehicle type and time period (Public)")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @PathVariable Long lotId,
            @RequestParam(required = false) VehicleType vehicleType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    ) {
        return ResponseEntity.ok(bookingService.getAvailableSlots(lotId, vehicleType, startTime, endTime));
    }

    @GetMapping("/verify/{id}")
    @Operation(summary = "Verify digital booking ticket pass by ID (Public QR Pass Verification)")
    public ResponseEntity<BookingResponse> verifyBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingVerification(id));
    }
}
