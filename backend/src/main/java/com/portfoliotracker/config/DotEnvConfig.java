package com.portfoliotracker.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotEnvConfig {

    @PostConstruct
    public void loadDotEnv() {
        try {
            // Try multiple paths to find .env file
            String[] paths = {"./", "../", "../../", "./backend/", "../backend/"};
            Dotenv dotenv = null;
            
            for (String path : paths) {
                try {
                    dotenv = Dotenv.configure()
                            .directory(path)
                            .ignoreIfMalformed()
                            .ignoreIfMissing()
                            .load();
                    if (dotenv.entries().size() > 0) {
                        System.out.println("Found .env file at path: " + path);
                        break;
                    }
                } catch (Exception e) {
                    // Try next path
                }
            }
            
            if (dotenv != null && dotenv.entries().size() > 0) {
                // Load environment variables from .env file
                dotenv.entries().forEach(entry -> {
                    if (System.getenv(entry.getKey()) == null) {
                        System.setProperty(entry.getKey(), entry.getValue());
                        System.out.println("Loaded from .env: " + entry.getKey() + " = " + 
                            (entry.getKey().contains("SECRET") || entry.getKey().contains("PASSWORD") ? "***" : entry.getValue()));
                    }
                });
                System.out.println("Successfully loaded " + dotenv.entries().size() + " environment variables from .env file");
            } else {
                System.out.println("No .env file found in any of the searched paths");
            }
        } catch (Exception e) {
            System.out.println("Error loading .env file: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
