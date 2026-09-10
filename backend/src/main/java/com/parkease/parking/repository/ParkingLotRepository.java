package com.parkease.parking.repository;

import com.parkease.parking.entity.ParkingLot;
import com.parkease.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
    List<ParkingLot> findByOwner(User owner);
    List<ParkingLot> findByActiveTrue();

    @Query("SELECT p FROM ParkingLot p WHERE p.active = true AND " +
            "(:city IS NULL OR :city = '' OR LOWER(p.city) LIKE LOWER(CONCAT('%', CAST(:city AS string), '%'))) AND " +
            "(:category IS NULL OR :category = '' OR UPPER(p.category) = UPPER(CAST(:category AS string))) AND " +
            "(:search IS NULL OR :search = '' OR " +
            " LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            " LOWER(p.address) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            " LOWER(p.city) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            " (p.nearbyDestination IS NOT NULL AND LOWER(p.nearbyDestination) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))))")
    List<ParkingLot> searchParkingLots(
            @Param("city") String city,
            @Param("search") String search,
            @Param("category") String category
    );

    long countByOwner(User owner);
    long countByActiveTrue();
}
