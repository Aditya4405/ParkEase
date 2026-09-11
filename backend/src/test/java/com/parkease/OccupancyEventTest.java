package com.parkease;

import com.parkease.exception.BadRequestException;
import com.parkease.exception.ForbiddenException;
import com.parkease.parking.dto.OccupancyEventRequest;
import com.parkease.parking.dto.OccupancyEventResponse;
import com.parkease.parking.dto.ParkingLotAvailabilityResponse;
import com.parkease.parking.dto.ParkingLotRequest;
import com.parkease.parking.dto.ParkingLotResponse;
import com.parkease.parking.entity.OccupancyEventType;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class OccupancyEventTest {

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private UserRepository userRepository;

    private User lotOwner;
    private User regularUser;
    private ParkingLotResponse testLot;

    @BeforeEach
    void setup() {
        lotOwner = userRepository.save(User.builder()
                .name("Occupancy Operator")
                .email("occowner@example.com")
                .password("Password123")
                .role(Role.OWNER)
                .active(true)
                .build());

        regularUser = userRepository.save(User.builder()
                .name("Driver Person")
                .email("driver@example.com")
                .password("Password123")
                .role(Role.USER)
                .active(true)
                .build());

        ParkingLotRequest lotReq = ParkingLotRequest.builder()
                .name("Telemetry Test Complex")
                .address("Sector 18")
                .city("Noida")
                .pincode("201301")
                .totalCapacity(10)
                .build();

        testLot = parkingLotService.createParkingLot(lotReq, lotOwner);
    }

    @Test
    @DisplayName("Should successfully process ENTRY and EXIT events and update live availability")
    void testEntryAndExitTelemetry() {
        OccupancyEventRequest entryReq = OccupancyEventRequest.builder()
                .eventType(OccupancyEventType.ENTRY)
                .vehicleNumber("UP 16 AB 1000")
                .source("FASTAG_BOOM_BARRIER_1")
                .build();

        OccupancyEventResponse entryRes = parkingLotService.recordOccupancyEvent(testLot.getId(), entryReq, lotOwner);
        assertNotNull(entryRes);
        assertEquals(1, entryRes.getOccupiedSlots());
        assertEquals(9, entryRes.getAvailableSlots());

        // Check availability endpoint
        ParkingLotAvailabilityResponse avail = parkingLotService.getAvailability(testLot.getId());
        assertEquals(1, avail.getOccupiedSlots());
        assertEquals(9, avail.getAvailableSlots());
        assertEquals("AVAILABLE", avail.getOccupancyStatus());

        // Process EXIT
        OccupancyEventRequest exitReq = OccupancyEventRequest.builder()
                .eventType(OccupancyEventType.EXIT)
                .vehicleNumber("UP 16 AB 1000")
                .source("OPERATOR_CHECKOUT")
                .build();

        OccupancyEventResponse exitRes = parkingLotService.recordOccupancyEvent(testLot.getId(), exitReq, lotOwner);
        assertEquals(0, exitRes.getOccupiedSlots());
        assertEquals(10, exitRes.getAvailableSlots());
    }

    @Test
    @DisplayName("Should prevent EXIT when current occupied count is 0")
    void testInvalidExitWhenEmpty() {
        OccupancyEventRequest exitReq = OccupancyEventRequest.builder()
                .eventType(OccupancyEventType.EXIT)
                .vehicleNumber("UP 16 AB 9999")
                .build();

        assertThrows(BadRequestException.class, () -> {
            parkingLotService.recordOccupancyEvent(testLot.getId(), exitReq, lotOwner);
        });
    }

    @Test
    @DisplayName("Should prevent unauthorized regular user from recording operator telemetry events")
    void testUnauthorizedTelemetryRecording() {
        OccupancyEventRequest entryReq = OccupancyEventRequest.builder()
                .eventType(OccupancyEventType.ENTRY)
                .vehicleNumber("UP 16 AB 1000")
                .build();

        assertThrows(ForbiddenException.class, () -> {
            parkingLotService.recordOccupancyEvent(testLot.getId(), entryReq, regularUser);
        });
    }
}
