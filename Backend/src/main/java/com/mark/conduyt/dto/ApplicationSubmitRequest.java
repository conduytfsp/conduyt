package com.mark.conduyt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApplicationSubmitRequest {

    @NotBlank(message = "Pitch is required")
    @Size(min = 20, message = "Pitch must be at least 20 characters long")
    private String pitch;
}