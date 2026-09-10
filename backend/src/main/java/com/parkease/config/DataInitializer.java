package com.parkease.config;

import com.parkease.booking.entity.Booking;
import com.parkease.booking.entity.BookingStatus;
import com.parkease.booking.repository.BookingRepository;
import com.parkease.parking.entity.*;
import com.parkease.parking.repository.ParkingLotRepository;
import com.parkease.parking.repository.ParkingOccupancyEventRepository;
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
    private final ParkingOccupancyEventRepository occupancyEventRepository;
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
            boolean hasLegacyData = userRepository.findAll().stream()
                    .anyMatch(u -> u.getVehicleNumber() != null && u.getVehicleNumber().startsWith("NY-"));
            boolean lacksCategoryData = parkingLotRepository.findAll().stream()
                    .anyMatch(p -> p.getCategory() == null || p.getCategory().isBlank());

            if (hasLegacyData || lacksCategoryData) {
                log.info("Upgrading database with static/dynamic metadata and category architecture...");
                bookingRepository.deleteAll();
                occupancyEventRepository.deleteAll();
                parkingLotRepository.deleteAll();
                userRepository.deleteAll();
                shouldReseed = true;
            } else {
                log.info("Database already initialized with ParkEase Smart Parking for India dataset.");
                return;
            }
        } else {
            bookingRepository.deleteAll();
            occupancyEventRepository.deleteAll();
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
                .role(Role.ADMIN)
                .phone("+91 800-555-0199")
                .vehicleNumber("UP 32 AD 0001")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User owner1 = User.builder()
                .name("Rajesh Sharma (Avadh Parking Solutions)")
                .email("owner@parkease.com")
                .password(passwordEncoder.encode("Owner@123"))
                .role(Role.OWNER)
                .phone("+91 98390 12345")
                .vehicleNumber("UP 32 OW 1001")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User owner2 = User.builder()
                .name("Sunil Gupta (UP Express Parking Hubs)")
                .email("sunil.gupta@parkease.com")
                .password(passwordEncoder.encode("Owner@123"))
                .role(Role.OWNER)
                .phone("+91 94150 98765")
                .vehicleNumber("UP 32 SG 2002")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User user1 = User.builder()
                .name("Amit Verma")
                .email("user@parkease.com")
                .password(passwordEncoder.encode("User@123"))
                .role(Role.USER)
                .phone("+91 98765 43210")
                .vehicleNumber("UP 32 EA 4455")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User user2 = User.builder()
                .name("Pooja Tiwari")
                .email("pooja.tiwari@gmail.com")
                .password(passwordEncoder.encode("User@123"))
                .role(Role.USER)
                .phone("+91 91234 56789")
                .vehicleNumber("UP 32 EV 9900")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User user3 = User.builder()
                .name("Vikram Singh")
                .email("vikram.singh@outlook.com")
                .password(passwordEncoder.encode("User@123"))
                .role(Role.USER)
                .phone("+91 99887 76655")
                .vehicleNumber("DL 01 CA 1234")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.saveAll(List.of(admin, owner1, owner2, user1, user2, user3));

        // 2. Authentic Indian Parking Locations (Static OSM/Municipal Metadata + Dynamic Occupancy)
        List<ParkingLot> lots = new ArrayList<>();

        // Lot 1: Phoenix Palassio, Lucknow
        ParkingLot lot1 = ParkingLot.builder()
                .name("Phoenix Palassio Multi-Level Parking")
                .address("Sector 7, Amar Shaheed Path, Gomti Nagar Extension")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226010")
                .parkingType("Multi-Level Covered Bay")
                .totalCapacity(150)
                .occupiedSlots(82)
                .reservedSlots(5)
                .openingTime("10:00 AM")
                .closingTime("11:30 PM")
                .hasEVCharging(true)
                .category("MALL")
                .nearbyDestination("Phoenix Palassio & Ekana Stadium")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-node-8392102")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(3))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(20))
                .build();
        addSlots(lot1, List.of(
                slot("P1-C101", 40.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("P1-C102", 40.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("P1-C103", 40.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("P1-B201", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("P1-B202", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("P1-SUV1", 60.0, SlotSize.LARGE, VehicleType.SUV),
                slot("P1-EV01", 40.0, SlotSize.MEDIUM, VehicleType.EV),
                slot("P1-EV02", 40.0, SlotSize.MEDIUM, VehicleType.EV)
        ));
        lots.add(lot1);

        // Lot 2: Lulu Mall, Lucknow
        ParkingLot lot2 = ParkingLot.builder()
                .name("Lulu Mall Automated Basement & Surface Bay")
                .address("Sushant Golf City, Sector B, IBB-2, Shaheed Path")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226030")
                .parkingType("Automated Basement & Surface Bay")
                .totalCapacity(200)
                .occupiedSlots(125)
                .reservedSlots(12)
                .openingTime("10:00 AM")
                .closingTime("11:00 PM")
                .hasEVCharging(true)
                .category("MALL")
                .nearbyDestination("Lulu Mall & Medanta Hospital")
                .dataSource("OPERATOR_PORTAL")
                .externalSourceId("lulu-lko-hub-01")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(5))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(18))
                .build();
        addSlots(lot2, List.of(
                slot("LU-CAR-01", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("LU-CAR-02", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("LU-CAR-03", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("LU-BIKE-1", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("LU-BIKE-2", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("LU-SUV-01", 70.0, SlotSize.LARGE, VehicleType.SUV),
                slot("LU-EV-01", 50.0, SlotSize.MEDIUM, VehicleType.EV)
        ));
        lots.add(lot2);

        // Lot 3: Charbagh Railway Station
        ParkingLot lot3 = ParkingLot.builder()
                .name("Charbagh Railway Station Premium Fastag Parking")
                .address("Station Road, Near Platform 1 & Cabway, Preeti Nagar")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226004")
                .parkingType("Open Secured Rail Transit Bay")
                .totalCapacity(120)
                .occupiedSlots(74)
                .reservedSlots(4)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(true)
                .category("RAILWAY_STATION")
                .nearbyDestination("Lucknow Charbagh (LKO) & Metro Hub")
                .dataSource("MUNICIPAL_DATA")
                .externalSourceId("nr-ir-lko-001")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(1))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(16))
                .build();
        addSlots(lot3, List.of(
                slot("CB-CAR-01", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("CB-CAR-02", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("CB-BIKE-01", 15.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("CB-BIKE-02", 15.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("CB-SUV-01", 50.0, SlotSize.LARGE, VehicleType.SUV),
                slot("CB-EV01", 35.0, SlotSize.MEDIUM, VehicleType.EV)
        ));
        lots.add(lot3);

        // Lot 4: KGMU Hospital
        ParkingLot lot4 = ParkingLot.builder()
                .name("KGMU Hospital Smart Emergency Parking Zone")
                .address("Shah Mina Road, Chowk, Near Trauma Centre Gate 2")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226003")
                .parkingType("Emergency & OPD Surface Bay")
                .totalCapacity(80)
                .occupiedSlots(52)
                .reservedSlots(8)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(false)
                .category("HOSPITAL")
                .nearbyDestination("King George's Medical University & Trauma Centre")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-way-782190")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(8))
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(14))
                .build();
        addSlots(lot4, List.of(
                slot("KGMU-C1", 20.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("KGMU-C2", 20.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("KGMU-B1", 10.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("KGMU-B2", 10.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("KGMU-SUV1", 30.0, SlotSize.LARGE, VehicleType.SUV)
        ));
        lots.add(lot4);

        // Lot 5: Hazratganj Multi-Level
        ParkingLot lot5 = ParkingLot.builder()
                .name("Hazratganj Multi-Level Smart Parking")
                .address("Mahatma Gandhi Marg, Near Mayfair Cinema & Janpath")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226001")
                .parkingType("Automated Multi-Level Smart Stack")
                .totalCapacity(160)
                .occupiedSlots(110)
                .reservedSlots(12)
                .openingTime("08:00 AM")
                .closingTime("11:30 PM")
                .hasEVCharging(true)
                .category("MARKET")
                .nearbyDestination("Hazratganj Market & GPO")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-node-1029482")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(2))
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(12))
                .build();
        addSlots(lot5, List.of(
                slot("HG-CAR-1", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("HG-CAR-2", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("HG-BIKE-1", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("HG-BIKE-2", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("HG-EV-1", 50.0, SlotSize.MEDIUM, VehicleType.EV)
        ));
        lots.add(lot5);

        // Lot 6: Gomti Nagar Station North Bay
        ParkingLot lot6 = ParkingLot.builder()
                .name("Gomti Nagar Railway Station North Terminal Bay")
                .address("Vibhuti Khand, Gomti Nagar, Near Manoj Pandey Chauraha")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226010")
                .parkingType("World-Class Multi-Modal Transit Hub")
                .totalCapacity(110)
                .occupiedSlots(60)
                .reservedSlots(6)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(true)
                .category("RAILWAY_STATION")
                .nearbyDestination("Gomti Nagar Railway Station & High Court")
                .dataSource("MUNICIPAL_DATA")
                .externalSourceId("ner-gnr-002")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(4))
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();
        addSlots(lot6, List.of(
                slot("GNR-C1", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("GNR-C2", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("GNR-B1", 15.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("GNR-SUV1", 50.0, SlotSize.LARGE, VehicleType.SUV)
        ));
        lots.add(lot6);

        // Lot 7: University of Lucknow Campus Gate Parking
        ParkingLot lot7 = ParkingLot.builder()
                .name("University of Lucknow Main Campus Parking")
                .address("University Road, Babuganj, Hasanganj")
                .city("Lucknow")
                .state("Uttar Pradesh")
                .pincode("226007")
                .parkingType("Campus Visitor & Student Bay")
                .totalCapacity(90)
                .occupiedSlots(45)
                .reservedSlots(5)
                .openingTime("07:30 AM")
                .closingTime("08:00 PM")
                .hasEVCharging(false)
                .category("COLLEGE")
                .nearbyDestination("University of Lucknow & IT College")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-way-482019")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(12))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(8))
                .build();
        addSlots(lot7, List.of(
                slot("LU-AC-1", 20.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("LU-AC-2", 20.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("LU-BK-1", 10.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("LU-BK-2", 10.0, SlotSize.SMALL, VehicleType.BIKE)
        ));
        lots.add(lot7);

        // Lot 8: DLF Mall of India, Noida
        ParkingLot lot8 = ParkingLot.builder()
                .name("DLF Mall of India Multi-Level Smart Parking")
                .address("Plot M-03, Sector 18")
                .city("Noida")
                .state("Uttar Pradesh")
                .pincode("201301")
                .parkingType("Automated Multi-Level Covered")
                .totalCapacity(180)
                .occupiedSlots(120)
                .reservedSlots(15)
                .openingTime("10:00 AM")
                .closingTime("11:30 PM")
                .hasEVCharging(true)
                .category("MALL")
                .nearbyDestination("DLF Mall of India & Sector 18 Metro")
                .dataSource("OPERATOR_PORTAL")
                .externalSourceId("dlf-noida-p1")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(2))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(7))
                .build();
        addSlots(lot8, List.of(
                slot("DLF-C1", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("DLF-C2", 50.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("DLF-B1", 25.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("DLF-SUV1", 80.0, SlotSize.LARGE, VehicleType.SUV),
                slot("DLF-EV1", 60.0, SlotSize.MEDIUM, VehicleType.EV)
        ));
        lots.add(lot8);

        // Lot 9: New Delhi Railway Station (Pahar Ganj Bay)
        ParkingLot lot9 = ParkingLot.builder()
                .name("New Delhi Railway Station (Pahar Ganj Bay)")
                .address("Bhavbhuti Marg, Near Ajmeri Gate Flyover")
                .city("Delhi")
                .state("Delhi")
                .pincode("110055")
                .parkingType("Rail Transit Fastag Surface Bay")
                .totalCapacity(140)
                .occupiedSlots(95)
                .reservedSlots(10)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(true)
                .category("RAILWAY_STATION")
                .nearbyDestination("NDLS Railway Station & Connaught Place")
                .dataSource("MUNICIPAL_DATA")
                .externalSourceId("nr-ndls-01")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(6))
                .active(true)
                .owner(owner1)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();
        addSlots(lot9, List.of(
                slot("NDLS-C1", 40.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("NDLS-B1", 20.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("NDLS-SUV1", 60.0, SlotSize.LARGE, VehicleType.SUV)
        ));
        lots.add(lot9);

        // Lot 10: Ayodhya Dham Junction Multi-Modal Parking
        ParkingLot lot10 = ParkingLot.builder()
                .name("Ayodhya Dham Junction Multi-Modal Parking")
                .address("Station Road, Near Ram Janmabhoomi Marg")
                .city("Ayodhya")
                .state("Uttar Pradesh")
                .pincode("224123")
                .parkingType("Pilgrim & Tourist Multi-Modal Bay")
                .totalCapacity(160)
                .occupiedSlots(105)
                .reservedSlots(15)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(true)
                .category("TOURIST")
                .nearbyDestination("Ram Mandir & Ayodhya Dham Junction")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-node-992182")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(1))
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(4))
                .build();
        addSlots(lot10, List.of(
                slot("AYD-C1", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("AYD-C2", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("AYD-B1", 15.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("AYD-SUV1", 50.0, SlotSize.LARGE, VehicleType.SUV)
        ));
        lots.add(lot10);

        // Lot 11: Kanpur Central Cantt Side Parking
        ParkingLot lot11 = ParkingLot.builder()
                .name("Kanpur Central Cantt Side Fastag Hub")
                .address("Cantonment, Near Ghantaghar & Platform 1")
                .city("Kanpur")
                .state("Uttar Pradesh")
                .pincode("208004")
                .parkingType("Railway Junction Surface Bay")
                .totalCapacity(100)
                .occupiedSlots(65)
                .reservedSlots(6)
                .openingTime("24 Hours Open")
                .closingTime("24 Hours Open")
                .hasEVCharging(false)
                .category("RAILWAY_STATION")
                .nearbyDestination("Kanpur Central Railway Station & Cantt")
                .dataSource("OPENSTREETMAP")
                .externalSourceId("osm-way-332190")
                .lastOccupancyUpdate(LocalDateTime.now().minusMinutes(7))
                .active(true)
                .owner(owner2)
                .slots(new ArrayList<>())
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        addSlots(lot11, List.of(
                slot("CNB-C1", 30.0, SlotSize.MEDIUM, VehicleType.CAR),
                slot("CNB-B1", 15.0, SlotSize.SMALL, VehicleType.BIKE),
                slot("CNB-SUV1", 50.0, SlotSize.LARGE, VehicleType.SUV)
        ));
        lots.add(lot11);

        parkingLotRepository.saveAll(lots);

        // 3. Seed Sample Telemetry Events
        List<ParkingOccupancyEvent> sampleEvents = List.of(
                ParkingOccupancyEvent.builder()
                        .parkingLotId(lot1.getId())
                        .eventType(OccupancyEventType.ENTRY)
                        .vehicleNumber("UP 32 EA 4455")
                        .source("ANPR_CAMERA_GATE_1")
                        .timestamp(LocalDateTime.now().minusMinutes(15))
                        .processed(true)
                        .build(),
                ParkingOccupancyEvent.builder()
                        .parkingLotId(lot1.getId())
                        .eventType(OccupancyEventType.ENTRY)
                        .vehicleNumber("UP 32 BK 8899")
                        .source("BOOM_BARRIER_NORTH")
                        .timestamp(LocalDateTime.now().minusMinutes(9))
                        .processed(true)
                        .build(),
                ParkingOccupancyEvent.builder()
                        .parkingLotId(lot1.getId())
                        .eventType(OccupancyEventType.EXIT)
                        .vehicleNumber("UP 32 DL 1212")
                        .source("OPERATOR_MANUAL_CHECKOUT")
                        .timestamp(LocalDateTime.now().minusMinutes(3))
                        .processed(true)
                        .build(),
                ParkingOccupancyEvent.builder()
                        .parkingLotId(lot5.getId())
                        .eventType(OccupancyEventType.ENTRY)
                        .vehicleNumber("UP 32 EV 9900")
                        .source("FASTAG_BOOM_BARRIER")
                        .timestamp(LocalDateTime.now().minusMinutes(5))
                        .processed(true)
                        .build()
        );
        occupancyEventRepository.saveAll(sampleEvents);

        // 4. Seed Demo Active & Completed Indian Bookings
        ParkingSlot lot1SlotCar = lot1.getSlots().get(0);
        ParkingSlot lot1SlotEV = lot1.getSlots().get(6);
        ParkingSlot lot3SlotCar = lot3.getSlots().get(0);

        Booking b1 = Booking.builder()
                .user(user1)
                .parkingSlot(lot1SlotCar)
                .startTime(LocalDateTime.now().plusHours(2))
                .endTime(LocalDateTime.now().plusHours(5))
                .status(BookingStatus.RESERVED)
                .totalPrice(120.0)
                .vehicleNumber("UP 32 EA 4455")
                .createdAt(LocalDateTime.now().minusHours(1))
                .build();

        Booking b2 = Booking.builder()
                .user(user2)
                .parkingSlot(lot1SlotEV)
                .startTime(LocalDateTime.now().plusHours(1))
                .endTime(LocalDateTime.now().plusHours(3))
                .status(BookingStatus.RESERVED)
                .totalPrice(80.0)
                .vehicleNumber("UP 32 EV 9900")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build();

        Booking b3 = Booking.builder()
                .user(user1)
                .parkingSlot(lot3SlotCar)
                .startTime(LocalDateTime.now().minusDays(1).withHour(10).withMinute(0))
                .endTime(LocalDateTime.now().minusDays(1).withHour(14).withMinute(0))
                .status(BookingStatus.COMPLETED)
                .totalPrice(120.0)
                .vehicleNumber("UP 32 EA 4455")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();

        bookingRepository.saveAll(List.of(b1, b2, b3));

        log.info("ParkEase Indian dataset initialized successfully with 11 prime parking lots, OSM metadata, telemetry events, and active demo bookings!");
    }

    private void addSlots(ParkingLot lot, List<ParkingSlot> slotList) {
        for (ParkingSlot s : slotList) {
            s.setParkingLot(lot);
            lot.getSlots().add(s);
        }
    }

    private ParkingSlot slot(String slotNumber, Double price, SlotSize size, VehicleType vehicleType) {
        return ParkingSlot.builder()
                .slotNumber(slotNumber)
                .price(price)
                .size(size)
                .vehicleType(vehicleType)
                .active(true)
                .isAvailable(true)
                .build();
    }
}
