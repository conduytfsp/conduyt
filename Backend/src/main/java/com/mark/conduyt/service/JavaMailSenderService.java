package com.mark.conduyt.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JavaMailSenderService {

    private final ObjectMapper objectMapper;

    // Reads GOOGLE_SCRIPT_URL from environment variable via application.yml
    @Value("${app.google.script-url}")
    private String googleScriptUrl;

    // @Async
    public void sendEmail(String fromEmail, String fromName, String toEmail, String toName, String subject, String textContent, String htmlContent) {
        try {
            log.info(">>> [HTTP EMAIL] Dispatching email to {} via Google Webhook", toEmail);

            Map<String, String> payload = new HashMap<>();
            payload.put("to", toEmail);
            payload.put("subject", subject);
            payload.put("htmlBody", htmlContent);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpClient client = HttpClient.newBuilder()
                    .followRedirects(HttpClient.Redirect.NORMAL)
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(googleScriptUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info(">>> [HTTP SUCCESS] Email delivered to: {}", toEmail);
            } else {
                log.error(">>> [HTTP ERROR] Failed with status {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Google Apps Script returned status: " + response.statusCode());
            }

        } catch (Exception e) {
            log.error(">>> [CRITICAL HTTP EMAIL ERROR] Failed sending to {}. Cause: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email via HTTP: " + e.getMessage(), e);
        }
    }
}