package com.mark.conduyt.dto;

import com.mark.conduyt.enums.ClientType;

import com.mark.conduyt.enums.TargetRole;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequestDTO {

    // =========================================================================
    // 1. Core User Identity
    // =========================================================================
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotNull(message = "Target role (FREELANCER or CLIENT) must be specified")
    private TargetRole targetRole;

    // =========================================================================
    // 2. Freelancer Persona Payload
    // =========================================================================
    // Processed when targetRole == TargetRole.FREELANCER

    @Size(max = 100, message = "Professional title cannot exceed 100 characters")
    private String title; // e.g., "Full-Stack Java & React Developer"

    private String bio;

    @Pattern(
            regexp = "^(https?://)?(www\\.)?github\\.com/.*$",
            message = "Invalid GitHub profile URL"
    )
    private String githubUrl;

    @Pattern(
            regexp = "^(https?://)?(www\\.)?linkedin\\.com/in/.*$",
            message = "Invalid LinkedIn profile URL"
    )
    private String linkedinUrl;

    private String portfolioUrl;

    @Builder.Default
    private Set<String> skillNames = new HashSet<>(); // Resolved to SkillTag entities in service layer

    // =========================================================================
    // 3. Client Persona Payload
    // =========================================================================
    // Processed when targetRole == TargetRole.CLIENT

    private ClientType clientType; // INDIVIDUAL or COMPANY

    // =========================================================================
    // 4. B2B Company Details
    // =========================================================================
    // Processed when clientType == ClientType.COMPANY

    private String companyName;

    private String websiteUrl;

    private String companyAddress;

    private String contactNumber;

    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Invalid Indian GSTIN format (e.g., 22AAAAA0000A1Z5)"
    )
    private String gstin;

}