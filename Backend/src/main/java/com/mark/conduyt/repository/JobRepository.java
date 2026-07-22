package com.mark.conduyt.repository;


import com.mark.conduyt.entity.Job;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Feature 2: Client's Job history
    List<Job> findByClientId(Long clientId);

    // Feature 4: Paginated feed for open jobs
    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    // Feature 6: Dynamic Tag & Budget Filtering for active jobs
    @Query("SELECT DISTINCT j FROM Job j JOIN j.requiredSkills s " +
            "WHERE j.status = 'OPEN' " +
            "AND j.budgetMin >= :minBudget " +
            "AND j.budgetMax <= :maxBudget " +
            "AND s IN :skills")
    Page<Job> filterOpenJobs(
            @Param("skills") Set<SkillTag> skills,
            @Param("minBudget") Double minBudget,
            @Param("budgetMax") Double maxBudget,
            Pageable pageable
    );
}
