package com.mark.conduyt.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public AiService(ObjectMapper objectMapper) {
        // Create the RestClient directly
        this.restClient = RestClient.create();

        this.objectMapper = objectMapper;
        System.out.println("AiService initialized successfully for Google Gemini.");
    }

    // ==========================================
    // TASK 1: GENERATE JOB SUMMARY
    // ==========================================
    public String generateJobSummary(String fullDescription) {
        System.out.println("AiService: Generating job summary via Gemini...");

        if (fullDescription == null || fullDescription.isBlank()) {
            return "No description provided.";
        }

        String prompt = "You are an expert technical recruiter and copywriter. Summarize the following freelance job description into exactly 2 crisp, engaging sentences highlighting the core technical requirement:\n\n" + fullDescription;

        String assistantReply = callGeminiApi(prompt, 0.7); // 0.7 temp for slightly creative copywriting

        // Fallback if the API fails
        if (assistantReply.startsWith("I apologize")) {
            return fullDescription.length() > 150 ? fullDescription.substring(0, 150) + "..." : fullDescription;
        }

        return assistantReply.trim();
    }

    // ==========================================
    // TASK 2: CALCULATE COMPATIBILITY SCORE
    // ==========================================
    public double calculateCompatibilityScore(String jobDescription, List<String> requiredSkills, String freelancerPitch, List<String> freelancerSkills, String cvText) {
        System.out.println("AiService: Calculating AI compatibility score via Gemini...");

        String truncatedCv = (cvText != null && cvText.length() > 3000)
                ? cvText.substring(0, 3000) + "... [truncated]"
                : (cvText != null && !cvText.isBlank() ? cvText : "No CV attached");

        String prompt = String.format(
                "You are an AI matching engine for a freelance platform. Analyze the job against the freelancer's profile. " +
                        "Return ONLY a single numeric percentage score from 0.0 to 100.0 representing their overall compatibility. " +
                        "Do not include a '%%' sign, text, or explanation. Just the number.\n\n" +
                        "JOB POSTING:\nDescription: %s\nRequired Skills: %s\n\n" +
                        "FREELANCER APPLICATION:\nPitch: %s\nSkills: %s\n\n" +
                        "ATTACHED CV / RESUME CONTENT:\n%s",
                jobDescription,
                String.join(", ", requiredSkills != null ? requiredSkills : List.of("None")),
                freelancerPitch,
                String.join(", ", freelancerSkills != null ? freelancerSkills : List.of("None")),
                truncatedCv
        );

        String assistantReply = callGeminiApi(prompt, 0.1); // 0.1 temp for strict, deterministic scoring

        try {
            double score = Double.parseDouble(assistantReply.trim());
            return Math.min(100.0, Math.max(0.0, score));
        } catch (NumberFormatException e) {
            System.err.println("AiService: Failed to parse AI score. Raw response: " + assistantReply);
            return fallbackScoreCalculation(requiredSkills, freelancerSkills);
        }
    }

    // ==========================================
    // INTERNAL: GEMINI API CALL EXECUTION
    // ==========================================
    private String callGeminiApi(String promptText, double temperature) {
        System.out.println("AiService: Calling Gemini API...");

        // Build the specific JSON structure Gemini expects
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", promptText)
                        ))
                ),
                "generationConfig", Map.of(
                        "temperature", temperature
                )
        );

        int maxRetries = 3;
        long initialDelayMs = 500;

        for (int i = 0; i < maxRetries; i++) {
            try {
                System.out.println("AiService: Executing API call (Attempt " + (i + 1) + ")...");

                String rawJsonResponse = restClient.post()
                        .uri(apiUrl + "?key=" + apiKey)
                        .header("Content-Type", "application/json")
                        .body(requestBody)
                        .retrieve()
                        .body(String.class);

                // Parse the Gemini JSON response tree
                JsonNode rootNode = objectMapper.readTree(rawJsonResponse);
                String content = rootNode
                        .path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();

                return content;

            } catch (Exception e) {
                System.err.println("AiService: EXCEPTION caught during Gemini call (Attempt " + (i + 1) + "): " + e.getMessage());

                if (i < maxRetries - 1) {
                    long delay = initialDelayMs * (long) Math.pow(2, i);
                    System.out.println("AiService: Retrying in " + delay + "ms...");
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
        return "I apologize, I couldn't get a response from the AI after multiple attempts.";
    }

    // ==========================================
    // FALLBACK MATH LOGIC
    // ==========================================
    private double fallbackScoreCalculation(List<String> requiredSkills, List<String> freelancerSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) return 50.0;
        if (freelancerSkills == null || freelancerSkills.isEmpty()) return 0.0;

        long matchingSkills = requiredSkills.stream()
                .filter(req -> freelancerSkills.stream().anyMatch(f -> f.equalsIgnoreCase(req)))
                .count();

        double baseScore = ((double) matchingSkills / requiredSkills.size()) * 100.0;
        return Math.round(baseScore * 10.0) / 10.0;
    }
}