package com.mark.conduyt.dto;


import com.mark.conduyt.enums.JobStatus;
import lombok.Data;

import java.time.LocalDateTime;

import lombok.Data;
import java.time.LocalDateTime;

@Data // <-- Crucial: Generates getters/setters so Jackson can read it
public class ClientJobDTO {
    private Long id;
    private String title;
    private Double fixedBudget;
    private JobStatus status;
    private LocalDateTime createdAt;
    private int totalProposals;

    // Make sure these are here!
    private String description;
    private String aiGenSummary;
}