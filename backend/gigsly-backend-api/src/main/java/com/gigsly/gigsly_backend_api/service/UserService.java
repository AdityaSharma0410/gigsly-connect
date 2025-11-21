package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.user.ProfessionalProfileRequest;
import com.gigsly.gigsly_backend_api.dto.user.UserRequest;
import com.gigsly.gigsly_backend_api.dto.user.UserResponse;
import com.gigsly.gigsly_backend_api.exception.ConflictException;
import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.mapper.UserMapper;
import com.gigsly.gigsly_backend_api.model.TaskStatus;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.model.UserRole;
import com.gigsly.gigsly_backend_api.repository.ReviewRepository;
import com.gigsly.gigsly_backend_api.repository.TaskRepository;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReviewRepository reviewRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       ReviewRepository reviewRepository,
                       TaskRepository taskRepository,
                       CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reviewRepository = reviewRepository;
        this.taskRepository = taskRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already in use");
        }
        User user = Objects.requireNonNull(UserMapper.toEntity(request), "Unable to create user entity");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(UserRole role) {
        List<User> users = role == null ? userRepository.findAll() : userRepository.findByRole(role);
        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        return mapToResponse(currentUserService.getCurrentUser());
    }

    @Transactional
    public UserResponse updateProfessionalProfile(ProfessionalProfileRequest request) {
        User current = currentUserService.getCurrentUser();
        if (current.getRole() != UserRole.PROFESSIONAL) {
            throw new ConflictException("Only professionals can update their profile");
        }
        current.setPrimaryCategory(request.getPrimaryCategory());
        current.setSkills(request.getSkills().stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(",")));
        current.setHourlyRate(request.getHourlyRate());
        current.setBio(request.getBio());
        current.setLocation(request.getLocation());
        current.setMobile(request.getPhone());
        User saved = userRepository.save(current);
        return mapToResponse(saved);
    }

    private UserResponse mapToResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponse response = UserMapper.toResponse(user);
        var reviews = reviewRepository.findByRevieweeId(user.getId());
        int reviewCount = reviews.size();
        double average = reviewCount == 0 ? 0.0 :
                reviews.stream().mapToInt(r -> r.getRating() == null ? 0 : r.getRating()).average().orElse(0.0);
        response.setReviewCount(reviewCount);
        response.setAverageRating(reviewCount == 0 ? null : average);
        long completedProjects = taskRepository.countByAssignedProfessionalIdAndStatus(user.getId(), TaskStatus.COMPLETED);
        response.setCompletedProjects(completedProjects);
        return response;
    }
}

