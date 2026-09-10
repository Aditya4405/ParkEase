package com.parkease.user.controller;

import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.payment.repository.PaymentRepository;
import com.parkease.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "User Dashboard", description = "Endpoints for commuter dashboard metrics and summaries")
@SecurityRequirement(name = "BearerAuth")
public class UserAppController {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get user live dashboard statistics, upcoming bookings, and spent total")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        List<Booking> userBookings = bookingRepository.findByUser(currentUser);
        Map<String, Object> stats = new HashMap<>();

        int totalBookings = userBookings.size();
        LocalDateTime now = LocalDateTime.now();

        long upcomingCount = userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.RESERVED || (b.getStatus() == BookingStatus.ACTIVE && b.getEndTime().isAfter(now)))
                .count();

        long completedCount = userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED || (b.getStatus() == BookingStatus.ACTIVE && b.getEndTime().isBefore(now)))
                .count();

        long cancelledCount = userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();

        Double totalSpent = paymentRepository.calculateTotalUserSpent(currentUser.getId());
        if (totalSpent == null) totalSpent = 0.0;

        stats.put("totalBookings", totalBookings);
        stats.put("upcomingCount", upcomingCount);
        stats.put("completedCount", completedCount);
        stats.put("cancelledCount", cancelledCount);
        stats.put("totalSpent", totalSpent);

        // Upcoming booking (closest future booking)
        Optional<Booking> nextBooking = userBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.RESERVED || b.getStatus() == BookingStatus.ACTIVE)
                .filter(b -> b.getEndTime().isAfter(now))
                .min(Comparator.comparing(Booking::getStartTime));

        stats.put("nextBooking", nextBooking.map(this::mapToBookingResponse).orElse(null));

        // Recent bookings (top 5)
        List<BookingResponse> recent = userBookings.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
        stats.put("recentBookings", recent);

        return ResponseEntity.ok(stats);
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userName(booking.getUser() != null ? booking.getUser().getName() : "N/A")
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : "N/A")
                .userPhone(booking.getUser() != null ? booking.getUser().getPhone() : "N/A")
                .parkingLotId(booking.getParkingSlot() != null && booking.getParkingSlot().getParkingLot() != null ? booking.getParkingSlot().getParkingLot().getId() : null)
                .parkingLotName(booking.getParkingSlot() != null && booking.getParkingSlot().getParkingLot() != null ? booking.getParkingSlot().getParkingLot().getName() : "N/A")
                .parkingLotAddress(booking.getParkingSlot() != null && booking.getParkingSlot().getParkingLot() != null ? booking.getParkingSlot().getParkingLot().getAddress() : "N/A")
                .parkingLotCity(booking.getParkingSlot() != null && booking.getParkingSlot().getParkingLot() != null ? booking.getParkingSlot().getParkingLot().getCity() : "N/A")
                .parkingSlotId(booking.getParkingSlot() != null ? booking.getParkingSlot().getId() : null)
                .slotNumber(booking.getParkingSlot() != null ? booking.getParkingSlot().getSlotNumber() : "N/A")
                .slotSize(booking.getParkingSlot() != null ? booking.getParkingSlot().getSize() : null)
                .vehicleType(booking.getParkingSlot() != null ? booking.getParkingSlot().getVehicleType() : null)
                .pricePerHour(booking.getParkingSlot() != null ? booking.getParkingSlot().getPrice() : 0.0)
                .totalPrice(booking.getTotalPrice())
                .vehicleNumber(booking.getVehicleNumber())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
