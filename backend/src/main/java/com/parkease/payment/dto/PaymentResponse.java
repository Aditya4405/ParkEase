package com.parkease.payment.dto;

import com.parkease.payment.entity.PaymentMethod;
import com.parkease.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long bookingId;
    private String bookingReference;
    private String userName;
    private String userEmail;
    private String parkingLotName;
    private String slotNumber;
    private Double amount;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private PaymentStatus status;
    private String gatewayResponse;
    private LocalDateTime createdAt;
}
