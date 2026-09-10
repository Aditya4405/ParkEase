package com.parkease.parking.service;

import com.parkease.exception.ConflictException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.parking.dto.ParkingSlotRequest;
import com.parkease.parking.dto.ParkingSlotResponse;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingSlotRepository;
import com.parkease.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingLotService parkingLotService;

    public List<ParkingSlotResponse> getSlotsByLotId(Long lotId) {
        ParkingLot lot = parkingLotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + lotId));
        return parkingSlotRepository.findByParkingLot(lot).stream()
                .map(this::mapToParkingSlotResponse)
                .collect(Collectors.toList());
    }

    public ParkingSlotResponse getSlotById(Long id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking slot not found with id: " + id));
        return mapToParkingSlotResponse(slot);
    }

    @Transactional
    public ParkingSlotResponse addSlotToLot(Long lotId, ParkingSlotRequest request, User currentUser) {
        ParkingLot lot = parkingLotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking lot not found with id: " + lotId));

        parkingLotService.verifyOwnerOrAdmin(lot, currentUser);

        String slotNumber = request.getSlotNumber().trim().toUpperCase();
        if (parkingSlotRepository.existsByParkingLotAndSlotNumber(lot, slotNumber)) {
            throw new ConflictException("Slot number '" + slotNumber + "' already exists in this parking lot");
        }

        ParkingSlot slot = ParkingSlot.builder()
                .slotNumber(slotNumber)
                .price(request.getPrice())
                .size(request.getSize())
                .vehicleType(request.getVehicleType())
                .active(request.getActive() != null ? request.getActive() : true)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .parkingLot(lot)
                .build();

        ParkingSlot saved = parkingSlotRepository.save(slot);
        return mapToParkingSlotResponse(saved);
    }

    @Transactional
    public ParkingSlotResponse updateSlot(Long id, ParkingSlotRequest request, User currentUser) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking slot not found with id: " + id));

        parkingLotService.verifyOwnerOrAdmin(slot.getParkingLot(), currentUser);

        String slotNumber = request.getSlotNumber().trim().toUpperCase();
        if (!slot.getSlotNumber().equalsIgnoreCase(slotNumber)
                && parkingSlotRepository.existsByParkingLotAndSlotNumber(slot.getParkingLot(), slotNumber)) {
            throw new ConflictException("Slot number '" + slotNumber + "' already exists in this parking lot");
        }

        slot.setSlotNumber(slotNumber);
        slot.setPrice(request.getPrice());
        slot.setSize(request.getSize());
        slot.setVehicleType(request.getVehicleType());
        if (request.getActive() != null) {
            slot.setActive(request.getActive());
        }
        if (request.getIsAvailable() != null) {
            slot.setAvailable(request.getIsAvailable());
        }

        ParkingSlot updated = parkingSlotRepository.save(slot);
        return mapToParkingSlotResponse(updated);
    }

    @Transactional
    public void deleteSlot(Long id, User currentUser) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking slot not found with id: " + id));

        parkingLotService.verifyOwnerOrAdmin(slot.getParkingLot(), currentUser);
        parkingSlotRepository.delete(slot);
    }

    public ParkingSlotResponse mapToParkingSlotResponse(ParkingSlot slot) {
        return ParkingSlotResponse.builder()
                .id(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .price(slot.getPrice())
                .size(slot.getSize())
                .vehicleType(slot.getVehicleType())
                .active(slot.isActive())
                .isAvailable(slot.isAvailable())
                .parkingLotId(slot.getParkingLot().getId())
                .parkingLotName(slot.getParkingLot().getName())
                .build();
    }
}
