package com.parkease.user.dto;

import com.parkease.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String vehicleNumber;
    private Role role;
    private LocalDateTime createdAt;
}
