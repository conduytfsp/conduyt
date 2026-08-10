package com.mark.conduyt.service;

import com.mark.conduyt.dto.AnalyticsResponseDTO;
import com.mark.conduyt.dto.FreelancerAnalyticsDTO;
import com.mark.conduyt.entity.*;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.enums.JobStatus;
import com.mark.conduyt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;

    public AnalyticsResponseDTO getClientAnalytics(Client client) {
        List<Job> jobs = jobRepository.findByClient(client);
        List<Application> allApps = jobs.stream()
                .flatMap(j -> j.getApplications().stream())
                .collect(Collectors.toList());

        // 1. Calculate Core Stats
        long totalJobs = jobs.size();
        long totalProposals = allApps.size();
        long totalHires = allApps.stream().filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED).count();

        AnalyticsResponseDTO.Stats stats = AnalyticsResponseDTO.Stats.builder()
                .jobsPosted(totalJobs)
                .jobsPostedChange("+0 this month") // Add logic for date filtering if needed
                .totalHires(totalHires)
                .conversionRate(totalProposals > 0 ? (totalHires * 100 / totalProposals) + "% conversion" : "0% conversion")
                .proposalsReceived(totalProposals)
                .avgProposalsPerJob(totalJobs > 0 ? "Avg. " + (totalProposals / totalJobs) + " per job" : "0 per job")
                .build();

        // 2. Monthly Trends (Group by CreatedAt month)
        Map<String, List<Application>> appsByMonth = allApps.stream()
                .collect(Collectors.groupingBy(a -> a.getAppliedAt().format(DateTimeFormatter.ofPattern("MMM"))));

        List<AnalyticsResponseDTO.MonthlyTrend> trends = appsByMonth.entrySet().stream()
                .map(entry -> AnalyticsResponseDTO.MonthlyTrend.builder()
                        .month(entry.getKey())
                        .proposals(entry.getValue().size())
                        .hires(entry.getValue().stream().filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED).count())
                        .build())
                .collect(Collectors.toList());

        // 3. Proposal Status Distribution
        Map<ApplicationStatus, Long> statusCount = allApps.stream()
                .collect(Collectors.groupingBy(Application::getStatus, Collectors.counting()));

        List<AnalyticsResponseDTO.ProposalDistribution> dist = statusCount.entrySet().stream()
                .map(e -> AnalyticsResponseDTO.ProposalDistribution.builder()
                        .name(e.getKey().toString())
                        .value(e.getValue())
                        .color(getColorForStatus(e.getKey()))
                        .build())
                .collect(Collectors.toList());

        // 4. Per-Job Metrics
        List<AnalyticsResponseDTO.JobMetric> jobMetrics = jobs.stream()
                .map(job -> AnalyticsResponseDTO.JobMetric.builder()
                        .title(job.getTitle())
                        .postedDate(job.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")))
                        .proposals(job.getApplications().size())
                        .hires(job.getApplications().stream().filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED).count())
                        .status(job.getStatus().toString())
                        .build())
                .collect(Collectors.toList());

        return AnalyticsResponseDTO.builder()
                .stats(stats)
                .monthlyTrends(trends)
                .proposalDistribution(dist)
                .jobMetrics(jobMetrics)
                .build();
    }

    private String getColorForStatus(ApplicationStatus status) {
        return switch (status) {
            case SUBMITTED -> "#1798D7";    // Blue
            case SHORTLISTED -> "#4AB7B2";  // Teal
            case ACCEPTED -> "#09D66D";     // Brand Green (Hires)
            case REJECTED -> "#F43F5E";     // Rose/Red
            case WITHDRAWN -> "#9CA3AF";    // Gray
        };
    }

    public FreelancerAnalyticsDTO getFreelancerAnalytics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        List<Application> applications = applicationRepository.findByFreelancer(freelancer);

        int totalApplications = applications.size();

        // Active contracts: Application is ACCEPTED and Job is IN_PROGRESS
        long activeContracts = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED && a.getJob().getStatus() == JobStatus.IN_PROGRESS)
                .count();

        // Completed jobs: Application is ACCEPTED and Job is COMPLETED
        long completedJobs = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED && a.getJob().getStatus() == JobStatus.COMPLETED)
                .count();

        // Total Earned: Sum of fixedBudget for completed jobs
        double totalEarned = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED && a.getJob().getStatus() == JobStatus.COMPLETED)
                .mapToDouble(a -> a.getJob().getFixedBudget() != null ? a.getJob().getFixedBudget() : 0.0)
                .sum();

        // Win Rate: Percentage of applications that resulted in a hire
        long totalHired = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED)
                .count();
        int winRate = totalApplications == 0 ? 0 : (int) Math.round((double) totalHired / totalApplications * 100);

        // Rejected or Ghosted: Explicitly rejected
        long rejectedOrGhosted = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.REJECTED)
                .count();

        // Calculate Monthly Applications (Last 6 Months)
        List<FreelancerAnalyticsDTO.MonthlyApplicationStatDTO> monthlyStats = new ArrayList<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM"); // e.g., "Jan", "Feb"

        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.from(now.minusMonths(i));
            String monthName = targetMonth.format(formatter);

            int monthApps = (int) applications.stream()
                    .filter(a -> a.getAppliedAt() != null && YearMonth.from(a.getAppliedAt()).equals(targetMonth))
                    .count();

            int monthHires = (int) applications.stream()
                    .filter(a -> a.getAppliedAt() != null
                            && YearMonth.from(a.getAppliedAt()).equals(targetMonth)
                            && a.getStatus() == ApplicationStatus.ACCEPTED)
                    .count();

            monthlyStats.add(new FreelancerAnalyticsDTO.MonthlyApplicationStatDTO(monthName, monthApps, monthHires));
        }

        return new FreelancerAnalyticsDTO(
                totalApplications,
                activeContracts,
                completedJobs,
                totalEarned,
                winRate,
                rejectedOrGhosted,
                monthlyStats
        );
    }
}