package com.mark.conduyt.dto;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ClientPreferencesDTO {
    // Getters and Setters
    private Boolean notificationsEnabled;
    private Double aiMatchThreshold;

}