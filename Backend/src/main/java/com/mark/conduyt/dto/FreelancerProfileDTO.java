package com.mark.conduyt.dto;

import lombok.Data;

import java.util.List;

@Data
public class FreelancerProfileDTO {
    private String firstName;
    private String lastName;
    private String professionalTitle;
    private String bio;
    private List<String> skills;
    private String avatarUrl;
    private String email;
    private boolean emailVerified;
}