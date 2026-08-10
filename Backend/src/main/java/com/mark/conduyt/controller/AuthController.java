package com.mark.conduyt.controller;


import com.mark.conduyt.dto.ApiResponse;
import com.mark.conduyt.dto.LoginRequest;
import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.TargetRole;
import com.mark.conduyt.repository.UserRepository;
import com.mark.conduyt.security.JwtService;
import com.mark.conduyt.service.ClientService;
import com.mark.conduyt.service.FreelancerService;
import com.mark.conduyt.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.core.AuthenticationException;
import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final FreelancerService freelancerService;
    private final ClientService clientService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

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

    @PostMapping("/login")
    @Transactional // CRITICAL: Required to safely check the LAZY loaded Client/Freelancer profiles
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginRequest request) {
        try {
            // 1. Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Fetch User
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            // 3. Generate JWT
            String token = jwtService.generateToken(user);
            long sevenDaysInSeconds = 7 * 24 * 60 * 60;

            // 4. Check which profiles they have attached
            boolean hasClient = user.getClient() != null;
            boolean hasFreelancer = user.getFreelancer() != null;
            boolean isAdmin = user.isAdmin();

            // Pick a default view for the frontend to route to.
            // (If they are a freelancer, go there. Otherwise client. If neither, maybe an onboarding page)
            String defaultMode = hasFreelancer ? "freelancer" : (hasClient ? "client" : "onboarding");
            if (isAdmin) defaultMode = "admin";

            // 5a. Cookie #1: The Security Token (HttpOnly - Hidden)
            ResponseCookie jwtCookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(true)
                    .secure(false) // CHANGE TO TRUE IN PRODUCTION
                    .path("/")
                    .maxAge(sevenDaysInSeconds)
                    .sameSite("Lax")
                    .build();

            // 5b. Cookie #2: The Active Mode (Visible - Tells React where to redirect on login)
            ResponseCookie modeCookie = ResponseCookie.from("active_mode", defaultMode)
                    .httpOnly(false)
                    .secure(false) // CHANGE TO TRUE IN PRODUCTION
                    .path("/")
                    .maxAge(sevenDaysInSeconds)
                    .sameSite("Lax")
                    .build();

            // 5c. Cookie #3: Available Profiles (Visible - Tells React to show/hide the "Switch Modes" button)
            String profilesStr = "NONE";
            if (hasClient && hasFreelancer) {
                profilesStr = "CLIENT-FREELANCER";
            } else if (hasClient) {
                profilesStr = "CLIENT";
            } else if (hasFreelancer) {
                profilesStr = "FREELANCER";
            }

            ResponseCookie profilesCookie = ResponseCookie.from("available_profiles", profilesStr)
                    .httpOnly(false)
                    .secure(false) // CHANGE TO TRUE IN PRODUCTION
                    .path("/")
                    .maxAge(sevenDaysInSeconds)
                    .sameSite("Lax")
                    .build();

            // 6. Return Response with ALL Cookies
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, modeCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, profilesCookie.toString())
                    .body(new ApiResponse<>(true, "Login successful", null));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid email or password", null));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Login failed due to an internal error", null));
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<ApiResponse<Boolean>> validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = userService.validateOtp(email, otp);
        ApiResponse<Boolean> response = new ApiResponse<>(isValid, "OTP validation successful.", null);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/verify-user")
    public ResponseEntity<ApiResponse<Boolean>> verifyUser(@RequestParam String email, @RequestParam String otp) {
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