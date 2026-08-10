package com.mark.conduyt.dto;


import com.mark.conduyt.enums.ApplicationStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class ApplicationDTO {
    private Long id;
    private Long freelancerId;
    private String freelancerName;
    private String freelancerProfilePicture;
    private String freelancerSlug;

    // Updated to match your entity
    private String pitch;
    private Double aiCompatibilityScore;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}