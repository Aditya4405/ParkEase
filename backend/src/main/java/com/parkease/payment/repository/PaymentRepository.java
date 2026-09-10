package com.parkease.payment.repository;

import com.parkease.payment.entity.Payment;
import com.parkease.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.booking.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Payment p WHERE p.booking.parkingSlot.parkingLot.owner.id = :ownerId ORDER BY p.createdAt DESC")
    List<Payment> findByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double calculateTotalSystemRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.booking.parkingSlot.parkingLot.owner.id = :ownerId")
    Double calculateTotalOwnerRevenue(@Param("ownerId") Long ownerId);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.booking.parkingSlot.parkingLot.owner.id = :ownerId AND p.createdAt >= :startDate")
    Double calculateOwnerRevenueSince(@Param("ownerId") Long ownerId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.booking.user.id = :userId")
    Double calculateTotalUserSpent(@Param("userId") Long userId);
}
