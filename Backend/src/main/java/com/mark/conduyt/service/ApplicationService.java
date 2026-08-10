package com.mark.conduyt.service;

import com.mark.conduyt.dto.ApplicationSubmitRequest;
import com.mark.conduyt.entity.*;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.enums.JobStatus;
import com.mark.conduyt.event.ApplicationSubmittedEvent;
import com.mark.conduyt.repository.*;
import com.mark.conduyt.util.PdfTextExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;
    private final AiService aiService;
    private final PdfTextExtractor pdfTextExtractor;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Application submitApplication(Long jobId, ApplicationSubmitRequest request, String authenticatedEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalStateException("Cannot apply to a job that is not OPEN");
        }

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        // Guardrail 1: Prevent Client from applying to their own job
        if (job.getClient().getUser().getEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException("Clients cannot apply to their own job postings");
        }

        // Guardrail 2: Prevent duplicate applications
        boolean alreadyApplied = applicationRepository.existsByJobAndFreelancer(job, freelancer);
        if (alreadyApplied) {
            throw new IllegalStateException("You have already submitted an application for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setPitch(request.getPitch());
        application.setStatus(ApplicationStatus.SUBMITTED);
        application.setAppliedAt(LocalDateTime.now());

        // Extract PDF CV Text if attached to profile
        String cvText = "";
        if (freelancer.getCvUrl() != null && !freelancer.getCvUrl().isBlank()) {
            cvText = pdfTextExtractor.extractTextFromUrl(freelancer.getCvUrl());
        }

        // Extract Skill names
        List<String> jobSkills = job.getRequiredSkills() != null
                ? job.getRequiredSkills().stream().map(SkillTag::getName).toList()
                : List.of();

        List<String> freelancerSkills = freelancer.getSkills() != null
                ? freelancer.getSkills().stream().map(SkillTag::getName).toList()
                : List.of();

        // Calculate AI Compatibility Score (Job Description + Pitch + Skills + PDF CV)
        double score = aiService.calculateCompatibilityScore(
                job.getDescription(),
                jobSkills,
                request.getPitch(),
                freelancerSkills,
                cvText
        );
        application.setAiCompatibilityScore(score);
        Application applicationResult = applicationRepository.save(application);

        eventPublisher.publishEvent(new ApplicationSubmittedEvent(this, applicationResult));

        return applicationResult;
    }
}