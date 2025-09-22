# Multi-stage build for Spring Boot application
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/portfolio-tracker-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8087

# Run the application
CMD ["java", "-jar", "app.jar"]


