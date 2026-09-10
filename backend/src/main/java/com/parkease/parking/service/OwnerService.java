package com.parkease.parking.service;

import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingSlotRepository;
import com.parkease.payment.dto.PaymentResponse;
import com.parkease.payment.entity.Payment;
import com.parkease.payment.repository.PaymentRepository;
import com.parkease.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public Map<String, Object> getDashboardStats(User owner) {
        List<ParkingLot> lots = parkingLotRepository.findByOwner(owner);
        Map<String, Object> stats = new HashMap<>();

        int totalLots = lots.size();
        int totalCapacity = lots.stream().mapToInt(ParkingLot::getEffectiveTotalCapacity).sum();
        int occupiedSlots = lots.stream().mapToInt(ParkingLot::getOccupiedSlots).sum();
        int reservedSlots = lots.stream().mapToInt(ParkingLot::getReservedSlots).sum();
        int availableSlots = Math.max(0, totalCapacity - occupiedSlots - reservedSlots);

        Double totalRevenue = paymentRepository.calculateTotalOwnerRevenue(owner.getId());
        if (totalRevenue == null) totalRevenue = 0.0;

        // Today's bookings
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        List<Booking> ownerBookings = bookingRepository.findByParkingLotOwner(owner);
        long todayBookingsCount = ownerBookings.stream()
                .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(startOfToday))
                .count();

        stats.put("totalLots", totalLots);
        stats.put("totalCapacity", totalCapacity);
        stats.put("occupiedSlots", occupiedSlots);
        stats.put("reservedSlots", reservedSlots);
        stats.put("availableSlots", availableSlots);
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayBookingsCount", todayBookingsCount);
        stats.put("activeLotsCount", lots.stream().filter(ParkingLot::isActive).count());

        // Recent bookings (top 5)
        List<BookingResponse> recentBookings = ownerBookings.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
        stats.put("recentBookings", recentBookings);

        return stats;
    }

    public Map<String, Object> getRevenueOverview(User owner) {
        Map<String, Object> rev = new HashMap<>();

        Double totalRevenue = paymentRepository.calculateTotalOwnerRevenue(owner.getId());
        if (totalRevenue == null) totalRevenue = 0.0;

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().minusDays(7).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().minusDays(30).atStartOfDay();

        Double todayRevenue = paymentRepository.calculateOwnerRevenueSince(owner.getId(), startOfToday);
        Double weekRevenue = paymentRepository.calculateOwnerRevenueSince(owner.getId(), startOfWeek);
        Double monthRevenue = paymentRepository.calculateOwnerRevenueSince(owner.getId(), startOfMonth);

        rev.put("totalRevenue", totalRevenue);
        rev.put("todayRevenue", todayRevenue != null ? todayRevenue : 0.0);
        rev.put("thisWeekRevenue", weekRevenue != null ? weekRevenue : 0.0);
        rev.put("thisMonthRevenue", monthRevenue != null ? monthRevenue : 0.0);

        List<Payment> payments = paymentRepository.findByOwnerId(owner.getId());
        List<PaymentResponse> transactions = payments.stream()
                .limit(10)
                .map(p -> PaymentResponse.builder()
                        .id(p.getId())
                        .bookingId(p.getBooking().getId())
                        .bookingReference("PE-" + String.format("%06d", p.getBooking().getId()))
                        .userName(p.getBooking().getUser() != null ? p.getBooking().getUser().getName() : "N/A")
                        .userEmail(p.getBooking().getUser() != null ? p.getBooking().getUser().getEmail() : "N/A")
                        .parkingLotName(p.getBooking().getParkingSlot() != null && p.getBooking().getParkingSlot().getParkingLot() != null ? p.getBooking().getParkingSlot().getParkingLot().getName() : "N/A")
                        .slotNumber(p.getBooking().getParkingSlot() != null ? p.getBooking().getParkingSlot().getSlotNumber() : "N/A")
                        .amount(p.getAmount())
                        .paymentMethod(p.getPaymentMethod())
                        .transactionId(p.getTransactionId())
                        .status(p.getStatus())
                        .createdAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        rev.put("recentTransactions", transactions);
        return rev;
    }

    public Map<String, Object> getOwnerStatistics(User owner) {
        List<ParkingLot> lots = parkingLotRepository.findByOwner(owner);
        Map<String, Object> stats = new HashMap<>();

        // Lot breakdown with occupancy rate
        List<Map<String, Object>> lotStats = new ArrayList<>();
        for (ParkingLot lot : lots) {
            Map<String, Object> l = new HashMap<>();
            int cap = lot.getEffectiveTotalCapacity();
            int occ = lot.getOccupiedSlots();
            int res = lot.getReservedSlots();
            double occupancyPct = cap > 0 ? ((double) (occ + res) / cap) * 100.0 : 0.0;

            l.put("id", lot.getId());
            l.put("name", lot.getName());
            l.put("city", lot.getCity());
            l.put("capacity", cap);
            l.put("occupied", occ);
            l.put("reserved", res);
            l.put("available", lot.getComputedAvailableSlots());
            l.put("occupancyRate", Math.round(occupancyPct * 10.0) / 10.0);
            lotStats.add(l);
        }
        stats.put("lots", lotStats);

        // Vehicle type slot distribution
        List<ParkingSlot> slots = new ArrayList<>();
        for (ParkingLot lot : lots) {
            slots.addAll(parkingSlotRepository.findByParkingLot(lot));
        }

        Map<String, Long> slotsByVehicle = slots.stream()
                .collect(Collectors.groupingBy(s -> s.getVehicleType().name(), Collectors.counting()));
        stats.put("slotsByVehicle", slotsByVehicle);

        return stats;
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
