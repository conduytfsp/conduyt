package com.mark.conduyt.dto;


import com.mark.conduyt.enums.JobStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class FreelancerJobDTO {
    private Long id;
    private String title;
    private Double fixedBudget;
    private String status;
    private LocalDateTime createdAt;

    // Client Info
    private String clientName;
    private String clientType;
    private String clientProfilePicture;

    // Job Details
    private String aiGenSummary;
    private String description;
    private List<String> requiredSkills;
}