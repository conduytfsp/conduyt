package com.mark.conduyt.repository;

import com.mark.conduyt.entity.Job;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.enums.JobStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(String keyword, Double minBudget, Double maxBudget, List<Long> skillIds) {
        return (root, query, criteriaBuilder) -> {

            // Start with a base predicate that is always true (1=1)
            var predicate = criteriaBuilder.conjunction();

            // 1. Always filter to only show OPEN jobs in the feed
            predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), JobStatus.OPEN));

            // 2. Search Keyword (checks if title OR description contains the text)
            if (StringUtils.hasText(keyword)) {
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                var titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                var descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);

                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(titleMatch, descMatch));
            }

            // 3. Minimum Budget
            if (minBudget != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("fixedBudget"), minBudget));
            }

            // 4. Maximum Budget
            if (maxBudget != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("fixedBudget"), maxBudget));
            }

            // 5. Skill Tags via Subquery (prevents pagination count query bugs & duplicate rows)
            if (skillIds != null && !skillIds.isEmpty()) {
                Subquery<Long> skillSubquery = query.subquery(Long.class);
                Root<Job> subJobRoot = skillSubquery.from(Job.class);
                Join<Job, SkillTag> subSkillsJoin = subJobRoot.join("requiredSkills");

                skillSubquery.select(subJobRoot.get("id"))
                        .where(subSkillsJoin.get("id").in(skillIds));

                predicate = criteriaBuilder.and(predicate, root.get("id").in(skillSubquery));
            }

            return predicate;
        };
    }
}