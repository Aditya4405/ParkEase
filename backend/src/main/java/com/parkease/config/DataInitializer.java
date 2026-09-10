package com.parkease.config;

import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.parking.entity.ParkingLot;
import com.parkease.parking.entity.ParkingSlot;
import com.parkease.parking.entity.SlotSize;
import com.parkease.parking.entity.VehicleType;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE parking_slots DROP CONSTRAINT IF EXISTS parking_slots_vehicle_type_check");
            log.info("Dropped legacy parking_slots_vehicle_type_check constraint if present.");
        } catch (Exception e) {
            log.debug("Constraint drop skipped: {}", e.getMessage());
        }
        boolean shouldReseed = false;
        if (userRepository.count() > 0 && parkingLotRepository.count() > 0) {
            // Check if existing data is legacy US demo data
            boolean hasLegacyData = userRepository.findAll().stream()
                    .anyMatch(u -> u.getVehicleNumber() != null && u.getVehicleNumber().startsWith("NY-"));
            if (hasLegacyData) {
                log.info("Legacy global demo data detected. Clearing and reseeding with India-first ParkEase dataset...");
                bookingRepository.deleteAll();
                parkingLotRepository.deleteAll();
                userRepository.deleteAll();
                shouldReseed = true;
            } else {
                log.info("Database already initialized with modern Indian ParkEase data.");
                return;
            }
        } else {
            bookingRepository.deleteAll();
            parkingLotRepository.deleteAll();
            userRepository.deleteAll();
            shouldReseed = true;
        }

        if (shouldReseed) {
            initializeIndianData();
        }
    }

    private void initializeIndianData() {
        log.info("Initializing ParkEase — Smart Parking for India dataset...");

        // 1. Indian Users & Roles
        User admin = User.builder()
                .name("System Administrator")
                .email("admin@parkease.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phone("+91 800-555-0199")
                .role(Role.ADMIN)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(30))
                .build();

        User owner1 = User.builder()
                .name("Rajesh Sharma (Avadh Parking Solutions)")
                .email("owner@parkease.com")
                .password(passwordEncoder.encode("Owner@123"))
                .phone("+91 98390 12345")
                .role(Role.OWNER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(25))
                .build();

        User owner2 = User.builder()
                .name("Sunil Gupta (UP Express Parking Hubs)")
                .email("sunil.gupta@parkease.com")
                .password(passwordEncoder.encode("Owner@123"))
                .phone("+91 94150 98765")
                .role(Role.OWNER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(20))
                .build();

        User user1 = User.builder()
                .name("Amit Verma")
                .email("user@parkease.com")
                .password(passwordEncoder.encode("User@123"))
                .phone("+91 98765 43210")
                .vehicleNumber("UP 32 EA 4455")
                .role(Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(15))
                .build();

        User user2 = User.builder()
                .name("Priya Singh")
                .email("priya.singh@example.com")
                .password(passwordEncoder.encode("User@123"))
                .phone("+91 98111 22334")
                .vehicleNumber("DL 01 AB 8899")
                .role(Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();

        User user3 = User.builder()
                .name("Rohit Sharma")
                .email("rohit.sharma@example.com")
                .password(passwordEncoder.encode("User@123"))
                .phone("+91 99220 33445")
                .vehicleNumber("UP 32 Z 9000")
                .role(Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();

        userRepository.saveAll(List.of(admin, owner1, owner2, user1, user2, user3));

        // 2. Realistic Indian Parking Lots (Focus on Lucknow & Key Indian Hubs)
        ParkingLot lot1 = ParkingLot.builder()
                .name("Phoenix Palassio Multi-Level Parking")
                .address("Sector 7, Amar Shaheed Path, Gomti Nagar Extension")
                .city("Lucknow")
                .pincode("226010")
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(20))
                .build();

        ParkingLot lot2 = ParkingLot.builder()
                .name("Lulu Mall Smart Parking Plaza")
                .address("Golf City, Sector B Ansal API, Shaheed Path")
                .city("Lucknow")
                .pincode("226030")
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(18))
                .build();

        ParkingLot lot3 = ParkingLot.builder()
                .name("Charbagh Railway Station Parking Hub")
                .address("Station Road, Preeti Nagar, Railway Colony, Charbagh")
                .city("Lucknow")
                .pincode("226004")
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(16))
                .build();

        ParkingLot lot4 = ParkingLot.builder()
                .name("KGMU Hospital Smart Parking Zone")
                .address("Shah Mina Road, Chowk, Near Trauma Centre")
                .city("Lucknow")
                .pincode("226003")
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(14))
                .build();

        ParkingLot lot5 = ParkingLot.builder()
                .name("Hazratganj Multi-Level Car Parking")
                .address("Mahatma Gandhi Marg, Near Mayfair Cinema, Hazratganj")
                .city("Lucknow")
                .pincode("226001")
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(12))
                .build();

        ParkingLot lot6 = ParkingLot.builder()
                .name("Gomti Nagar Railway Station North Terminal Bay")
                .address("Vibhuti Khand, Gomti Nagar, Near Manoj Pandey Chauraha")
                .city("Lucknow")
                .pincode("226010")
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();

        ParkingLot lot7 = ParkingLot.builder()
                .name("DLF Mall of India Smart Parking")
                .address("Plot M-03, Sector 18, Noida")
                .city("Noida")
                .pincode("201301")
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(8))
                .build();

        ParkingLot lot8 = ParkingLot.builder()
                .name("New Delhi Railway Station (Pahar Ganj Bay)")
                .address("Bhavbhuti Marg, Near Ajmeri Gate Flyover")
                .city("Delhi")
                .pincode("110055")
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(6))
                .build();

        ParkingLot lot9 = ParkingLot.builder()
                .name("Ayodhya Dham Junction Multi-Modal Parking")
                .address("Station Road, Near Ram Janmabhoomi Marg")
                .city("Ayodhya")
                .pincode("224123")
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(4))
                .build();

        ParkingLot lot10 = ParkingLot.builder()
                .name("Kanpur Central Cantt Side Parking")
                .address("Cantonment, Near Ghantaghar & Platform 1")
                .city("Kanpur")
                .pincode("208004")
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();

        // Add Realistic Indian Slots with INR Rates
        // Lot 1: Phoenix Palassio (Mall: ₹40 car, ₹20 bike, ₹60 suv, ₹40 EV)
        addSlotsToLot(lot1, List.of(
                new SlotConfig("P-CAR-01", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("P-CAR-02", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("P-CAR-03", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("P-CAR-04", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("P-2W-101", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("P-2W-102", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("P-2W-103", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("P-SUV-201", 60.00, SlotSize.LARGE, VehicleType.SUV),
                new SlotConfig("P-SUV-202", 60.00, SlotSize.LARGE, VehicleType.SUV),
                new SlotConfig("P-EV-01", 40.00, SlotSize.MEDIUM, VehicleType.EV),
                new SlotConfig("P-EV-02", 40.00, SlotSize.MEDIUM, VehicleType.EV)
        ));

        // Lot 2: Lulu Mall (Mall: ₹40 car, ₹20 bike, ₹70 suv, ₹50 EV)
        addSlotsToLot(lot2, List.of(
                new SlotConfig("LM-C01", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("LM-C02", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("LM-C03", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("LM-B01", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("LM-B02", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("LM-SUV1", 70.00, SlotSize.LARGE, VehicleType.SUV),
                new SlotConfig("LM-EV01", 50.00, SlotSize.MEDIUM, VehicleType.EV)
        ));

        // Lot 3: Charbagh Railway Station (Station: ₹30 car, ₹15 bike, ₹50 suv, ₹35 EV)
        addSlotsToLot(lot3, List.of(
                new SlotConfig("CB-C01", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("CB-C02", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("CB-B01", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("CB-B02", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("CB-B03", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("CB-SUV1", 50.00, SlotSize.LARGE, VehicleType.SUV),
                new SlotConfig("CB-EV01", 35.00, SlotSize.MEDIUM, VehicleType.EV)
        ));

        // Lot 4: KGMU Hospital (Hospital: ₹20 car, ₹10 bike, ₹30 suv, ₹25 EV)
        addSlotsToLot(lot4, List.of(
                new SlotConfig("KGMU-C1", 20.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("KGMU-C2", 20.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("KGMU-B1", 10.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("KGMU-B2", 10.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("KGMU-SUV1", 30.00, SlotSize.LARGE, VehicleType.SUV)
        ));

        // Lot 5: Hazratganj (Market: ₹50 car, ₹20 bike, ₹70 suv, ₹50 EV)
        addSlotsToLot(lot5, List.of(
                new SlotConfig("HG-CAR-1", 50.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("HG-CAR-2", 50.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("HG-BIKE-1", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("HG-BIKE-2", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("HG-EV-1", 50.00, SlotSize.MEDIUM, VehicleType.EV)
        ));

        // Lot 6: Gomti Nagar Railway Station
        addSlotsToLot(lot6, List.of(
                new SlotConfig("GNR-C1", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("GNR-C2", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("GNR-B1", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("GNR-SUV1", 50.00, SlotSize.LARGE, VehicleType.SUV)
        ));

        // Lot 7: DLF Mall of India Noida (₹50 car, ₹25 bike, ₹80 suv, ₹60 EV)
        addSlotsToLot(lot7, List.of(
                new SlotConfig("DLF-C1", 50.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("DLF-C2", 50.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("DLF-B1", 25.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("DLF-SUV1", 80.00, SlotSize.LARGE, VehicleType.SUV),
                new SlotConfig("DLF-EV1", 60.00, SlotSize.MEDIUM, VehicleType.EV)
        ));

        // Lot 8: New Delhi Railway Station
        addSlotsToLot(lot8, List.of(
                new SlotConfig("NDLS-C1", 40.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("NDLS-B1", 20.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("NDLS-SUV1", 60.00, SlotSize.LARGE, VehicleType.SUV)
        ));

        // Lot 9: Ayodhya Dham Junction
        addSlotsToLot(lot9, List.of(
                new SlotConfig("AYD-C1", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("AYD-C2", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("AYD-B1", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("AYD-SUV1", 50.00, SlotSize.LARGE, VehicleType.SUV)
        ));

        // Lot 10: Kanpur Central
        addSlotsToLot(lot10, List.of(
                new SlotConfig("CNB-C1", 30.00, SlotSize.MEDIUM, VehicleType.CAR),
                new SlotConfig("CNB-B1", 15.00, SlotSize.SMALL, VehicleType.BIKE),
                new SlotConfig("CNB-SUV1", 50.00, SlotSize.LARGE, VehicleType.SUV)
        ));

        parkingLotRepository.saveAll(List.of(lot1, lot2, lot3, lot4, lot5, lot6, lot7, lot8, lot9, lot10));

        // 3. Realistic Demo Bookings for Amit Verma
        ParkingSlot firstSlot = lot1.getSlots().get(0);
        Booking sampleBooking1 = Booking.builder()
                .user(user1)
                .parkingSlot(firstSlot)
                .startTime(LocalDateTime.now().plusDays(1).withHour(17).withMinute(0).withSecond(0))
                .endTime(LocalDateTime.now().plusDays(1).withHour(20).withMinute(0).withSecond(0))
                .status(BookingStatus.RESERVED)
                .totalPrice(120.00)
                .vehicleNumber("UP 32 EA 4455")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build();

        Booking sampleBooking2 = Booking.builder()
                .user(user1)
                .parkingSlot(lot5.getSlots().get(0))
                .startTime(LocalDateTime.now().minusDays(2).withHour(14).withMinute(0).withSecond(0))
                .endTime(LocalDateTime.now().minusDays(2).withHour(17).withMinute(0).withSecond(0))
                .status(BookingStatus.COMPLETED)
                .totalPrice(150.00)
                .vehicleNumber("UP 32 EA 4455")
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();

        bookingRepository.saveAll(List.of(sampleBooking1, sampleBooking2));

        log.info("ParkEase Indian dataset initialized successfully with 10 prime parking lots, 6 users, and active demo bookings!");
    }

    private void addSlotsToLot(ParkingLot lot, List<SlotConfig> configs) {
        for (SlotConfig config : configs) {
            ParkingSlot slot = ParkingSlot.builder()
                    .slotNumber(config.slotNumber)
                    .price(config.price)
                    .size(config.size)
                    .vehicleType(config.vehicleType)
                    .active(true)
                    .isAvailable(true)
                    .parkingLot(lot)
                    .build();
            lot.getSlots().add(slot);
        }
    }

    private record SlotConfig(String slotNumber, Double price, SlotSize size, VehicleType vehicleType) {}
}
