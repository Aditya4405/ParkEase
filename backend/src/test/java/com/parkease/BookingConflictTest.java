package com.parkease;

import com.parkease.booking.dto.BookingRequest;
import com.parkease.booking.dto.BookingResponse;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.service.BookingService;
import com.parkease.exception.ConflictException;
import com.parkease.parking.dto.ParkingLotRequest;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.dto.ParkingSlotRequest;
import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import com.parkease.parking.service.ParkingLotService;
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
public class BookingConflictTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private User testOwner;
    private ParkingLotResponse testLot;

    @BeforeEach
    void setup() {
        testOwner = userRepository.save(User.builder()
                .name("Test Owner")
                .email("testowner@example.com")
                .password("Password123")
                .role(Role.OWNER)
                .active(true)
                .build());

        testUser = userRepository.save(User.builder()
                .name("Test Customer")
                .email("testcustomer@example.com")
                .password("Password123")
                .role(Role.USER)
                .active(true)
                .vehicleNumber("TEST-9900")
                .build());

        // Create lot with only 1 CAR slot
        ParkingLotRequest lotReq = ParkingLotRequest.builder()
                .name("Single Slot Garage")
                .address("100 Test St")
                .city("Test City")
                .pincode("12345")
                .initialSlots(List.of(
                        ParkingSlotRequest.builder()
                                .slotNumber("SLOT-1")
                                .price(10.0)
                                .size(SlotSize.MEDIUM)
                                .vehicleType(VehicleType.CAR)
                                .active(true)
                                .isAvailable(true)
                                .build()
                ))
                .build();

        testLot = parkingLotService.createParkingLot(lotReq, testOwner);
    }

    @Test
    @DisplayName("Should create booking and reject overlapping time request on the same slot")
    void testBookingOverlapConflict() {
        LocalDateTime baseTime = LocalDateTime.now().plusDays(2).withHour(10).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime initialEnd = baseTime.plusHours(2); // 10:00 - 12:00

        BookingRequest firstBooking = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(baseTime)
                .endTime(initialEnd)
                .build();

        BookingResponse response1 = bookingService.createBooking(firstBooking, testUser);
        assertNotNull(response1);
        assertEquals(BookingStatus.RESERVED, response1.getStatus());

        // Overlapping request: 11:00 - 13:00 (overlaps with 10:00 - 12:00)
        BookingRequest overlappingBooking = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(baseTime.plusHours(1))
                .endTime(initialEnd.plusHours(1))
                .build();

        assertThrows(ConflictException.class, () -> {
            bookingService.createBooking(overlappingBooking, testUser);
        });

        // Non-overlapping request: 12:00 - 14:00 (starts right after initialEnd)
        BookingRequest nonOverlappingBooking = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(initialEnd)
                .endTime(initialEnd.plusHours(2))
                .build();

        BookingResponse response2 = bookingService.createBooking(nonOverlappingBooking, testUser);
        assertNotNull(response2);
        assertEquals(BookingStatus.RESERVED, response2.getStatus());
    }

    @Test
    @DisplayName("Should cancel booking successfully and change status to CANCELLED")
    void testCancelBooking() {
        LocalDateTime baseTime = LocalDateTime.now().plusDays(3).withHour(14).withMinute(0).withSecond(0);

        BookingRequest bookingReq = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(baseTime)
                .endTime(baseTime.plusHours(2))
                .build();

        BookingResponse booking = bookingService.createBooking(bookingReq, testUser);
        assertEquals(BookingStatus.RESERVED, booking.getStatus());

        BookingResponse cancelled = bookingService.cancelBooking(booking.getId(), testUser);
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());
    }

    @Test
    @DisplayName("Should verify digital booking ticket pass successfully")
    void testVerifyBookingPass() {
        LocalDateTime baseTime = LocalDateTime.now().plusDays(4).withHour(16).withMinute(0).withSecond(0);

        BookingRequest bookingReq = BookingRequest.builder()
                .parkingLotId(testLot.getId())
                .parkingSlotId(testLot.getSlots().get(0).getId())
                .vehicleType(VehicleType.CAR)
                .startTime(baseTime)
                .endTime(baseTime.plusHours(2))
                .build();

        BookingResponse booking = bookingService.createBooking(bookingReq, testUser);
        BookingResponse verified = bookingService.getBookingVerification(booking.getId());

        assertNotNull(verified);
        assertEquals(booking.getId(), verified.getId());
        assertEquals(testLot.getName(), verified.getParkingLotName());
    }
}
