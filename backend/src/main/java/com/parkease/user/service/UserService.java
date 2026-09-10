package com.parkease.user.service;

import com.parkease.exception.BadRequestException;
import com.parkease.exception.ConflictException;
import com.parkease.exception.ResourceNotFoundException;
import com.parkease.user.dto.ProfileResponse;
import com.parkease.user.dto.UpdateUserRequest;
import com.parkease.user.dto.UserResponse;
import com.parkease.user.entity.Role;
import com.parkease.user.entity.User;
import com.parkease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponse getProfile(User currentUser) {
        return mapToProfileResponse(currentUser);
    }

    @Transactional
    public ProfileResponse updateProfile(User currentUser, UpdateUserRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail().trim())
                && userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("Email is already taken by another account");
        }

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setVehicleNumber(request.getVehicleNumber() != null ? request.getVehicleNumber().trim().toUpperCase() : null);

        User updated = userRepository.save(user);
        return mapToProfileResponse(updated);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse createUser(UpdateUserRequest request, String password) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("Email already exists: " + request.getEmail());
        }

        if (password == null || password.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(password))
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .vehicleNumber(request.getVehicleNumber() != null ? request.getVehicleNumber().trim().toUpperCase() : null)
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail().trim())
                && userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("Email is already taken by another account");
        }

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setVehicleNumber(request.getVehicleNumber() != null ? request.getVehicleNumber().trim().toUpperCase() : null);
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countByRole(Role.USER));
        stats.put("totalOwners", userRepository.countByRole(Role.OWNER));
        stats.put("totalAdmins", userRepository.countByRole(Role.ADMIN));
        stats.put("totalAccounts", userRepository.count());
        return stats;
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .vehicleNumber(user.getVehicleNumber())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private ProfileResponse mapToProfileResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .vehicleNumber(user.getVehicleNumber())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
