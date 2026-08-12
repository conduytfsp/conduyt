package com.mark.conduyt.service;

import com.mark.conduyt.dto.ClientJobDTO;
import com.mark.conduyt.dto.JobCreateRequest;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.JobStatus;
import com.mark.conduyt.event.JobPostedEvent;
import com.mark.conduyt.repository.ClientRepository;
import com.mark.conduyt.repository.JobRepository;
import com.mark.conduyt.repository.SkillTagRepository;
import com.mark.conduyt.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final SkillTagRepository skillTagRepository;
    private final AiService aiService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Job createJob(JobCreateRequest request, String authenticatedEmail) {
        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setFixedBudget(request.getFixedBudget());
        job.setContactNo(request.getContactNo());
        job.setStatus(JobStatus.OPEN);
        job.setCreatedAt(LocalDateTime.now());
        job.setClient(client);

        // Fetch required SkillTags from IDs
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<SkillTag> skills = new HashSet<>(skillTagRepository.findAllById(request.getSkillIds()));
            job.setRequiredSkills(skills);
        }

        // Generate AI Summary using Azure/GitHub Models
        String aiSummary = aiService.generateJobSummary(request.getDescription());
        job.setAiGenSummary(aiSummary);

        Job savedJob = jobRepository.save(job);

        eventPublisher.publishEvent(new JobPostedEvent(this, savedJob));

        return savedJob;
    }


    // Add this to your JobService.java

    @Transactional
    public void updateJobStatus(Long jobId, String status, String email) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify client owns the job
        if (!job.getClient().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        job.setStatus(JobStatus.valueOf(status.toUpperCase()));
        jobRepository.save(job);
    }

    @Transactional(rollbackFor = Exception.class)
    public ClientJobDTO updateJob(Long jobId, JobCreateRequest request, String userEmail) {
        // 1. Fetch the existing job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

        // 2. OWNERSHIP CHECK: Ensure the requesting user owns this job
        if (job.getClient() == null || job.getClient().getUser() == null ||
                !job.getClient().getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized: You do not have permission to edit this job post.");
        }

        // 3. Update basic details
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setFixedBudget(request.getFixedBudget());
        job.setContactNo(request.getContactNo());

        // 4. Update Skill Tags
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<SkillTag> updatedSkills = request.getSkillIds().stream()
                    .map(skillId -> skillTagRepository.findById(skillId)
                            .orElseThrow(() -> new RuntimeException("Skill tag not found with ID: " + skillId)))
                    .collect(Collectors.toSet());
            job.setRequiredSkills(updatedSkills);
        }

        // 5. Save the updated job
        Job savedJob = jobRepository.save(job);

        // 6. Map and return DTO
        ClientJobDTO dto = new ClientJobDTO();
        dto.setId(savedJob.getId());
        dto.setTitle(savedJob.getTitle());
        dto.setFixedBudget(savedJob.getFixedBudget());
        dto.setStatus(savedJob.getStatus());
        dto.setCreatedAt(savedJob.getCreatedAt());

        return dto;
    }
}