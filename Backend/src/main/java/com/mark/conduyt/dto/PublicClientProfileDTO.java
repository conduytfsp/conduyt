package com.mark.conduyt.dto;
import lombok.Data;

@Data
public class PublicClientProfileDTO {
    private String displayName;
    private String clientType;
    private String pfpUrl;
    private String email;

    // --- Analytics ---
    private int totalJobsPosted;
    private int totalHires;
    private double totalSpent;

    // --- Dual Account Flag ---
    private boolean hasFreelancerProfile; // <-- ADD THIS

    // --- Company Fields ---
    private boolean verified;
    private String websiteUrl;
    private String contactNumber;
    private String address;
}