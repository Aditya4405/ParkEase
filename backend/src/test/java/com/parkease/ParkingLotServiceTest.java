package com.parkease;

import com.parkease.exception.ForbiddenException;
import com.parkease.parking.dto.ParkingLotRequest;
import com.parkease.parking.dto.ParkingLotResponse;
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
public class ParkingLotServiceTest {

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private UserRepository userRepository;

    private User owner1;
    private User owner2;
    private User admin;

    @BeforeEach
    void setup() {
        owner1 = userRepository.save(User.builder()
                .name("Owner One")
                .email("ownerone@example.com")
                .password("Password123")
                .role(Role.OWNER)
                .active(true)
                .build());

        owner2 = userRepository.save(User.builder()
                .name("Owner Two")
                .email("ownertwo@example.com")
                .password("Password123")
                .role(Role.OWNER)
                .active(true)
                .build());

        admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("adminuser@example.com")
                .password("Password123")
                .role(Role.ADMIN)
                .active(true)
                .build());
    }

    @Test
    @DisplayName("Owner should create and manage their own parking lot")
    void testOwnerCreateLot() {
        ParkingLotRequest request = ParkingLotRequest.builder()
                .name("Owner 1 Parking Garage")
                .address("123 Main St")
                .city("Boston")
                .pincode("02108")
                .build();

        ParkingLotResponse created = parkingLotService.createParkingLot(request, owner1);
        assertNotNull(created);
        assertEquals("Owner 1 Parking Garage", created.getName());
        assertEquals(owner1.getId(), created.getOwnerId());
    }

    @Test
    @DisplayName("Another owner modifying foreign lot should throw ForbiddenException")
    void testUnauthorizedOwnerModificationFails() {
        ParkingLotRequest request = ParkingLotRequest.builder()
                .name("Owner 1 Parking Garage")
                .address("123 Main St")
                .city("Boston")
                .pincode("02108")
                .build();

        ParkingLotResponse created = parkingLotService.createParkingLot(request, owner1);

        ParkingLotRequest updateRequest = ParkingLotRequest.builder()
                .name("Hacked Name")
                .address("Hacked Address")
                .city("Boston")
                .pincode("02108")
                .build();

        assertThrows(ForbiddenException.class, () -> {
            parkingLotService.updateParkingLot(created.getId(), updateRequest, owner2);
        });
    }

    @Test
    @DisplayName("Admin should be allowed to modify any parking lot")
    void testAdminCanModifyAnyLot() {
        ParkingLotRequest request = ParkingLotRequest.builder()
                .name("Owner 1 Parking Garage")
                .address("123 Main St")
                .city("Boston")
                .pincode("02108")
                .build();

        ParkingLotResponse created = parkingLotService.createParkingLot(request, owner1);

        ParkingLotRequest updateRequest = ParkingLotRequest.builder()
                .name("Admin Updated Name")
                .address("123 Main St")
                .city("Boston")
                .pincode("02108")
                .build();

        ParkingLotResponse updated = parkingLotService.updateParkingLot(created.getId(), updateRequest, admin);
        assertEquals("Admin Updated Name", updated.getName());
    }
}
