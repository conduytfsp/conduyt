package com.mark.conduyt.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JavaMailSenderService {

    // Must be final so @RequiredArgsConstructor injects it automatically
    private final JavaMailSender mailSender;

    // Temporarily commented out @Async so email failures run on the main thread,
    // trigger a transaction rollback, and log the exact SMTP error to Render!
    // @Async
    public void sendEmail(String fromEmail, String fromName, String toEmail, String toName, String subject, String textContent, String htmlContent) {
        try {
            log.info(">>> [SMTP] Attempting connection and dispatching email to: {}", toEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Format: "Conduyt <conduytfsp@gmail.com>"
            helper.setFrom(fromEmail, fromName);

            // Format: "UserName <user@example.com>"
            if (toName != null && !toName.isBlank()) {
                helper.setTo(toName + " <" + toEmail + ">");
            } else {
                helper.setTo(toEmail);
            }

            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = render as HTML

            mailSender.send(message);
            log.info(">>> [SMTP SUCCESS] Email delivered to: {}", toEmail);
        } catch (Exception e) {
            log.error(">>> [CRITICAL SMTP ERROR] Failed sending to {}. Cause: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email via Gmail SMTP: " + e.getMessage(), e);
        }
    }
}