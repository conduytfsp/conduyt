package com.mark.conduyt.dto;

import com.mark.conduyt.enums.JobStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class JobDetailDTO {
    private Long id;
    private String title;
    private String description;

    private Long clientId;
    private String clientSlug;

    // New fields from Entity
    private String aiGenSummary;
    private String contactNo; // Will be safely null unless authorized

    private Double fixedBudget;
    private JobStatus status;
    private LocalDateTime createdAt;

    private String clientName;
    private String clientProfilePicture;

    private Set<String> requiredSkills;
    private int totalApplicationsCount;

    private List<ApplicationDTO> applications;

    private boolean isOwner;
    private boolean isApplied;
}