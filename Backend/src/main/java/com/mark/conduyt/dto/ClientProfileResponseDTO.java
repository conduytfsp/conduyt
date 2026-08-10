package com.mark.conduyt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientProfileResponseDTO {
    private ProfileData profile;
    private CompanyData company;
    private String clientType;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProfileData {
        private String firstName;
        private String middleName;
        private String lastName;
        private String email;
        private String profilePic;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CompanyData {
        private String companyName;
        private String companyRole;
        private String companyWebsite;
        private String contactNumber;
        private String gstin;
        private String companyAddress;
    }
}