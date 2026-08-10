package com.mark.conduyt.repository;

import com.mark.conduyt.entity.Application;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // =======================================================
    // FREELANCER ACTIONS
    // =======================================================
    boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);
    boolean existsByJobAndFreelancer(Job job, Freelancer freelancer);
    Optional<Application> findByJobIdAndFreelancerId(Long jobId, Long freelancerId);

    List<Application> findByFreelancerId(Long freelancerId);
    List<Application> findByFreelancer(Freelancer freelancer);

    // =======================================================
    // JOB / CLIENT ACTIONS
    // =======================================================
    Page<Application> findByJobIdOrderByAiCompatibilityScoreDesc(Long jobId, Pageable pageable);

    // Metric 1: Count total applications across all jobs owned by a client
    long countByJob_Client(Client client);

    // Metric 2: Count applications by status (e.g., Shortlisted, Accepted) for a client
    long countByJob_ClientAndStatus(Client client, ApplicationStatus status);

    // Metric 3: Fetch the top 10 highest-scoring applications for a client's dashboard
    List<Application> findTop10ByJob_ClientOrderByAiCompatibilityScoreDesc(Client client);
}