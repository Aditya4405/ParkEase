package com.parkease.user.repository;

import com.parkease.user.entity.OwnerApplication;
import com.parkease.user.entity.OwnerApplicationStatus;
import com.parkease.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerApplicationRepository extends JpaRepository<OwnerApplication, Long> {

    List<OwnerApplication> findByUserOrderBySubmittedAtDesc(User user);

    Optional<OwnerApplication> findTopByUserOrderBySubmittedAtDesc(User user);

    boolean existsByUserAndStatusIn(User user, List<OwnerApplicationStatus> statuses);

    List<OwnerApplication> findAllByOrderBySubmittedAtDesc();

    List<OwnerApplication> findByStatusOrderBySubmittedAtDesc(OwnerApplicationStatus status);

    long countByStatus(OwnerApplicationStatus status);

    @Query("SELECT a FROM OwnerApplication a JOIN FETCH a.user u " +
           "WHERE (:status IS NULL OR a.status = :status) " +
           "AND (:search IS NULL OR LOWER(a.businessName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(a.parkingName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(a.city) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.submittedAt DESC")
    List<OwnerApplication> searchApplications(@Param("status") OwnerApplicationStatus status, @Param("search") String search);
}
