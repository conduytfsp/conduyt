package com.mark.conduyt.repository;


import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.SkillTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {

    // Find Freelancer profile by associated core User ID
    Optional<Freelancer> findByUserId(Long userId);

    // Feature 3: Find all freelancers with notification toggle ON who possess any of the required job skills
    @Query("SELECT DISTINCT f FROM Freelancer f JOIN f.skills s " +
            "WHERE f.notifyOnMatchingJobs = true AND s IN :skills")
    List<Freelancer> findFreelancersToNotifyForSkills(@Param("skills") Set<SkillTag> skills);
}
