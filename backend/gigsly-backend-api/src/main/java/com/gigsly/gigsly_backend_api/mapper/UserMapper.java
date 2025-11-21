package com.gigsly.gigsly_backend_api.mapper;

import com.gigsly.gigsly_backend_api.dto.user.UserRequest;
import com.gigsly.gigsly_backend_api.dto.user.UserResponse;
import com.gigsly.gigsly_backend_api.model.User;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(UserRequest request) {
        User user = new User();
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : null);
        user.setEmail(request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null);
        user.setPassword(request.getPassword());
        user.setMobile(request.getMobile() != null ? request.getMobile().trim() : null);
        user.setRole(request.getRole());
        user.setBio(request.getBio());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        user.setPrimaryCategory(request.getPrimaryCategory());
        user.setSkills(joinSkills(request.getSkills()));
        user.setHourlyRate(request.getHourlyRate());
        user.setLocation(request.getLocation());
        return user;
    }

    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setMobile(user.getMobile());
        response.setRole(user.getRole());
        response.setVerified(user.getIsVerified());
        response.setActive(user.getIsActive());
        response.setBio(user.getBio());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setPrimaryCategory(user.getPrimaryCategory());
        response.setSkills(splitSkills(user.getSkills()));
        response.setHourlyRate(user.getHourlyRate());
        response.setLocation(user.getLocation());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }

    private static String joinSkills(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return null;
        }
        return skills.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(","));
    }

    private static List<String> splitSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}

