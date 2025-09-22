package com.portfoliotracker.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotEnvConfig {

    @PostConstruct
    public void loadDotEnv() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("../")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
            
            // Load environment variables from .env file
            dotenv.entries().forEach(entry -> {
                if (System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception e) {
            // Ignore if .env file is not found
            System.out.println("No .env file found, using system environment variables");
        }
    }
}
