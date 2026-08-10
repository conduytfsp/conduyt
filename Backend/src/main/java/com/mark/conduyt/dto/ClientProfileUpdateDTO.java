package com.mark.conduyt.dto;

import lombok.Data;

@Data
public class ClientProfileUpdateDTO {
    private String clientType; // "company" or "individual"
    private String firstName;
    private String middleName;
    private String lastName;
    private String profilePic; // Base64 string or image URL
}