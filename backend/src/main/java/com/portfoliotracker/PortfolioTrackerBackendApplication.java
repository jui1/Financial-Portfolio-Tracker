package com.portfoliotracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioTrackerBackendApplication {

	public static void main(String[] args) {
		// Debug environment variables
		System.out.println("=== ENVIRONMENT VARIABLES DEBUG ===");
		System.out.println("SPRING_DATASOURCE_URL: " + System.getenv("SPRING_DATASOURCE_URL"));
		System.out.println("SPRING_DATASOURCE_USERNAME: " + System.getenv("SPRING_DATASOURCE_USERNAME"));
		System.out.println("SPRING_DATASOURCE_PASSWORD: " + (System.getenv("SPRING_DATASOURCE_PASSWORD") != null ? "[SET]" : "[NOT SET]"));
		System.out.println("DATABASE_URL: " + System.getenv("DATABASE_URL"));
		System.out.println("DB_USERNAME: " + System.getenv("DB_USERNAME"));
		System.out.println("DB_PASSWORD: " + (System.getenv("DB_PASSWORD") != null ? "[SET]" : "[NOT SET]"));
		System.out.println("SPRING_PROFILES_ACTIVE: " + System.getenv("SPRING_PROFILES_ACTIVE"));
		
		// Print all environment variables that contain "DATABASE" or "SPRING"
		System.out.println("=== ALL DATABASE/SPRING ENV VARS ===");
		System.getenv().entrySet().stream()
			.filter(entry -> entry.getKey().toUpperCase().contains("DATABASE") || 
							entry.getKey().toUpperCase().contains("SPRING"))
			.forEach(entry -> System.out.println(entry.getKey() + " = " + 
				(entry.getKey().toUpperCase().contains("PASSWORD") ? "[HIDDEN]" : entry.getValue())));
		System.out.println("=====================================");
		
		SpringApplication.run(PortfolioTrackerBackendApplication.class, args);
	}

}


