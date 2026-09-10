# ==========================================================
# ParkEase Backend - Production Dockerfile for Render
# ==========================================================

# Step 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Lightweight Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S parkease && adduser -S parkease -G parkease
USER parkease:parkease

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Dynamic port binding (Render injects PORT)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
