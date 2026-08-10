package com.mark.conduyt.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobSummaryDTO {
    private Long id;
    private String title;
    private Double fixedBudget;
    private String clientName;
    private LocalDateTime createdAt;
    private String status;
    private List<String> tags; // Assuming your job has tags or categories
}