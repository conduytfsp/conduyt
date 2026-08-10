package com.mark.conduyt.dto;

import lombok.Data;

@Data
public class CompanyDetailsUpdateDTO {
    private String companyName;
    private String companyRole;
    private String companyWebsite;
    private String contactNumber;
    private String gstin;
    private String companyAddress;
}