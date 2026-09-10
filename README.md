# ParkEase – Smart Parking Management & Instant Reservation System

**ParkEase** is an enterprise-grade full-stack web application for modern urban parking discovery, dynamic slot allocation, and conflict-free reservations. Built with a clean layered architecture using **Java 17 / Spring Boot 3**, **PostgreSQL**, **Spring Security (JWT)**, and **React (Vite)**.

---

## 🌟 Key Features

### 👤 Driver / Customer Features (Role: `USER`)
* **Secure Registration & JWT Login**: BCrypt hashed passwords and stateless token-based authorization.
* **Smart Search & Filters**: Search parking facilities across cities, by street, name, or vehicle compatibility (Car, Bike, SUV).
* **Live Slot Availability Map**: Interactive visual bay grid showing real-time occupied vs vacant slots for any requested time duration.
* **Instant Conflict-Free Booking**: Select a specific slot or let the system allocate the best available bay with automatic double-booking prevention.
* **Booking Management**: View upcoming and completed reservations, track countdown schedules, and cancel active bookings.
* **Driver Profile**: Manage contact information and default vehicle license plate.

### 🏢 Parking Facility Owner Features (Role: `OWNER`)
* **Dedicated Owner Portal**: Register facility management companies or individual operators.
* **Facility Management**: Create, update, and manage parking facilities with addresses and zip codes.
* **Dynamic Bay / Slot Management**: Configure slot numbers, vehicle types (`CAR`, `BIKE`, `SUV`), slot sizes (`SMALL`, `MEDIUM`, `LARGE`), and hourly price rates.
* **Real-time Availability Control**: Toggle slot maintenance status and active availability with one click.
* **Customer Reservation Feed**: Monitor customer bookings, vehicle plate numbers, arrival times, and revenue generation in real-time.

### 🛡️ System Administration (Role: `ADMIN`)
* **System-Wide Dashboard**: Platform metrics including total drivers, registered owners, active slots, and gross system revenue.
* **User & Owner Management**: Promote/demote user roles, activate/deactivate accounts, inspect user profiles, and delete accounts.
* **Global Booking Oversight**: Search, view, and administer any customer reservation across all facilities.
* **Full CRUD Operations**: Complete control over all system entities.

---

## 🏗️ Architecture & Technology Stack

```
Frontend (React 18 + Vite + Modern CSS Design System)
       │ (REST APIs + Bearer JWT Token)
       ▼
Spring Boot 3 Backend
 ├─ Security & Filter Layer (JWT Auth Filter, Role Authorization, BCrypt)
 ├─ Global Exception & Validation Layer (@RestControllerAdvice)
 ├─ Controllers (/api/v1/auth, /api/v1/users, /api/v1/parking-lots, /api/v1/bookings)
 ├─ Service Layer (Double-booking prevention engine, business logic, role checks)
 ├─ Repository Layer (Spring Data JPA, custom conflict overlap queries, indexing)
 └─ Swagger/OpenAPI UI (/swagger-ui/index.html)
       │
       ▼
PostgreSQL Relational Database (users, parking_lots, parking_slots, bookings)
```

### Backend
* **Language/Framework**: Java 17, Spring Boot 3.3.3
* **Security**: Spring Security 6, JJWT 0.12.6, BCryptPasswordEncoder
* **Persistence**: Spring Data JPA, Hibernate ORM
* **Validation**: Jakarta Bean Validation
* **API Documentation**: SpringDoc OpenAPI / Swagger UI 2.6.0
* **Build Tool**: Maven

### Frontend
* **Core**: React 18, Vite 5, React Router 6
* **HTTP Client**: Axios (with centralized Bearer JWT interceptors and error handlers)
* **Icons**: Lucide React
* **Styling**: Vanilla CSS Design Tokens, responsive grid, glassmorphic touches

### Database
* **PostgreSQL 18** (or PostgreSQL 14+)
* Relational schema with foreign keys and multi-column indexes for overlap queries

---

## 🗄️ Database Design

```
users (1) ───────────< (Many) parking_lots
users (1) ───────────< (Many) bookings
parking_lots (1) ────< (Many) parking_slots
parking_slots (1) ───< (Many) bookings
```

### Tables & Indexes:
1. **`users`**:
   * `id` (PK, BigInt), `name`, `email` (Unique Index), `password`, `phone`, `vehicle_number`, `role` (`USER`, `OWNER`, `ADMIN`), `active`, `created_at`.
2. **`parking_lots`**:
   * `id` (PK, BigInt), `name`, `address`, `city` (Index), `pincode`, `active`, `owner_id` (FK `users.id`, Index), `created_at`.
3. **`parking_slots`**:
   * `id` (PK, BigInt), `slot_number`, `price`, `size` (`SMALL`, `MEDIUM`, `LARGE`), `vehicle_type` (`CAR`, `BIKE`, `SUV`), `active`, `is_available`, `parking_lot_id` (FK `parking_lots.id`).
   * **Unique Constraint**: `(parking_lot_id, slot_number)`
4. **`bookings`**:
   * `id` (PK, BigInt), `user_id` (FK `users.id`, Index), `parking_slot_id` (FK `parking_slots.id`), `start_time`, `end_time`, `status` (`RESERVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`), `total_price`, `vehicle_number`, `created_at`.
   * **Conflict Query Composite Index**: `(parking_slot_id, start_time, end_time, status)`

---

## ⚡ Booking Conflict Prevention Engine

Double-booking is prevented at both the database and service levels using a strict temporal overlap condition:

