package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + authentication.getName()));
    }
}

