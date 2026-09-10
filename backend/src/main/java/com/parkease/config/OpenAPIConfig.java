package com.parkease.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI parkEaseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ParkEase - Parking Management & Reservation API")
                        .description("Comprehensive REST API documentation for the ParkEase Parking Management System. " +
                                "Supports authentication, role-based access (USER, OWNER, ADMIN), parking lot/slot management, and real-time conflict-free bookings.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ParkEase Team")
                                .email("support@parkease.com")
                                .url("https://parkease.com"))
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT Bearer token to authorize protected API endpoints.")));
    }
}
