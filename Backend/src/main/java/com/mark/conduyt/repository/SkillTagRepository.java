package com.mark.conduyt.repository;


import com.mark.conduyt.entity.SkillTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface SkillTagRepository extends JpaRepository<SkillTag, Long> {

    // Find tag by normalized name (e.g., "SPRING_BOOT")
    Optional<SkillTag> findByName(String name);

    // Bulk fetch existing tags by set of names
    Set<SkillTag> findByNameIn(Set<String> names);

    boolean existsByName(String name);

    Optional<SkillTag> findByNameIgnoreCase(String normalizedName);
}