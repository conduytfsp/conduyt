package com.mark.conduyt.dto;
import lombok.Data;
import java.util.List;

@Data
public class PublicFreelancerProfileDTO {
    private String displayName;
    private String title;
    private String bio;
    private String pfpUrl;
    private String email;
    private String slug;

    // --- Analytics ---
    private int totalJobsDone;
    private double totalEarnings;

    // --- Skills ---
    private List<String> skills;

    // --- External Links ---
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String cvUrl;

    // --- Dual Account Flag ---
    private boolean hasClientProfile;
}