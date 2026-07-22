package com.mark.conduyt.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JavaMailSenderService {

    // Must be final so @RequiredArgsConstructor injects it automatically
    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(String fromEmail, String fromName, String toEmail, String toName, String subject, String textContent, String htmlContent) {
        try {
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
            System.out.println("Gmail SMTP Success! Email sent to: " + toEmail);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via Gmail SMTP: " + e.getMessage(), e);
        }
    }
}