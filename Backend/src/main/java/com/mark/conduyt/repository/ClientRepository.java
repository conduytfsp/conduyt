package com.mark.conduyt.repository;


import com.mark.conduyt.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // Find Client profile by associated core User ID
    Optional<Client> findByUserId(Long userId);
}