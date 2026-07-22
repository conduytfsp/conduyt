package com.mark.conduyt.config;


import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv = loadEnv();

    private static Dotenv loadEnv() {
        try {
            Dotenv loaded = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            // Inject into system properties for Spring to pick up
            loaded.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );

            return loaded;
        } catch (Exception e) {
            System.err.println("Warning: .env file not found or failed to load.");
            return null;
        }
    }

    public static String get(String key) {
        if (dotenv != null && dotenv.get(key) != null) {
            return dotenv.get(key);
        }
        return System.getenv(key);
    }
}

