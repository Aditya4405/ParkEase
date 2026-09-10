package com.parkease;

import com.parkease.exception.ConflictException;
import com.parkease.user.dto.AuthResponse;
import com.parkease.user.dto.LoginRequest;
import com.parkease.user.dto.RegisterRequest;
import com.parkease.user.entity.Role;
import com.parkease.user.service.AuthService;
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
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should register a new user successfully and return JWT token")
    void testRegisterUserSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .name("John Test")
                .email("johntest@example.com")
                .password("Password123")
                .phone("+1 555-9999")
                .vehicleNumber("TX-1122-AB")
                .build();

        AuthResponse response = authService.register(request, Role.USER);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("johntest@example.com", response.getEmail());
        assertEquals(Role.USER, response.getRole());
    }

    @Test
    @DisplayName("Should reject duplicate email registration with ConflictException")
    void testRegisterDuplicateEmailFails() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Duplicate Test")
                .email("duptest@example.com")
                .password("Password123")
                .phone("+1 555-8888")
                .build();

        authService.register(request, Role.USER);

        assertThrows(ConflictException.class, () -> {
            authService.register(request, Role.USER);
        });
    }

    @Test
    @DisplayName("Should authenticate and login existing user successfully")
    void testLoginSuccess() {
        RegisterRequest regReq = RegisterRequest.builder()
                .name("Login Test User")
                .email("loginuser@example.com")
                .password("Secret@123")
                .phone("+1 555-7777")
                .build();
        authService.register(regReq, Role.USER);

        LoginRequest loginReq = LoginRequest.builder()
                .email("loginuser@example.com")
                .password("Secret@123")
                .build();

        AuthResponse authResponse = authService.login(loginReq);
        assertNotNull(authResponse.getToken());
        assertEquals("loginuser@example.com", authResponse.getEmail());
    }
}
