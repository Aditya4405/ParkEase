package com.parkease.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Permit all OPTIONS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Owner specific endpoints (before generic /parking-lots pattern)
                        .requestMatchers("/api/v1/parking-lots/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/v1/bookings/owner/**").hasRole("OWNER")

                        // Public read access to parking lots and slot availability
                        .requestMatchers(HttpMethod.GET, "/api/v1/parking-lots", "/api/v1/parking-lots/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/parking-slots/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/bookings/*/available-slots").permitAll()

                        // Admin only endpoints
                        .requestMatchers("/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/bookings/all").hasRole("ADMIN")

                        // Owner & Admin write endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/parking-lots/**").hasAnyRole("OWNER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/parking-lots/**").hasAnyRole("OWNER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/parking-lots/**").hasAnyRole("OWNER", "ADMIN")
                        .requestMatchers("/api/v1/parking-slots/**").hasAnyRole("OWNER", "ADMIN")

                        // Authenticated user endpoints
                        .requestMatchers("/api/v1/profile/**").authenticated()
                        .requestMatchers("/api/v1/bookings/**").authenticated()

                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
