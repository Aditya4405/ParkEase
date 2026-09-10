package com.parkease.parking.repository;

import com.parkease.parking.entity.ParkingOccupancyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingOccupancyEventRepository extends JpaRepository<ParkingOccupancyEvent, Long> {
    List<ParkingOccupancyEvent> findTop20ByParkingLotIdOrderByTimestampDesc(Long parkingLotId);
    List<ParkingOccupancyEvent> findByParkingLotIdOrderByTimestampDesc(Long parkingLotId);
}
