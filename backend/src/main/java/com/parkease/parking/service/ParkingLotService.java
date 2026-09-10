package com.parkease.parking.service;

import com.parkease.exception.ConflictException;
import com.parkease.exception.ForbiddenException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.parking.dto.ParkingLotRequest;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.dto.ParkingSlotRequest;
import com.parkease.parking.dto.ParkingSlotResponse;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.repository.ParkingLotRepository;
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

    public List<ParkingLotResponse> searchParkingLots(String city, String search) {
        String trimmedCity = (city != null && !city.isBlank()) ? city.trim() : null;
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        List<ParkingLot> lots;
        if (trimmedCity == null && trimmedSearch == null) {
            lots = parkingLotRepository.findByActiveTrue();
        } else {
            lots = parkingLotRepository.searchParkingLots(trimmedCity, trimmedSearch);
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
                .pincode(request.getPincode().trim())
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
        lot.setPincode(request.getPincode().trim());
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
        int totalSlots = slots.size();
        int availableSlots = (int) slots.stream().filter(s -> s.isActive() && s.isAvailable()).count();
        Double startingPrice = slots.stream()
                .filter(ParkingSlot::isActive)
                .map(ParkingSlot::getPrice)
                .min(Double::compareTo)
                .orElse(0.0);

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
                .pincode(lot.getPincode())
                .active(lot.isActive())
                .ownerId(lot.getOwner().getId())
                .ownerName(lot.getOwner().getName())
                .ownerEmail(lot.getOwner().getEmail())
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .startingPrice(startingPrice)
                .slots(slotResponses)
                .createdAt(lot.getCreatedAt())
                .build();
    }
}
