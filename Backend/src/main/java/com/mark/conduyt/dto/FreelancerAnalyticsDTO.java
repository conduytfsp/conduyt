package com.mark.conduyt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerAnalyticsDTO {
    private int totalApplications;
    private long activeContracts;
    private long completedJobs;
    private double totalEarned;
    private int winRate;
    private long rejectedOrGhosted;
    private List<MonthlyApplicationStatDTO> monthlyApplications;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyApplicationStatDTO {
        private String month;
        private int applications;
        private int hires;
    }
}