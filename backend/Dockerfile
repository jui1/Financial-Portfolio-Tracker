# Multi-stage build for Spring Boot application
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven files
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code
COPY backend/src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from build stage
COPY --from=build /app/target/portfolio-tracker-backend-0.0.1-SNAPSHOT.jar app.jar

# Copy .env file for production
COPY .env .env

# Expose port
EXPOSE 8087

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8087/actuator/health || exit 1

# Run the application
CMD ["java", "-jar", "app.jar"]


