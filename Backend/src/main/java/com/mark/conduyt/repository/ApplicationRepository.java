package com.mark.conduyt.repository;


import com.mark.conduyt.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Check if freelancer has already applied to a specific job
    boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);

    Optional<Application> findByJobIdAndFreelancerId(Long jobId, Long freelancerId);

    // Feature 2: Freelancer's Application history
    List<Application> findByFreelancerId(Long freelancerId);

    // Feature 3 & 5: Paginated list of applications for a job, sorted by AI compatibility score (High -> Low)
    Page<Application> findByJobIdOrderByAiCompatibilityScoreDesc(Long jobId, Pageable pageable);
}