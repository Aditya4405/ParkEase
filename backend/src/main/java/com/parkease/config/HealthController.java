package com.parkease.config;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@Tag(name = "Health Check", description = "System health, probe, and uptime status")
public class HealthController {

    @GetMapping(value = {"/health", "/api/v1/health"})
    @Operation(summary = "Get application health status for uptime monitors and container orchestrators")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ParkEase Backend",
                "timestamp", LocalDateTime.now(),
                "environment", "production"
        ));
    }
}
