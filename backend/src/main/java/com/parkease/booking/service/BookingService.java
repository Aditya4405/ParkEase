package com.parkease.booking.service;

import com.parkease.booking.dto.AvailableSlotResponse;
import com.parkease.booking.dto.BookingRequest;
import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.exception.BadRequestException;
import com.parkease.exception.ConflictException;
import com.parkease.exception.ForbiddenException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.entity.VehicleType;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingSlotRepository;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;

    private static final Set<BookingStatus> ACTIVE_BOOKING_STATUSES = EnumSet.of(
            BookingStatus.RESERVED,
            BookingStatus.ACTIVE
    );

    @Transactional
    public BookingResponse createBooking(BookingRequest request, User currentUser) {
        LocalDateTime startTime = request.getStartTime().withNano(0);
        LocalDateTime endTime = request.getEndTime().withNano(0);

        if (startTime.isAfter(endTime) || startTime.isEqual(endTime)) {
            throw new BadRequestException("Start time must be before end time");
        }

        LocalDateTime now = LocalDateTime.now().withNano(0);
        if (startTime.isBefore(now.minusMinutes(5))) {
            throw new BadRequestException("Start time cannot be in the past");
        }

        ParkingLot lot = parkingLotRepository.findById(request.getParkingLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + request.getParkingLotId()));

        if (!lot.isActive()) {
            throw new BadRequestException("This parking lot is currently inactive");
        }

        ParkingSlot allocatedSlot;

        if (request.getParkingSlotId() != null) {
            allocatedSlot = parkingSlotRepository.findById(request.getParkingSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parking slot not found with id: " + request.getParkingSlotId()));

            if (!allocatedSlot.getParkingLot().getId().equals(lot.getId())) {
                throw new BadRequestException("The specified slot does not belong to the requested parking lot");
            }

            if (!allocatedSlot.isActive()) {
                throw new BadRequestException("The selected slot is currently inactive");
            }

            if (request.getVehicleType() != null && allocatedSlot.getVehicleType() != request.getVehicleType()) {
                throw new BadRequestException("Selected slot is configured for " + allocatedSlot.getVehicleType() + ", but requested " + request.getVehicleType());
            }

            List<Booking> conflicts = bookingRepository.findConflictingBookings(
                    allocatedSlot,
                    startTime,
                    endTime,
                    ACTIVE_BOOKING_STATUSES
            );

            if (!conflicts.isEmpty()) {
                throw new ConflictException("Slot " + allocatedSlot.getSlotNumber() + " is already booked for the overlapping time period (" +
                        startTime + " to " + endTime + ").");
            }
        } else {
            List<ParkingSlot> candidateSlots = parkingSlotRepository.findByParkingLotAndVehicleTypeAndActiveTrue(lot, request.getVehicleType());

            if (candidateSlots.isEmpty()) {
                throw new ResourceNotFoundException("No active parking slots found for vehicle type: " + request.getVehicleType());
            }

            List<Long> conflictingSlotIds = bookingRepository.findConflictingSlotIds(
                    lot.getId(),
                    startTime,
                    endTime,
                    ACTIVE_BOOKING_STATUSES
            );

            allocatedSlot = candidateSlots.stream()
                    .filter(slot -> !conflictingSlotIds.contains(slot.getId()))
                    .findFirst()
                    .orElseThrow(() -> new ConflictException("No slots available for " + request.getVehicleType() + " during the requested time period. Please select another time or vehicle type."));
        }

        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        double hours = Math.max(1.0, durationMinutes / 60.0);
        double totalPrice = Math.round(hours * allocatedSlot.getPrice() * 100.0) / 100.0;

        String vehicleNumber = request.getVehicleNumber();
        if (vehicleNumber == null || vehicleNumber.isBlank()) {
            vehicleNumber = currentUser.getVehicleNumber();
        }

        Booking booking = Booking.builder()
                .user(currentUser)
                .parkingSlot(allocatedSlot)
                .startTime(startTime)
                .endTime(endTime)
                .status(BookingStatus.RESERVED)
                .totalPrice(totalPrice)
                .vehicleNumber(vehicleNumber != null ? vehicleNumber.toUpperCase() : "N/A")
                .createdAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Update dynamic lot reservation capacity counter
        lot.setReservedSlots(lot.getReservedSlots() + 1);
        lot.setLastOccupancyUpdate(LocalDateTime.now());
        parkingLotRepository.save(lot);

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(User currentUser) {
        return bookingRepository.findByUserOrderByCreatedAtDesc(currentUser).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getOwnerBookings(User owner) {
        return bookingRepository.findByParkingSlot_ParkingLot_OwnerOrderByCreatedAtDesc(owner).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (currentUser.getRole() != Role.ADMIN
                && !booking.getUser().getId().equals(currentUser.getId())
                && !booking.getParkingSlot().getParkingLot().getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to view this booking");
        }

        return mapToBookingResponse(booking);
    }

    public BookingResponse getBookingVerification(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking pass not found with id: " + id));
        return mapToBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (currentUser.getRole() != Role.ADMIN && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed bookings cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        // Decrement dynamic lot reservation counter if applicable
        ParkingLot lot = booking.getParkingSlot().getParkingLot();
        if (lot != null && lot.getReservedSlots() > 0) {
            lot.setReservedSlots(lot.getReservedSlots() - 1);
            lot.setLastOccupancyUpdate(LocalDateTime.now());
            parkingLotRepository.save(lot);
        }

        return mapToBookingResponse(updated);
    }

    public List<AvailableSlotResponse> getAvailableSlots(
            Long lotId,
            VehicleType vehicleType,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        ParkingLot lot = parkingLotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + lotId));

        List<ParkingSlot> allSlots;
        if (vehicleType != null) {
            allSlots = parkingSlotRepository.findByParkingLotAndVehicleTypeAndActiveTrue(lot, vehicleType);
        } else {
            allSlots = parkingSlotRepository.findByParkingLotAndActiveTrue(lot);
        }

        List<Long> conflictingSlotIds = List.of();
        if (startTime != null && endTime != null) {
            if (startTime.isAfter(endTime) || startTime.isEqual(endTime)) {
                throw new BadRequestException("Start time must be before end time");
            }
            conflictingSlotIds = bookingRepository.findConflictingSlotIds(
                    lotId,
                    startTime,
                    endTime,
                    ACTIVE_BOOKING_STATUSES
            );
        }

        final List<Long> finalConflicts = conflictingSlotIds;

        return allSlots.stream()
                .map(slot -> AvailableSlotResponse.builder()
                        .id(slot.getId())
                        .slotNumber(slot.getSlotNumber())
                        .price(slot.getPrice())
                        .size(slot.getSize())
                        .vehicleType(slot.getVehicleType())
                        .available(!finalConflicts.contains(slot.getId()) && slot.isAvailable())
                        .parkingLotId(lot.getId())
                        .parkingLotName(lot.getName())
                        .build())
                .collect(Collectors.toList());
    }

    public BookingResponse mapToBookingResponse(Booking booking) {
        ParkingSlot slot = booking.getParkingSlot();
        ParkingLot lot = slot.getParkingLot();
        User user = booking.getUser();

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .userPhone(user.getPhone())
                .parkingLotId(lot.getId())
                .parkingLotName(lot.getName())
                .parkingLotAddress(lot.getAddress())
                .parkingLotCity(lot.getCity())
                .parkingSlotId(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .slotSize(slot.getSize())
                .vehicleType(slot.getVehicleType())
                .pricePerHour(slot.getPrice())
                .totalPrice(booking.getTotalPrice())
                .vehicleNumber(booking.getVehicleNumber())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
