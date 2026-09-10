package com.parkease.payment.service;

import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.exception.BadRequestException;
import com.parkease.exception.ForbiddenException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.payment.dto.PaymentRequest;
import com.parkease.payment.dto.PaymentResponse;
import com.parkease.payment.entity.Payment;
import com.parkease.payment.entity.PaymentMethod;
import com.parkease.payment.entity.PaymentStatus;
import com.parkease.payment.repository.PaymentRepository;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request, User currentUser) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (currentUser.getRole() != Role.ADMIN && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to process payment for this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled booking");
        }

        Optional<Payment> existingPayment = paymentRepository.findByBookingId(booking.getId());
        if (existingPayment.isPresent() && existingPayment.get().getStatus() == PaymentStatus.SUCCESS) {
            return mapToResponse(existingPayment.get());
        }

        String txnId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Payment payment = existingPayment.orElseGet(() -> Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .build());

        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.MOCK_INSTANT_PAY);
        payment.setTransactionId(txnId);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setGatewayResponse("Approved: Instant Confirmation Mock Gateway");
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment processed successfully for booking {} with txnId {}", booking.getId(), txnId);

        return mapToResponse(savedPayment);
    }

    public PaymentResponse getPaymentByBookingId(Long bookingId, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (currentUser.getRole() != Role.ADMIN && 
            currentUser.getRole() != Role.OWNER && 
            !booking.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to view this payment");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for booking id: " + bookingId));

        return mapToResponse(payment);
    }

    public List<PaymentResponse> getAllPayments(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return paymentRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } else if (currentUser.getRole() == Role.OWNER) {
            return paymentRepository.findByOwnerId(currentUser.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } else {
            return paymentRepository.findByUserId(currentUser.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
    }

    private PaymentResponse mapToResponse(Payment payment) {
        Booking booking = payment.getBooking();
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(booking.getId())
                .bookingReference("PE-" + String.format("%06d", booking.getId()))
                .userName(booking.getUser() != null ? booking.getUser().getName() : "N/A")
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : "N/A")
                .parkingLotName(booking.getParkingSlot() != null && booking.getParkingSlot().getParkingLot() != null ? booking.getParkingSlot().getParkingLot().getName() : "N/A")
                .slotNumber(booking.getParkingSlot() != null ? booking.getParkingSlot().getSlotNumber() : "N/A")
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .gatewayResponse(payment.getGatewayResponse())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
