package com.gigsly.gigsly_backend_api.repository;

import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);
}

