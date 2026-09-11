package com.parkease;

import com.parkease.booking.dto.BookingRequest;
import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.service.BookingService;
import com.parkease.exception.ForbiddenException;
import com.parkease.parking.dto.ParkingLotRequest;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.dto.ParkingSlotRequest;
import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import com.parkease.parking.service.ParkingLotService;
import com.parkease.payment.dto.PaymentRequest;
import com.parkease.payment.dto.PaymentResponse;
import com.parkease.payment.entity.PaymentMethod;
import com.parkease.payment.entity.PaymentStatus;
import com.parkease.payment.service.PaymentService;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PaymentServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private User testOwner;
    private User anotherUser;
    private ParkingLotResponse testLot;
    private BookingResponse testBooking;

    @BeforeEach
    void setup() {
        testOwner = userRepository.save(User.builder()
                .name("Payment Test Owner")
                .email("payowner@example.com")
                .password("Password123")
                .role(Role.OWNER)
                .active(true)
                .build());

        testUser = userRepository.save(User.builder()
                .name("Payment Test User")
                .email("payuser@example.com")
                .password("Password123")
                .role(Role.USER)
                .active(true)
                .vehicleNumber("UP 32 PAY 0001")
                .build());

        anotherUser = userRepository.save(User.builder()
                .name("Another User")
                .email("another@example.com")
                .password("Password123")
                .role(Role.USER)
                .active(true)
                .vehicleNumber("DL 01 AB 1111")
                .build());

        ParkingLotRequest lotReq = ParkingLotRequest.builder()
                .name("Payment Test Plaza")
                .address("101 Gomti Nagar")
                .city("Lucknow")
                .pincode("226010")
                .initialSlots(List.of(
                        ParkingSlotRequest.builder()
                                .slotNumber("PAY-C1")
                                .price(50.0)
                                .size(SlotSize.MEDIUM)
                                .vehicleType(VehicleType.CAR)
                                .active(true)
                                .isAvailable(true)
                                .build()
                ))
                .build();

        testLot = parkingLotService.createParkingLot(lotReq, testOwner);

        BookingRequest bookingReq = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0))
                .endTime(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0).withSecond(0))
                .build();

        testBooking = bookingService.createBooking(bookingReq, testUser);
    }

    @Test
    @DisplayName("Should successfully process prototype payment and return transaction ID")
    void testProcessPaymentSuccess() {
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .bookingId(testBooking.getId())
                .paymentMethod(PaymentMethod.UPI)
                .build();

        PaymentResponse response = paymentService.processPayment(paymentRequest, testUser);

        assertNotNull(response);
        assertEquals(testBooking.getId(), response.getBookingId());
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals(100.0, response.getAmount()); // 2 hours * 50.0 = 100.0
        assertNotNull(response.getTransactionId());
        assertTrue(response.getTransactionId().startsWith("TXN-"));
    }

    @Test
    @DisplayName("Should prevent unauthorized user from paying for another user's booking")
    void testUnauthorizedPayment() {
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .bookingId(testBooking.getId())
                .paymentMethod(PaymentMethod.CREDIT_DEBIT_CARD)
                .build();

        assertThrows(ForbiddenException.class, () -> {
            paymentService.processPayment(paymentRequest, anotherUser);
        });
    }

    @Test
    @DisplayName("Should handle payment idempotency when already paid")
    void testPaymentIdempotency() {
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .bookingId(testBooking.getId())
                .paymentMethod(PaymentMethod.UPI)
                .build();

        PaymentResponse first = paymentService.processPayment(paymentRequest, testUser);
        PaymentResponse second = paymentService.processPayment(paymentRequest, testUser);

        assertEquals(first.getTransactionId(), second.getTransactionId());
        assertEquals(PaymentStatus.SUCCESS, second.getStatus());
    }
}
