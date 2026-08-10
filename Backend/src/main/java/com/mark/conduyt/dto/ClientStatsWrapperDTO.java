package com.mark.conduyt.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientStatsWrapperDTO {
    private ClientStatsDTO stats;

    @Data
    @Builder
    public static class ClientStatsDTO {
        private long activeJobs;
        private long applications;
        private long shortlisted;
        private long hired;
    }
}