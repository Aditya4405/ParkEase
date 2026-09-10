package com.parkease.parking.repository;

import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByParkingLot(ParkingLot parkingLot);
    List<ParkingSlot> findByParkingLotAndActiveTrue(ParkingLot parkingLot);
    List<ParkingSlot> findByParkingLotAndVehicleTypeAndActiveTrue(ParkingLot parkingLot, VehicleType vehicleType);
    Optional<ParkingSlot> findByParkingLotAndSlotNumber(ParkingLot parkingLot, String slotNumber);
    boolean existsByParkingLotAndSlotNumber(ParkingLot parkingLot, String slotNumber);
    long countByParkingLot(ParkingLot parkingLot);
    long countByActiveTrueAndIsAvailableTrue();
}
