package com.mark.conduyt.listener;

import com.mark.conduyt.entity.Application;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.entity.Notification;
import com.mark.conduyt.event.ApplicationSubmittedEvent;
import com.mark.conduyt.event.JobPostedEvent;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.NotificationRepository;
import com.mark.conduyt.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final FreelancerRepository freelancerRepository;
    private final SseService sseService;

    // =========================================================================
    // 1. FREELANCER NOTIFICATIONS: New Job matches their skills
    // =========================================================================
    @Async
    @EventListener
    public void handleJobPosted(JobPostedEvent event) {
        Job job = event.getJob();

        // Find freelancers whose skills overlap with the job's required skills
        List<Freelancer> matchingFreelancers = freelancerRepository.findBySkillsIn(job.getRequiredSkills());

        for (Freelancer freelancer : matchingFreelancers) {
            // Don't notify the client who posted it if they also have a freelancer profile
            if (freelancer.getUser().getId().equals(job.getClient().getUser().getId())) {
                continue;
            }

            Notification n = new Notification();
            n.setUserId(freelancer.getUser().getId());
            n.setTitle("New Skill Match!");
            n.setMessage("A new job '" + job.getTitle() + "' matches your profile skills.");
            n.setType("JOB_MATCH");
            n.setTargetUrl("/jobs/" + job.getId());

            notificationRepository.save(n);
            sseService.pushNotification(n.getUserId(), n);
        }
    }

    // =========================================================================
    // 2. CLIENT NOTIFICATIONS: Applicant exceeds their AI threshold
    // =========================================================================
    @Async
    @EventListener
    public void handleApplicationSubmitted(ApplicationSubmittedEvent event) {
        Application app = event.getApplication();
        Job job = app.getJob();
        com.mark.conduyt.entity.Client client = job.getClient();

        // Get client's custom threshold (fallback to 85% if null)
        double clientThreshold =  (client.getMatchThresholdScore() > 0 ?  client.getMatchThresholdScore() : 85);
        double applicantScore = app.getAiCompatibilityScore();

        // Check if the score crosses the client's threshold
        if (applicantScore >= clientThreshold) {
            Long clientUserId = client.getUser().getId();
            String freelancerName = app.getFreelancer().getUser().getFullName();

            Notification n = new Notification();
            n.setUserId(clientUserId);
            n.setTitle("Top-Tier AI Candidate!");
            n.setMessage(freelancerName + " applied for '" + job.getTitle() + "' with a " + (int)applicantScore + "% AI Match!");
            n.setType("AI_CANDIDATE");
            n.setTargetUrl("/dashboard/jobs/" + job.getId() + "/proposals");

            notificationRepository.save(n);
            sseService.pushNotification(clientUserId, n);
        }
    }
}