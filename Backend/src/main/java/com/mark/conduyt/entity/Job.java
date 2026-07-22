package com.mark.conduyt.entity;


import com.mark.conduyt.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The client who posted the project
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String title;

    // Markdown-enabled detailed job description
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    // Feature 6: Token-saving AI summary cached on creation/first view
    @Column(columnDefinition = "TEXT")
    private String aiGenSummary;

    // Budget range fields
    @Column(nullable = false)
    private Double budgetMin;

    @Column(nullable = false)
    private Double budgetMax;

    private String duration; // e.g., "1-3 months", "< 1 week"

    // Independent status tracking for the Job post
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.OPEN;

    // Tech Stack Tags required for this job
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "job_skills",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_tag_id")
    )
    private Set<SkillTag> requiredSkills = new HashSet<>();

    // Applications received for this job
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}