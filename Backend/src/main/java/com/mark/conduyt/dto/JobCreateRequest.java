package com.mark.conduyt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.Set;

@Data

public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotNull(message = "Fixed budget is required")
    @Positive(message = "Budget must be greater than zero")
    private Double fixedBudget;

    private String contactNo; // Optional contact number for the hired freelancer

    private Set<Long> skillIds; // IDs of required skills from /api/skills
}