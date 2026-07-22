package com.mark.conduyt.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "freelancers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1-to-1 linkage to central User identity
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String cvUrl;

    // Feature 5: Dedicated external profile links
    private String githubUrl;

    private String linkedinUrl;

    private String portfolioUrl;

    // Real-time event notifications toggle for matching tech stack jobs
    @Column(nullable = false)
    private boolean notifyOnMatchingJobs = true;

    // Technical Skill Tagging (M:N join table managed automatically)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "freelancer_skills",
            joinColumns = @JoinColumn(name = "freelancer_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_tag_id")
    )
    private Set<SkillTag> skills = new HashSet<>();

    // Feature 2: Application history tracking for the freelancer
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();
}