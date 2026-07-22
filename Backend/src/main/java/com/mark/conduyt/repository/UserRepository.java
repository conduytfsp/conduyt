package com.mark.conduyt.repository;


import com.mark.conduyt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // For JWT authentication & user lookup
    Optional<User> findByEmail(String email);

    // Registration validation check
    boolean existsByEmail(String email);
}