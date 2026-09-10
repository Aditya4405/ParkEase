package com.parkease.payment.controller;

import com.parkease.payment.dto.PaymentRequest;
import com.parkease.payment.dto.PaymentResponse;
import com.parkease.payment.service.PaymentService;
import com.parkease.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "Endpoints for booking payment processing and transaction ledgers")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @Operation(summary = "Process/confirm payment for a booking")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(paymentService.processPayment(request, currentUser));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment transaction details by booking ID")
    public ResponseEntity<PaymentResponse> getPaymentByBookingId(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId, currentUser));
    }

    @GetMapping
    @Operation(summary = "Get payment history based on user role (Admin: All, Owner: Owned, User: Personal)")
    public ResponseEntity<List<PaymentResponse>> getPayments(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(paymentService.getAllPayments(currentUser));
    }
}
