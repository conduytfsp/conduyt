package com.mark.conduyt.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SkillTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique normalized tag name for DB queries and AI matching (e.g., "SPRING_BOOT", "REACT")
    @Column(nullable = false, unique = true)
    private String name;

    // Human-readable display label for the UI (e.g., "Spring Boot", "React")
    @Column(nullable = false)
    private String label;
}