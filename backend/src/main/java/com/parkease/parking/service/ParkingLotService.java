package com.parkease.parking.service;

import com.parkease.exception.BadRequestException;
import com.parkease.exception.ForbiddenException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.parking.dto.*;
import com.parkease.parking.entity.OccupancyEventType;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingOccupancyEvent;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingOccupancyEventRepository;
import com.parkease.parking.repository.ParkingSlotRepository;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingLotService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final ParkingOccupancyEventRepository occupancyEventRepository;

    public List<ParkingLotResponse> searchParkingLots(String city, String search, String category) {
        String trimmedCity = (city != null && !city.isBlank()) ? city.trim() : null;
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String trimmedCategory = (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;

        List<ParkingLot> lots;
        if (trimmedCity == null && trimmedSearch == null && trimmedCategory == null) {
            lots = parkingLotRepository.findByActiveTrue();
        } else {
            lots = parkingLotRepository.searchParkingLots(trimmedCity, trimmedSearch, trimmedCategory);
        }
        return lots.stream().map(this::mapToParkingLotResponse).collect(Collectors.toList());
    }

    public List<ParkingLotResponse> getAllActiveParkingLots() {
        return parkingLotRepository.findByActiveTrue().stream()
                .map(this::mapToParkingLotResponse)
                .collect(Collectors.toList());
    }

    public ParkingLotResponse getParkingLotById(Long id) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + id));
        return mapToParkingLotResponse(lot);
    }

    public List<ParkingLotResponse> getParkingLotsByOwner(User owner) {
        return parkingLotRepository.findByOwner(owner).stream()
                .map(this::mapToParkingLotResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParkingLotResponse createParkingLot(ParkingLotRequest request, User currentUser) {
        ParkingLot lot = ParkingLot.builder()
                .name(request.getName().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState() != null && !request.getState().isBlank() ? request.getState().trim() : "Uttar Pradesh")
                .pincode(request.getPincode().trim())
                .parkingType(request.getParkingType() != null && !request.getParkingType().isBlank() ? request.getParkingType().trim() : "Multi-Level Covered")
                .totalCapacity(request.getTotalCapacity() != null && request.getTotalCapacity() > 0 ? request.getTotalCapacity() : 100)
                .occupiedSlots(0)
                .reservedSlots(0)
                .openingTime(request.getOpeningTime() != null && !request.getOpeningTime().isBlank() ? request.getOpeningTime().trim() : "08:00 AM")
                .closingTime(request.getClosingTime() != null && !request.getClosingTime().isBlank() ? request.getClosingTime().trim() : "11:00 PM")
                .hasEVCharging(request.getHasEVCharging() != null ? request.getHasEVCharging() : true)
                .category(request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory().trim().toUpperCase() : "MALL")
                .nearbyDestination(request.getNearbyDestination() != null ? request.getNearbyDestination().trim() : null)
                .dataSource(request.getDataSource() != null && !request.getDataSource().isBlank() ? request.getDataSource().trim() : "OPERATOR_PORTAL")
                .externalSourceId(request.getExternalSourceId())
                .lastOccupancyUpdate(LocalDateTime.now())
                .active(request.getActive() != null ? request.getActive() : true)
                .owner(currentUser)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        if (request.getInitialSlots() != null && !request.getInitialSlots().isEmpty()) {
            for (ParkingSlotRequest slotReq : request.getInitialSlots()) {
                ParkingSlot slot = ParkingSlot.builder()
                        .slotNumber(slotReq.getSlotNumber().trim().toUpperCase())
                        .price(slotReq.getPrice())
                        .size(slotReq.getSize())
                        .vehicleType(slotReq.getVehicleType())
                        .active(slotReq.getActive() != null ? slotReq.getActive() : true)
                        .isAvailable(slotReq.getIsAvailable() != null ? slotReq.getIsAvailable() : true)
                        .parkingLot(lot)
                        .build();
                lot.getSlots().add(slot);
            }
            if (request.getTotalCapacity() == null || request.getTotalCapacity() <= 0) {
                lot.setTotalCapacity(Math.max(100, lot.getSlots().size()));
            }
        }

        ParkingLot savedLot = parkingLotRepository.save(lot);
        return mapToParkingLotResponse(savedLot);
    }

    @Transactional
    public ParkingLotResponse updateParkingLot(Long id, ParkingLotRequest request, User currentUser) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + id));

        verifyOwnerOrAdmin(lot, currentUser);

        lot.setName(request.getName().trim());
        lot.setAddress(request.getAddress().trim());
        lot.setCity(request.getCity().trim());
        if (request.getState() != null) lot.setState(request.getState().trim());
        lot.setPincode(request.getPincode().trim());
        if (request.getParkingType() != null) lot.setParkingType(request.getParkingType().trim());
        if (request.getTotalCapacity() != null && request.getTotalCapacity() > 0) lot.setTotalCapacity(request.getTotalCapacity());
        if (request.getOpeningTime() != null) lot.setOpeningTime(request.getOpeningTime().trim());
        if (request.getClosingTime() != null) lot.setClosingTime(request.getClosingTime().trim());
        if (request.getHasEVCharging() != null) lot.setHasEVCharging(request.getHasEVCharging());
        if (request.getCategory() != null) lot.setCategory(request.getCategory().trim().toUpperCase());
        if (request.getNearbyDestination() != null) lot.setNearbyDestination(request.getNearbyDestination().trim());
        if (request.getActive() != null) {
            lot.setActive(request.getActive());
        }

        ParkingLot updated = parkingLotRepository.save(lot);
        return mapToParkingLotResponse(updated);
    }

    @Transactional
    public void deleteParkingLot(Long id, User currentUser) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + id));

        verifyOwnerOrAdmin(lot, currentUser);
        parkingLotRepository.delete(lot);
    }

    // -------------------------------------------------------------
    // Real-Time Occupancy Telemetry & Event System
    // -------------------------------------------------------------
    @Transactional
    public OccupancyEventResponse recordOccupancyEvent(Long parkingLotId, OccupancyEventRequest request, User operator) {
        ParkingLot lot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + parkingLotId));

        verifyOwnerOrAdmin(lot, operator);

        int capacity = lot.getEffectiveTotalCapacity();
        int currentOccupied = lot.getOccupiedSlots();
        int currentReserved = lot.getReservedSlots();

        String vehicleNo = (request.getVehicleNumber() != null && !request.getVehicleNumber().isBlank())
                ? request.getVehicleNumber().trim().toUpperCase()
                : "UP32-DEMO-" + (int)(Math.random() * 9000 + 1000);

        String message;

        if (request.getEventType() == OccupancyEventType.ENTRY) {
            if (currentOccupied + currentReserved >= capacity) {
                throw new BadRequestException("Cannot process ENTRY: Parking facility is at maximum capacity (" + capacity + " slots full/reserved).");
            }
            currentOccupied += 1;
            lot.setOccupiedSlots(currentOccupied);
            message = "Vehicle ENTRY registered for " + vehicleNo + ". Live vacancy updated.";
        } else if (request.getEventType() == OccupancyEventType.EXIT) {
            if (currentOccupied <= 0) {
                throw new BadRequestException("Cannot process EXIT: Current occupied count is already 0.");
            }
            currentOccupied -= 1;
            lot.setOccupiedSlots(currentOccupied);
            message = "Vehicle EXIT registered for " + vehicleNo + ". Live vacancy updated.";
        } else {
            throw new BadRequestException("Invalid occupancy event type: " + request.getEventType());
        }

        lot.setLastOccupancyUpdate(LocalDateTime.now());
        parkingLotRepository.save(lot);

        ParkingOccupancyEvent event = ParkingOccupancyEvent.builder()
                .parkingLotId(parkingLotId)
                .eventType(request.getEventType())
                .vehicleNumber(vehicleNo)
                .source(request.getSource() != null ? request.getSource() : "DEMO_OPERATOR")
                .timestamp(LocalDateTime.now())
                .processed(true)
                .build();

        ParkingOccupancyEvent savedEvent = occupancyEventRepository.save(event);

        int computedAvailable = Math.max(0, capacity - currentOccupied - currentReserved);

        return OccupancyEventResponse.builder()
                .id(savedEvent.getId())
                .parkingLotId(lot.getId())
                .parkingLotName(lot.getName())
                .eventType(savedEvent.getEventType())
                .vehicleNumber(savedEvent.getVehicleNumber())
                .timestamp(savedEvent.getTimestamp())
                .source(savedEvent.getSource())
                .processed(savedEvent.isProcessed())
                .totalCapacity(capacity)
                .occupiedSlots(currentOccupied)
                .reservedSlots(currentReserved)
                .availableSlots(computedAvailable)
                .message(message)
                .build();
    }

    public List<ParkingOccupancyEvent> getOccupancyEvents(Long parkingLotId, User currentUser) {
        ParkingLot lot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + parkingLotId));
        verifyOwnerOrAdmin(lot, currentUser);
        return occupancyEventRepository.findTop20ByParkingLotIdOrderByTimestampDesc(parkingLotId);
    }

    public ParkingLotAvailabilityResponse getAvailability(Long parkingLotId) {
        ParkingLot lot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + parkingLotId));

        int capacity = lot.getEffectiveTotalCapacity();
        int available = lot.getComputedAvailableSlots();
        String status;
        if (available <= 0) {
            status = "FULL";
        } else if (available <= Math.max(2, (int)(capacity * 0.15))) {
            status = "LIMITED";
        } else {
            status = "AVAILABLE";
        }

        return ParkingLotAvailabilityResponse.builder()
                .parkingLotId(lot.getId())
                .name(lot.getName())
                .city(lot.getCity())
                .category(lot.getCategory())
                .nearbyDestination(lot.getNearbyDestination())
                .totalCapacity(capacity)
                .occupiedSlots(lot.getOccupiedSlots())
                .reservedSlots(lot.getReservedSlots())
                .availableSlots(available)
                .occupancyStatus(status)
                .lastUpdated(lot.getLastOccupancyUpdate() != null ? lot.getLastOccupancyUpdate() : lot.getCreatedAt())
                .dataSource(lot.getDataSource())
                .build();
    }

    public void verifyOwnerOrAdmin(ParkingLot lot, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (!lot.getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to modify this parking lot");
        }
    }

    public ParkingLotResponse mapToParkingLotResponse(ParkingLot lot) {
        List<ParkingSlot> slots = lot.getSlots() != null ? lot.getSlots() : List.of();
        int totalCapacity = lot.getEffectiveTotalCapacity();
        int availableSlots = lot.getComputedAvailableSlots();

        Double startingPrice = slots.stream()
                .filter(ParkingSlot::isActive)
                .map(ParkingSlot::getPrice)
                .min(Double::compareTo)
                .orElse(20.0);

        List<ParkingSlotResponse> slotResponses = slots.stream()
                .map(s -> ParkingSlotResponse.builder()
                        .id(s.getId())
                        .slotNumber(s.getSlotNumber())
                        .price(s.getPrice())
                        .size(s.getSize())
                        .vehicleType(s.getVehicleType())
                        .active(s.isActive())
                        .isAvailable(s.isAvailable())
                        .parkingLotId(lot.getId())
                        .parkingLotName(lot.getName())
                        .build())
                .collect(Collectors.toList());

        return ParkingLotResponse.builder()
                .id(lot.getId())
                .name(lot.getName())
                .address(lot.getAddress())
                .city(lot.getCity())
                .state(lot.getState() != null ? lot.getState() : "Uttar Pradesh")
                .pincode(lot.getPincode())
                .parkingType(lot.getParkingType() != null ? lot.getParkingType() : "Multi-Level Covered")
                .totalCapacity(totalCapacity)
                .totalSlots(totalCapacity)
                .occupiedSlots(lot.getOccupiedSlots())
                .reservedSlots(lot.getReservedSlots())
                .availableSlots(availableSlots)
                .openingTime(lot.getOpeningTime() != null ? lot.getOpeningTime() : "08:00 AM")
                .closingTime(lot.getClosingTime() != null ? lot.getClosingTime() : "11:00 PM")
                .hasEVCharging(lot.isHasEVCharging())
                .category(lot.getCategory() != null ? lot.getCategory() : "MALL")
                .nearbyDestination(lot.getNearbyDestination())
                .dataSource(lot.getDataSource() != null ? lot.getDataSource() : "OPENSTREETMAP")
                .externalSourceId(lot.getExternalSourceId())
                .lastOccupancyUpdate(lot.getLastOccupancyUpdate() != null ? lot.getLastOccupancyUpdate() : lot.getCreatedAt())
                .active(lot.isActive())
                .ownerId(lot.getOwner() != null ? lot.getOwner().getId() : null)
                .ownerName(lot.getOwner() != null ? lot.getOwner().getName() : "Verified Operator")
                .ownerEmail(lot.getOwner() != null ? lot.getOwner().getEmail() : "operator@parkease.com")
                .startingPrice(startingPrice)
                .slots(slotResponses)
                .createdAt(lot.getCreatedAt())
                .build();
    }
}
