package com.mark.conduyt.controller;

import com.mark.conduyt.dto.ApiResponse;
import com.mark.conduyt.dto.ApplicationSubmitRequest;
import com.mark.conduyt.entity.Application;
import com.mark.conduyt.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // ==========================================
    // SUBMIT APPLICATION TO A JOB
    // ==========================================
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<ApiResponse<Void>> applyToJob(
            @PathVariable Long jobId,
            @Valid @RequestBody ApplicationSubmitRequest request,
            Principal principal
    ) {
        applicationService.submitApplication(jobId, request, principal.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Application submitted successfully", null));
    }
}