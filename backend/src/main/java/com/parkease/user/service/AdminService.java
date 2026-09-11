package com.parkease.user.service;

import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.entity.Booking;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.dto.ParkingSlotResponse;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingSlotRepository;
import com.parkease.payment.repository.PaymentRepository;
import com.parkease.user.dto.UserResponse;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.countByRole(Role.USER);
        long totalOwners = userRepository.countByRole(Role.OWNER);
        long totalParkingLots = parkingLotRepository.count();
        long activeParkingLots = parkingLotRepository.countByActiveTrue();
        long totalSlots = parkingSlotRepository.count();
        long availableSlots = parkingSlotRepository.countByActiveTrueAndIsAvailableTrue();
        long totalBookings = bookingRepository.count();
        Double totalRevenue = paymentRepository.calculateTotalSystemRevenue();

        stats.put("totalUsers", totalUsers);
        stats.put("totalOwners", totalOwners);
        stats.put("totalParkingLots", totalParkingLots);
        stats.put("activeParkingLots", activeParkingLots);
        stats.put("totalSlots", totalSlots);
        stats.put("availableSlots", availableSlots);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        // Recent bookings preview
        List<BookingResponse> recentBookings = bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(6)
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
        stats.put("recentBookings", recentBookings);

        return stats;
    }

    public List<UserResponse> getAllUsersWithFilter(Role role, String search) {
        List<User> users;
        if (role != null) {
            users = userRepository.findByRole(role);
        } else {
            users = userRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase().trim();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(q)) ||
                                 (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)) ||
                                 (u.getPhone() != null && u.getPhone().contains(q)) ||
                                 (u.getVehicleNumber() != null && u.getVehicleNumber().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(!user.isActive());
        return mapToUserResponse(userRepository.save(user));
    }

    public List<Map<String, Object>> getAllOwnersOverview() {
        List<User> owners = userRepository.findByRole(Role.OWNER);
        List<Map<String, Object>> result = new ArrayList<>();

        for (User owner : owners) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", owner.getId());
            map.put("name", owner.getName());
            map.put("email", owner.getEmail());
            map.put("phone", owner.getPhone());
            map.put("active", owner.isActive());
            map.put("createdAt", owner.getCreatedAt());

            List<ParkingLot> lots = parkingLotRepository.findByOwner(owner);
            map.put("facilityCount", lots.size());
            int totalSlots = lots.stream().mapToInt(ParkingLot::getEffectiveTotalCapacity).sum();
            map.put("totalCapacity", totalSlots);

            Double revenue = paymentRepository.calculateTotalOwnerRevenue(owner.getId());
            map.put("totalRevenue", revenue != null ? revenue : 0.0);

            result.add(map);
        }
        return result;
    }

    public List<ParkingLotResponse> getAllParkingLots() {
        return parkingLotRepository.findAll().stream()
                .map(this::mapToParkingLotResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParkingLotResponse toggleParkingLotStatus(Long lotId) {
        ParkingLot lot = parkingLotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + lotId));

        lot.setActive(!lot.isActive());
        return mapToParkingLotResponse(parkingLotRepository.save(lot));
    }

    public List<ParkingSlotResponse> getAllParkingSlots() {
        return parkingSlotRepository.findAll().stream()
                .map(this::mapToSlotResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        long totalParkingLots = parkingLotRepository.count();
        long totalSlots = parkingSlotRepository.count();

        analytics.put("totalRevenue", paymentRepository.calculateTotalSystemRevenue());
        analytics.put("totalBookings", bookingRepository.count());
        analytics.put("totalUsers", userRepository.countByRole(Role.USER));
        analytics.put("totalOwners", userRepository.countByRole(Role.OWNER));
        analytics.put("totalLots", totalParkingLots);
        analytics.put("totalParkingLots", totalParkingLots);
        analytics.put("totalSlots", totalSlots);

        // City distribution breakdown
        Map<String, Long> cityCount = parkingLotRepository.findAll().stream()
                .filter(p -> p.getCity() != null && !p.getCity().isBlank())
                .collect(Collectors.groupingBy(ParkingLot::getCity, Collectors.counting()));
        analytics.put("cityBreakdown", cityCount);

        // Vehicle distribution breakdown
        Map<String, Long> vehicleCount = parkingSlotRepository.findAll().stream()
                .filter(s -> s.getVehicleType() != null)
                .collect(Collectors.groupingBy(s -> s.getVehicleType().name(), Collectors.counting()));
        analytics.put("vehicleBreakdown", vehicleCount);

        // Category breakdown
        Map<String, Long> categoryCount = parkingLotRepository.findAll().stream()
                .collect(Collectors.groupingBy(p -> p.getCategory() != null ? p.getCategory() : "OTHER", Collectors.counting()));
        analytics.put("lotsByCategory", categoryCount);
        analytics.put("categoryBreakdown", categoryCount);

        return analytics;
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .vehicleNumber(user.getVehicleNumber())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private ParkingLotResponse mapToParkingLotResponse(ParkingLot lot) {
        return ParkingLotResponse.builder()
                .id(lot.getId())
                .name(lot.getName())
                .address(lot.getAddress())
                .city(lot.getCity())
                .state(lot.getState())
                .pincode(lot.getPincode())
                .parkingType(lot.getParkingType())
                .totalCapacity(lot.getEffectiveTotalCapacity())
                .occupiedSlots(lot.getOccupiedSlots())
                .reservedSlots(lot.getReservedSlots())
                .availableSlots(lot.getComputedAvailableSlots())
                .openingTime(lot.getOpeningTime())
                .closingTime(lot.getClosingTime())
                .hasEVCharging(lot.isHasEVCharging())
                .category(lot.getCategory())
                .nearbyDestination(lot.getNearbyDestination())
                .dataSource(lot.getDataSource())
                .externalSourceId(lot.getExternalSourceId())
                .lastOccupancyUpdate(lot.getLastOccupancyUpdate())
                .active(lot.isActive())
                .ownerId(lot.getOwner() != null ? lot.getOwner().getId() : null)
                .ownerName(lot.getOwner() != null ? lot.getOwner().getName() : "N/A")
                .ownerEmail(lot.getOwner() != null ? lot.getOwner().getEmail() : "N/A")
                .createdAt(lot.getCreatedAt())
                .build();
    }

    private ParkingSlotResponse mapToSlotResponse(ParkingSlot slot) {
        return ParkingSlotResponse.builder()
                .id(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .price(slot.getPrice())
                .size(slot.getSize())
                .vehicleType(slot.getVehicleType())
                .active(slot.isActive())
                .isAvailable(slot.isAvailable())
                .parkingLotId(slot.getParkingLot() != null ? slot.getParkingLot().getId() : null)
                .parkingLotName(slot.getParkingLot() != null ? slot.getParkingLot().getName() : "N/A")
                .build();
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
