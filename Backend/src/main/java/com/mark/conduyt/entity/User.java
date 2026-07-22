package com.mark.conduyt.entity;

import com.mark.conduyt.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String pfpUrl;

    private String profileSlug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    // Pragmatic, low-overhead admin flag
    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin = false;

    // Optional Freelancer Profile (1-to-1)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Freelancer freelancer;

    // Optional Client Profile (1-to-1)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Client client;

    public String getFullName() {
        if (this.middleName == null) {
            return firstName + " " + lastName;
        }
        return this.firstName + " " + this.middleName + " " + this.lastName;
    }
}