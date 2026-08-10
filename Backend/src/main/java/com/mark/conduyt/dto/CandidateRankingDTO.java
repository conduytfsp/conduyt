package com.mark.conduyt.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateRankingDTO {
    private Long id;          // The Application ID (used for the PATCH request)
    private String name;      // Freelancer's full name
    private String role;      // Freelancer's title
    private double match;     // AI Compatibility Score
    private String status;    // "new", "shortlisted", "rejected", "hired"
    private String experience;// Optional, can leave empty string if not tracked
    private String slug;      // Profile slug for routing
    private String image;     // Profile picture URL
}