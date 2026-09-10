package com.parkease.booking.repository;

import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    List<Booking> findByParkingSlot_ParkingLot_OwnerOrderByCreatedAtDesc(User owner);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Booking b WHERE b.parkingSlot = :slot " +
            "AND b.status IN :activeStatuses " +
            "AND b.startTime < :requestedEndTime " +
            "AND b.endTime > :requestedStartTime")
    List<Booking> findConflictingBookings(
            @Param("slot") ParkingSlot slot,
            @Param("requestedStartTime") LocalDateTime requestedStartTime,
            @Param("requestedEndTime") LocalDateTime requestedEndTime,
            @Param("activeStatuses") Collection<BookingStatus> activeStatuses
    );

    @Query("SELECT b.parkingSlot.id FROM Booking b WHERE b.parkingSlot.parkingLot.id = :parkingLotId " +
            "AND b.status IN :activeStatuses " +
            "AND b.startTime < :requestedEndTime " +
            "AND b.endTime > :requestedStartTime")
    List<Long> findConflictingSlotIds(
            @Param("parkingLotId") Long parkingLotId,
            @Param("requestedStartTime") LocalDateTime requestedStartTime,
            @Param("requestedEndTime") LocalDateTime requestedEndTime,
            @Param("activeStatuses") Collection<BookingStatus> activeStatuses
    );

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b WHERE b.parkingSlot.parkingLot.owner = :owner AND b.status IN :statuses")
    Double sumRevenueByOwner(
            @Param("owner") User owner,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b WHERE b.status IN :statuses")
    Double sumTotalSystemRevenue(@Param("statuses") Collection<BookingStatus> statuses);
}
