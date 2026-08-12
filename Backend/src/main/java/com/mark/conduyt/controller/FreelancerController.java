package com.mark.conduyt.controller;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.repository.ApplicationRepository;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.UserRepository;
import com.mark.conduyt.service.AnalyticsService;
import com.mark.conduyt.service.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerService freelancerService;
    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;
    private final AnalyticsService analyticsService;

    // GET /api/freelancers/profile
    @GetMapping("/profile")
    public ResponseEntity<FreelancerProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        FreelancerProfileDTO profile = freelancerService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    // GET /api/freelancers/public/{slug}
    @GetMapping("/public/{slug}")
    public ResponseEntity<PublicFreelancerProfileDTO> getPublicProfile(@PathVariable String slug) {
        PublicFreelancerProfileDTO profile = freelancerService.getPublicFreelancerProfile(slug);
        return ResponseEntity.ok(profile);
    }

    @GetMapping
    public ResponseEntity<Page<FreelancerProfileDTO>> getAllFreelancers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Page<FreelancerProfileDTO> freelancers = freelancerService.getPaginatedFreelancers(PageRequest.of(page, size));
        return ResponseEntity.ok(freelancers);
    }

    // PUT /api/freelancers/profile
    @PostMapping("/profile")
    public ResponseEntity<FreelancerProfileDTO> updateProfile(
            @RequestBody FreelancerProfileDTO request,
            Authentication authentication) {
        String email = authentication.getName();
        FreelancerProfileDTO updated = freelancerService.updateProfile(email, request);
        return ResponseEntity.ok(updated);
    }

    // POST /api/freelancers/avatar
    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        String email = authentication.getName();
        String avatarUrl = freelancerService.uploadAvatar(email, file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
    }
    // GET /api/freelancers/portfolio
    @GetMapping("/portfolio")
    public ResponseEntity<FreelancerPortfolioDTO> getPortfolio(Authentication authentication) {
        String email = authentication.getName();
        FreelancerPortfolioDTO portfolio = freelancerService.getPortfolio(email);
        return ResponseEntity.ok(portfolio);
    }

    // PUT /api/freelancers/portfolio
    @PutMapping("/portfolio")
    public ResponseEntity<FreelancerPortfolioDTO> updatePortfolioLinks(
            @RequestBody FreelancerPortfolioDTO request,
            Authentication authentication) {
        String email = authentication.getName();
        FreelancerPortfolioDTO updated = freelancerService.updatePortfolioLinks(email, request);
        return ResponseEntity.ok(updated);
    }

    // POST /api/freelancers/resume
    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        String email = authentication.getName();
        Map<String, String> result = freelancerService.uploadResume(email, file);
        return ResponseEntity.ok(result);
    }

    // DELETE /api/freelancers/resume
    @DeleteMapping("/resume")
    public ResponseEntity<?> deleteResume(Authentication authentication) {
        String email = authentication.getName();
        freelancerService.deleteResume(email);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }
    // GET /api/freelancers/resume/view
    @GetMapping("/resume/view")
    public ResponseEntity<?> viewResume(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        String resumeUrl = freelancer.getCvUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Just return the direct cloud URL to the frontend
        return ResponseEntity.ok(Map.of("url", resumeUrl));
    }
    // GET /api/freelancers/applications
    @GetMapping("/applications")
    public ResponseEntity<List<FreelancerApplicationDTO>> getApplications(Authentication authentication) {
        String email = authentication.getName();
        List<FreelancerApplicationDTO> applications = freelancerService.getApplications(email);
        return ResponseEntity.ok(applications);
    }

    // PATCH /api/freelancers/applications/{id}/withdraw
    @PatchMapping("/applications/{id}/withdraw")
    public ResponseEntity<?> withdrawApplication(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        freelancerService.withdrawApplication(email, id);
        return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully"));
    }

    @GetMapping("/public/featured")
    public ResponseEntity<List<PublicFreelancerProfileDTO>> getFeaturedFreelancers() {
        return ResponseEntity.ok(freelancerService.getFeaturedFreelancers());
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<FreelancerAnalyticsDTO>> getFreelancerAnalytics(Authentication authentication) {
        String email = authentication.getName();
        FreelancerAnalyticsDTO analytics = analyticsService.getFreelancerAnalytics(email);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Analytics fetched successfully",
                analytics
        ));
    }

    // GET /api/freelancers/preferences
    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> getPreferences(Authentication authentication) {
        String email = authentication.getName();
        // Hook this up to your freelancerService to get actual DB value
        boolean notificationsEnabled = freelancerService.getNotificationsEnabled(email);
        return ResponseEntity.ok(Map.of("notificationsEnabled", notificationsEnabled));
    }

    // PUT /api/freelancers/preferences
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<Void>> updatePreferences(
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {
        String email = authentication.getName();
        Boolean notificationsEnabled = request.get("notificationsEnabled");

        // Hook this up to your freelancerService to save to DB
        freelancerService.updateNotificationsEnabled(email, notificationsEnabled);

        return ResponseEntity.ok(new ApiResponse<>(true, "Preferences updated", null));
    }
}