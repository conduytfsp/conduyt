package com.mark.conduyt.service;

import com.mailjet.client.errors.MailjetException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final MailjetService mailjetService;

    @Value("${spring.mail.from:conduytfsp@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.from-name:Conduyt}")
    private String fromName;

    private static final String LOGO_URL = "https://res.cloudinary.com/ztbtz3rm/image/upload/v1784664304/Conduyt-Favicon-Blue_hqhs37.png";
    private static final String BRAND_BLUE = "#007BFF"; // Conduyt Primary Blue
    private static final String BRAND_DARK_BLUE = "#0056b3"; // Conduyt Dark Blue for headers

    /**
     * Reusable Base HTML Template to keep emails consistent.
     * %s placeholders: [1] Title/Preheader, [2] Content Body
     */
    private String getBaseHtmlTemplate(String title, String contentBody) {
        return """
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <div style="text-align: center; padding: 30px 20px; border-bottom: 1px solid #eaeaea;">
                        <img src="%s" alt="Conduyt" style="width: 65px; height: auto;">
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px;">
                        %s
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #fcfcfc; padding: 20px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eaeaea;">
                        <p style="margin: 0;">© 2026 Conduyt. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
                    </div>
                    
                </div>
            </div>
            """.formatted(LOGO_URL, contentBody);
    }

    public void sendRegistrationOtpEmail(String toEmail, String otp, String userName) {
        String subject = "Your Conduyt Verification Code";

        String contentBody = """
            <h2 style="color: %s; margin-top: 0; text-align: center;">Welcome to Conduyt!</h2>
            <p>Hi %s,</p>
            <p>Thank you for joining India's premier freelance marketplace. To verify your email address and activate your account, please use the following One-Time Password (OTP):</p>
            
            <div style="margin: 35px 0; text-align: center;">
                <span style="display: inline-block; padding: 15px 35px; font-size: 32px; font-weight: bold; color: #ffffff; background-color: %s; border-radius: 8px; letter-spacing: 6px;">%s</span>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #666;">This code is valid for <b>3 minutes</b>.</p>
            <p>If you did not initiate this request, please safely ignore this email.</p>
            """.formatted(BRAND_DARK_BLUE, userName, BRAND_BLUE, otp);

        String htmlContent = getBaseHtmlTemplate(subject, contentBody);

        String textContent = "Hi " + userName + ",\n\n"
                + "Welcome to Conduyt! Your verification OTP is: " + otp + "\n\n"
                + "This OTP is valid for 3 minutes. Do not share it with anyone.\n\n"
                + "Best regards,\nThe Conduyt Team";

        try {
            mailjetService.sendEmail(fromEmail, fromName, toEmail, userName, subject, textContent, htmlContent);
            logger.info("Registration OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send registration OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send registration OTP email", e);
        }
    }

    public void sendPasswordResetOtpEmail(String toEmail, String otp, String userName) {
        String subject = "Conduyt - Password Reset Request";

        String contentBody = """
            <h2 style="color: %s; margin-top: 0; text-align: center;">Password Reset Request</h2>
            <p>Hi %s,</p>
            <p>We received a request to reset the password for your Conduyt account. Please use the following code to proceed with resetting your password:</p>
            
            <div style="margin: 35px 0; text-align: center;">
                <span style="display: inline-block; padding: 15px 35px; font-size: 32px; font-weight: bold; color: %s; background-color: #f0f7ff; border: 2px dashed %s; border-radius: 8px; letter-spacing: 6px;">%s</span>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #666;">This code is valid for <b>3 minutes</b>.</p>
            <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
            """.formatted(BRAND_DARK_BLUE, userName, BRAND_BLUE, BRAND_BLUE, otp);

        String htmlContent = getBaseHtmlTemplate(subject, contentBody);

        String textContent = "Hi " + userName + ",\n\n"
                + "We received a request to reset your Conduyt password. Your OTP is: " + otp + "\n\n"
                + "This OTP is valid for 3 minutes.\n\n"
                + "Best regards,\nThe Conduyt Team";

        try {
            mailjetService.sendEmail(fromEmail, fromName, toEmail, userName, subject, textContent, htmlContent);
            logger.info("Password reset OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send password reset OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset OTP email", e);
        }
    }
}