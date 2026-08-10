package com.mark.conduyt.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FreelancerApplicationDTO {
    private Long id;
    private String jobTitle;
    private Double fixedBudget;
    private String clientName;
    private String clientType;
    private String clientEmail;
    private String contactNo;
    private LocalDateTime appliedDate;

    // Application status (SUBMITTED, SHORTLISTED, ACCEPTED, etc.)
    private String status;

    // NEW: Job status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
    private String jobStatus;

    private Double aiCompatibilityScore;
    private String pitch;
    private String jobDescription;
}