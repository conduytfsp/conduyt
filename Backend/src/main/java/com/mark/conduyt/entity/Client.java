package com.mark.conduyt.entity;

import com.mark.conduyt.enums.ClientType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1-to-1 linkage to central User identity
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientType clientType = ClientType.INDIVIDUAL;

    // Linked company entity (NULL if clientType == INDIVIDUAL)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    // Real-time event notifications toggle for high-match candidates
    @Column(nullable = false)
    private boolean notifyOnHighMatchCandidate = true;

    // Minimum AI score (0-100) required to trigger a push notification
    @Column(nullable = false)
    private Double matchThresholdScore = 80.0;

    // Client's complete Job posting history
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Job> jobs = new ArrayList<>();

    // Updated convenience method
    public String getDisplayName() {
        if (this.clientType == ClientType.COMPANY && this.company != null) {
            return this.company.getName();
        }
        return this.user != null ? this.user.getFullName() : "Client";
    }
}