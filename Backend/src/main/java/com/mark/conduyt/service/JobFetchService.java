package com.mark.conduyt.service;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.Application;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.JobStatus;
import com.mark.conduyt.repository.ClientRepository;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.JobRepository;
import com.mark.conduyt.repository.UserRepository;
import com.mark.conduyt.repository.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobFetchService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final FreelancerRepository freelancerRepository;

    // ==========================================
    // 1. GET SINGLE JOB DETAILS (Smart View)
    // ==========================================
    public JobDetailDTO getJobById(Long jobId, String authenticatedEmail) {
        // 1. Fetch Job only (don't force user lookup if not logged in)
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 2. Map Base Details
        JobDetailDTO dto = new JobDetailDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setFixedBudget(job.getFixedBudget());
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());

        // Map New AI & Duration Fields
        dto.setAiGenSummary(job.getAiGenSummary());

        // Map Client details with Profile Picture
        dto.setClientName(job.getClient().getUser().getFullName());
        dto.setClientProfilePicture(job.getClient().getUser().getPfpUrl());

        // Map Client ID and Slug for Routing
        dto.setClientId(job.getClient().getId());
        dto.setClientSlug(job.getClient().getUser().getProfileSlug());

        dto.setTotalApplicationsCount(job.getApplications() != null ? job.getApplications().size() : 0);

        if (job.getRequiredSkills() != null) {
            dto.setRequiredSkills(job.getRequiredSkills().stream()
                    .map(SkillTag::getName)
                    .collect(Collectors.toSet()));
        }

        // 3. Determine Context Flags (Safely handles null authenticatedEmail)
        boolean isOwner = authenticatedEmail != null &&
                job.getClient().getUser().getEmail().equals(authenticatedEmail);
        boolean hasApplied = false;
        Application userApplication = null;

        if (!isOwner && authenticatedEmail != null && job.getApplications() != null) {
            for (Application app : job.getApplications()) {
                if (app.getFreelancer() != null &&
                        app.getFreelancer().getUser() != null &&
                        app.getFreelancer().getUser().getEmail().equals(authenticatedEmail)) {
                    hasApplied = true;
                    userApplication = app;
                    break;
                }
            }
        }

        dto.setOwner(isOwner);
        dto.setApplied(hasApplied);

        // --- SECURITY LOGIC FOR CONTACT NO ---
        if (isOwner) {
            dto.setContactNo(job.getContactNo());
        } else if (hasApplied && userApplication != null && userApplication.getStatus() != null && userApplication.getStatus().name().equals("ACCEPTED")) {
            dto.setContactNo(job.getContactNo());
        } else {
            dto.setContactNo(null);
        }

        // 4. Hydrate the Applications Array
        if (isOwner && job.getApplications() != null) {
            List<ApplicationDTO> allApps = job.getApplications().stream()
                    .map(this::mapToApplicationDTO)
                    .collect(Collectors.toList());
            dto.setApplications(allApps);
        } else if (hasApplied && userApplication != null) {
            dto.setApplications(Collections.singletonList(mapToApplicationDTO(userApplication)));
        } else {
            dto.setApplications(Collections.emptyList());
        }

        return dto;
    }

    // ==========================================
    // 2. GET GENERAL JOB FEED (Search & Filter)
    // ==========================================
    public Page<FreelancerJobDTO> getJobFeed(
            String keyword, Double minBudget, Double maxBudget, List<Long> skillIds, Pageable pageable) {

        // Make sure your JobSpecification only fetches jobs where status == JobStatus.OPEN!
        Specification<Job> spec = JobSpecification.filterJobs(keyword, minBudget, maxBudget, skillIds);
        Page<Job> jobs = jobRepository.findAll(spec, pageable);

        return jobs.map(job -> {
            FreelancerJobDTO dto = new FreelancerJobDTO();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setFixedBudget(job.getFixedBudget());
            dto.setStatus(job.getStatus().name());
            dto.setCreatedAt(job.getCreatedAt());

            // --- UPDATED CLIENT MAPPING ---
            // Uses the convenience method you built in the Client entity
            dto.setClientName(job.getClient().getDisplayName());
            dto.setClientType(job.getClient().getClientType().name());
            dto.setClientProfilePicture(job.getClient().getUser().getPfpUrl());

            // --- UPDATED JOB DETAILS ---
            dto.setAiGenSummary(job.getAiGenSummary());
            dto.setDescription(job.getDescription());

            // --- UPDATED SKILLS MAPPING ---
            // Maps the Set<SkillTag> into a List of Strings for the frontend to render easily
            if (job.getRequiredSkills() != null) {
                List<String> skillNames = job.getRequiredSkills().stream()
                        .map(skill -> skill.getName()) // Use .getLabel() if you prefer UI-friendly names
                        .toList();
                dto.setRequiredSkills(skillNames);
            }

            return dto;
        });
    }

    // ==========================================
    // 3. GET CLIENT'S POSTED JOBS (Dashboard)
    // ==========================================
    public Page<ClientJobDTO> getClientJobs(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found for user"));

        Page<Job> jobs = jobRepository.findByClient(client, pageable);

        return jobs.map(job -> {
            ClientJobDTO dto = new ClientJobDTO();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setFixedBudget(job.getFixedBudget());
            dto.setStatus(job.getStatus());
            dto.setCreatedAt(job.getCreatedAt());
            dto.setDescription(job.getDescription());
            dto.setAiGenSummary(job.getAiGenSummary());
            dto.setTotalProposals(job.getApplications() != null ? job.getApplications().size() : 0);
            return dto;
        });
    }

    // ==========================================
    // 4. GET FREELANCER'S APPLIED JOBS (Dashboard)
    // ==========================================
    public Page<FreelancerJobDTO> getFreelancerAppliedJobs(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user"));

        Page<Job> jobs = jobRepository.findByApplications_Freelancer(freelancer, pageable);

        return jobs.map(job -> {
            FreelancerJobDTO dto = new FreelancerJobDTO();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setFixedBudget(job.getFixedBudget());
            dto.setStatus(String.valueOf(job.getStatus()));
            dto.setCreatedAt(job.getCreatedAt());
            dto.setClientName(job.getClient().getUser().getFirstName() + " " + job.getClient().getUser().getLastName());

            // Map Client Profile Picture
            dto.setClientProfilePicture(job.getClient().getUser().getPfpUrl());

            return dto;
        });
    }

    // ==========================================
    // 5. HELPER METHOD
    // ==========================================
    private ApplicationDTO mapToApplicationDTO(Application app) {
        ApplicationDTO appDto = new ApplicationDTO();
        appDto.setId(app.getId());

        // === NEW LOGIC: Map Freelancer ID and Slug for Routing ===
        appDto.setFreelancerId(app.getFreelancer().getId());
        appDto.setFreelancerSlug(app.getFreelancer().getUser().getProfileSlug());

        appDto.setFreelancerName(app.getFreelancer().getUser().getFullName()); // Cleaned up using getFullName()

        // Map Updated Application Fields
        appDto.setPitch(app.getPitch());
        appDto.setAiCompatibilityScore(app.getAiCompatibilityScore());
        appDto.setStatus(app.getStatus());
        appDto.setAppliedAt(app.getAppliedAt());

        // Map Freelancer Profile Picture
        appDto.setFreelancerProfilePicture(app.getFreelancer().getUser().getPfpUrl());

        return appDto;
    }

    @Transactional(readOnly = true)
    public List<JobSummaryDTO> getFeaturedJobs() {
        // Fetches top 3 open jobs
        List<Job> jobs = jobRepository.findTop3ByStatusOrderByCreatedAtDesc(JobStatus.OPEN);

        return jobs.stream().map(job -> {
            JobSummaryDTO dto = new JobSummaryDTO();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setFixedBudget(job.getFixedBudget());
            dto.setClientName(job.getClient().getDisplayName());
            dto.setCreatedAt(job.getCreatedAt());
            dto.setStatus(job.getStatus().name());

            // If you have skill/tag associations on jobs, map them here:
            // dto.setTags(job.getSkills().stream().map(SkillTag::getName).collect(Collectors.toList()));

            return dto;
        }).collect(Collectors.toList());
    }
}