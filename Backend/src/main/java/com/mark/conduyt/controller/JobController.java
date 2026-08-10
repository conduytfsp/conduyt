package com.mark.conduyt.controller;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.service.JobService;
import com.mark.conduyt.service.JobFetchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JobFetchService jobFetchService;



    // ==========================================
    // 2. GET CLIENT'S POSTED JOBS (Dashboard)
    // ==========================================
    @GetMapping("/client")
    public ResponseEntity<ApiResponse<Page<ClientJobDTO>>> getClientJobs(
            Principal principal,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        Page<ClientJobDTO> jobs = jobFetchService.getClientJobs(principal.getName(), pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Client jobs fetched successfully", jobs));
    }

    // ==========================================
    // 3. GET GENERAL JOB FEED (Search & Filter)
    // ==========================================
    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<Page<FreelancerJobDTO>>> getJobFeed(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) List<Long> skillIds,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        Page<FreelancerJobDTO> feed = jobFetchService.getJobFeed(keyword, minBudget, maxBudget, skillIds, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job feed fetched successfully", feed));
    }

    // ==========================================
    // 4. GET SINGLE JOB DETAILS (Smart View)
    // ==========================================
    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobDetailDTO>> getSingleJob(
            @PathVariable Long jobId,
            Principal principal
    ) {
        String email = (principal != null) ? principal.getName() : null;
        JobDetailDTO jobDetail = jobFetchService.getJobById(jobId, email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Job details fetched successfully", jobDetail));
    }

    // ==========================================
    // 5. GET FREELANCER'S APPLIED JOBS (Dashboard)
    // ==========================================
    @GetMapping("/freelancer/applied")
    public ResponseEntity<ApiResponse<Page<FreelancerJobDTO>>> getFreelancerAppliedJobs(
            Principal principal,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        Page<FreelancerJobDTO> jobs = jobFetchService.getFreelancerAppliedJobs(principal.getName(), pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Applied jobs fetched successfully", jobs));
    }

    @PatchMapping("/{jobId}/status")
    public ResponseEntity<ApiResponse<Void>> updateJobStatus(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> statusMap, // Expecting {"status": "CANCELLED"}
            Principal principal
    ) {
        String status = statusMap.get("status");
        jobService.updateJobStatus(jobId, status, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientJobDTO>> postJob(
            @Valid @RequestBody JobCreateRequest request,
            Principal principal) {
        Job createdJob = jobService.createJob(request, principal.getName());

        // Map to DTO to prevent Jackson circular reference / stack overflow errors
        ClientJobDTO responseDto = new ClientJobDTO();
        responseDto.setId(createdJob.getId());
        responseDto.setTitle(createdJob.getTitle());
        responseDto.setFixedBudget(createdJob.getFixedBudget());
        responseDto.setStatus(createdJob.getStatus());
        responseDto.setCreatedAt(createdJob.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Job posted successfully", responseDto));
    }

    @GetMapping("/public/featured")
    public ResponseEntity<List<JobSummaryDTO>> getFeaturedJobs() {
        return ResponseEntity.ok(jobFetchService.getFeaturedJobs());
    }
}