$$\text{existing.startTime} < \text{requested.endTime} \quad\text{AND}\quad \text{existing.endTime} > \text{requested.startTime}$$

For any reservation attempt with status $\in \{\text{RESERVED}, \text{ACTIVE}\}$:
* **Example 1**: Existing booking `10:00 - 12:00`. Requested `11:00 - 13:00` $\rightarrow$ **REJECTED (409 Conflict)**.
* **Example 2**: Existing booking `10:00 - 12:00`. Requested `12:00 - 14:00` $\rightarrow$ **ACCEPTED** (no overlap).
* Enforced with `@Transactional` execution and slot-level lock validation.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Java 17+**
* **Maven 3.8+**
* **Node.js 18+ & npm**
* **PostgreSQL** running on `localhost:5432`

---

### Step 1: Database Setup
Create the database in PostgreSQL:
```sql
CREATE DATABASE parkease;
```

---

### Step 2: Run Backend
Navigate to `/backend` directory:
```bash
cd backend
mvn spring-boot:run
```
Backend will start at: `http://localhost:8080`
Swagger Documentation: `http://localhost:8080/swagger-ui/index.html`

> [!NOTE]
> On initial startup, `DataInitializer` automatically populates default demo accounts, sample parking facilities, and slots.

---

### Step 3: Run Frontend
In a new terminal, navigate to `/frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: `http://localhost:5173`

---

## 🔑 Default Demo Credentials

| Role | Email | Password | Description |
|---|---|---|---|
| **Driver (USER)** | `user@parkease.com` | `User@123` | Regular customer account with sample active bookings |
| **Owner (OWNER)** | `owner@parkease.com` | `Owner@123` | Facility owner managing 2 parking lots with multiple bays |
| **Admin (ADMIN)** | `admin@parkease.com` | `Admin@123` | System administrator with full access to user management & logs |

---

## 📚 REST API Reference

### 🔐 Authentication (`/api/v1/auth`)
* `POST /api/v1/auth/register` - Register a customer/driver
* `POST /api/v1/auth/register-owner` - Register a facility owner
* `POST /api/v1/auth/login` - Authenticate and obtain JWT Bearer token

### 🅿️ Parking Facilities (`/api/v1/parking-lots`)
* `GET /api/v1/parking-lots` - Search active parking lots by city or keyword (Public)
* `GET /api/v1/parking-lots/{id}` - Get parking lot details and slots (Public)
* `GET /api/v1/parking-lots/owner/my` - Get facilities owned by authenticated owner (`OWNER`)
* `POST /api/v1/parking-lots` - Create parking facility with initial slots (`OWNER`, `ADMIN`)
* `PUT /api/v1/parking-lots/{id}` - Update parking facility (`OWNER` of lot, `ADMIN`)
* `DELETE /api/v1/parking-lots/{id}` - Delete parking facility (`OWNER` of lot, `ADMIN`)

### 🚗 Parking Slots (`/api/v1`)
* `GET /api/v1/parking-lots/{lotId}/slots` - Get all slots for a facility (Public)
* `POST /api/v1/parking-lots/{lotId}/slots` - Add new slot to facility (`OWNER`, `ADMIN`)
* `GET /api/v1/parking-slots/{id}` - Get slot details (Public)
* `PUT /api/v1/parking-slots/{id}` - Update slot price, size, or active status (`OWNER`, `ADMIN`)
* `DELETE /api/v1/parking-slots/{id}` - Delete slot (`OWNER`, `ADMIN`)

### 📅 Bookings & Availability (`/api/v1/bookings`)
* `POST /api/v1/bookings` - Create slot reservation with double-booking prevention (`USER`, `OWNER`, `ADMIN`)
* `GET /api/v1/bookings/my` - Get current user's reservations
* `GET /api/v1/bookings/owner/my` - Get all customer bookings across owned facilities (`OWNER`)
* `GET /api/v1/bookings/all` - Get all system reservations (`ADMIN`)
* `GET /api/v1/bookings/{id}` - Get reservation details
* `PUT /api/v1/bookings/{id}/cancel` - Cancel a reservation
* `GET /api/v1/bookings/{lotId}/available-slots` - Query real-time vacant slots for vehicle type and duration (Public)

### 👥 User Administration & Profile (`/api/v1`)
* `GET /api/v1/profile` - Get authenticated profile
* `PUT /api/v1/profile` - Update profile name, phone, vehicle plate
* `GET /api/v1/users` - List all users / filter by role (`ADMIN`)
* `POST /api/v1/users` - Create user account directly (`ADMIN`)
* `PUT /api/v1/users/{id}` - Update user role or status (`ADMIN`)
* `DELETE /api/v1/users/{id}` - Delete user account (`ADMIN`)
* `GET /api/v1/admin/stats` - Platform health and user registration metrics (`ADMIN`)

---

## 🧪 Testing

Run the automated backend test suite:
```bash
cd backend
mvn test
```

### Included Automated Tests:
1. `AuthServiceTest`:
   * Successful user registration & JWT generation.
   * Duplicate email rejection with 409 Conflict.
   * BCrypt password verification and login.
2. `BookingConflictTest`:
   * Successful booking creation.
   * Double-booking rejection on overlapping time intervals.
   * Acceptance of consecutive non-overlapping bookings.
   * Booking cancellation status transition.
3. `ParkingLotServiceTest`:
   * Facility creation by owner.
   * Unauthorized modification rejection (403 Forbidden).
   * Elevated administrative access verification.
