package com.mark.conduyt.controller;


import com.mark.conduyt.dto.ApiResponse;
import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.enums.TargetRole;
import com.mark.conduyt.service.ClientService;
import com.mark.conduyt.service.FreelancerService;
import com.mark.conduyt.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final FreelancerService freelancerService;
    private final ClientService clientService;
    private final UserService userService;

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<String>> registerUser(
            @Valid @RequestPart("data") UserRegisterRequestDTO request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "cv", required = false) MultipartFile cvFile,
            @RequestPart(value = "companyLogo", required = false) MultipartFile companyLogo) throws IOException {

        if (request.getTargetRole() == TargetRole.FREELANCER) {
            freelancerService.createFreelancer(request, profileImage, cvFile);
        } else if (request.getTargetRole() == TargetRole.CLIENT) {
            // Pass the companyLogo to the Client creation logic
            clientService.createClient(request, profileImage, companyLogo);
        }

        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Registration successful. Please verify your email.",
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<ApiResponse<Boolean>> validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = userService.validateUser(email, otp);
        ApiResponse<Boolean> response = new ApiResponse<>(isValid, "OTP validation successful.", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password-initiate")
    public ResponseEntity<ApiResponse<String>> initiatePasswordReset(@RequestParam String email) {
        userService.initiatePasswordReset(email);
        ApiResponse<String> response = new ApiResponse<>(true, "Password reset initiated. Please check your email for the OTP.", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestParam String email,
            @RequestParam String newPassword
    ) {
        userService.resetPassword(email, newPassword);
        ApiResponse<String> response = new ApiResponse<>(true, "Password reset successfully.", null);
        return ResponseEntity.ok(response);
    }

}