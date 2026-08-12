package com.mark.conduyt.repository;


import aj.org.objectweb.asm.commons.Remapper;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Optional<Freelancer> findByUser(User user);

    // Feature 3: Find all freelancers with notification toggle ON who possess any of the required job skills
    @Query("SELECT DISTINCT f FROM Freelancer f JOIN f.skills s " +
            "WHERE f.notifyOnMatchingJobs = true AND s IN :skills")
    List<Freelancer> findFreelancersToNotifyForSkills(@Param("skills") Set<SkillTag> skills);

    List<Freelancer> findBySkillsIn(Set<SkillTag> attr0);

    // Add this to your repository
    @Query(value = "SELECT f FROM Freelancer f ORDER BY FUNCTION('RAND')")
    Page<Freelancer> findRandomFeatured(Pageable pageable);

    Page<Freelancer> findByUserAccountStatus(AccountStatus status, Pageable pageable);

    @Query("SELECT f FROM Freelancer f JOIN f.user u WHERE u.accountStatus = 'ACTIVE'")
    List<Freelancer> findAllActive();
}
