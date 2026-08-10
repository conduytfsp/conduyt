package com.mark.conduyt.controller;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.service.AnalyticsService;
import com.mark.conduyt.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final AnalyticsService analyticsService;

    // ================= 1. FETCH CLIENT DASHBOARD DATA =================
    // Called by ClientDashboard.jsx on mount (/api/clients/me)
    @GetMapping("/me")
    public ResponseEntity<ClientProfileResponseDTO> getClientData(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        ClientProfileResponseDTO data = clientService.getClientDashboardData(email);
        return ResponseEntity.ok(data);
    }

    // ================= 2. UPDATE PERSONAL PROFILE =================
    // Called by PersonalDetailsView.jsx (/api/clients/profile)
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ClientProfileUpdateDTO updateDto) {

        String email = userDetails.getUsername();
        clientService.updatePersonalProfile(email, updateDto);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Personal details updated successfully",
                null
        ));
    }

    // ================= 3. UPDATE COMPANY DETAILS =================
    // Called by CompanyDetailsView.jsx (/api/clients/company)
    @PutMapping("/company")
    public ResponseEntity<ApiResponse<Void>> updateCompany(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CompanyDetailsUpdateDTO updateDto) {

        String email = userDetails.getUsername();
        clientService.updateCompanyProfile(email, updateDto);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Company details updated successfully",
                null
        ));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {

        // Logic to get Client entity from Email/UserDetails
        Client client = clientService.findClientByEmail(userDetails.getUsername());
        return ResponseEntity.ok(analyticsService.getClientAnalytics(client));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ClientPreferencesDTO> getPreferences(Authentication authentication) {
        String userEmail = authentication.getName();
        ClientPreferencesDTO preferences = clientService.getPreferences(userEmail);
        return ResponseEntity.ok(preferences);
    }

    // PUT /api/clients/preferences
    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(
            @RequestBody ClientPreferencesDTO request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        clientService.updatePreferences(userEmail, request);

        return ResponseEntity.ok(Map.of("message", "Preferences updated successfully"));
    }

    // ================= 4. GET OVERVIEW STATS =================
    // Called by OverviewTab.jsx (/api/clients/stats)
    @GetMapping("/stats")
    public ResponseEntity<ClientStatsWrapperDTO> getOverviewStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        ClientStatsWrapperDTO stats = clientService.getClientOverviewStats(email);
        return ResponseEntity.ok(stats);
    }

    // ================= 5. GET AI RANKINGS =================
    // Called by OverviewTab.jsx (/api/clients/candidates/rankings)
    @GetMapping("/candidates/rankings")
    public ResponseEntity<List<CandidateRankingDTO>> getCandidateRankings(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        List<CandidateRankingDTO> rankings = clientService.getAiCandidateRankings(email);
        return ResponseEntity.ok(rankings);
    }

    // ================= 6. UPDATE CANDIDATE STATUS =================
    // Called by OverviewTab.jsx when clicking the Star/Shortlist icon
    @PatchMapping("/candidates/{applicationId}/status")
    public ResponseEntity<ApiResponse<Void>> updateCandidateStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        String newStatus = payload.get("status"); // e.g., "shortlisted" or "new"

        clientService.updateApplicationStatus(email, applicationId, newStatus);

        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", null));
    }

    // ================= 7. GET PUBLIC CLIENT PROFILE =================
    @GetMapping("/public/{slug}")
    public ResponseEntity<PublicClientProfileDTO> getPublicProfile(@PathVariable String slug) {
        PublicClientProfileDTO profile = clientService.getPublicClientProfile(slug);
        return ResponseEntity.ok(profile);
    }

    // ================= ACTION PROPOSAL (ACCEPT/REJECT/SHORTLIST) =================
    @PatchMapping("/proposals/{proposalId}/action")
    public ResponseEntity<ApiResponse<Void>> actionProposal(
            @PathVariable Long proposalId,
            @RequestBody Map<String, String> payload,
            Principal principal) {

        try {
            String statusStr = payload.get("status");
            // Automatically converts "ACCEPTED", "REJECTED", "SHORTLISTED" into the Enum
            ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());

            clientService.actionProposal(principal.getName(), proposalId, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Proposal " + statusStr + " successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid status provided", null));
        }
    }
}