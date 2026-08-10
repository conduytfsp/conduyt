package com.mark.conduyt.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AnalyticsResponseDTO {
    private Stats stats;
    private List<MonthlyTrend> monthlyTrends;
    private List<ProposalDistribution> proposalDistribution;
    private List<JobMetric> jobMetrics;

    @Data @Builder
    public static class Stats {
        private long jobsPosted;
        private String jobsPostedChange;
        private long totalHires;
        private String conversionRate;
        private long proposalsReceived;
        private String avgProposalsPerJob;
    }

    @Data @Builder
    public static class MonthlyTrend {
        private String month;
        private long proposals;
        private long hires;
    }

    @Data @Builder
    public static class ProposalDistribution {
        private String name;
        private long value;
        private String color;
    }

    @Data @Builder
    public static class JobMetric {
        private String title;
        private String postedDate;
        private long proposals;
        private long hires;
        private String status;
    }
}