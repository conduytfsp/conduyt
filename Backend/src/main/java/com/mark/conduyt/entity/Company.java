package com.mark.conduyt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String websiteUrl;

    private String logoUrl;

    private String contactNumber;

    private String address;

    private String gstin; // e.g., EIN or VAT for verification

    @Column(nullable = false)
    private boolean verified = false;
}