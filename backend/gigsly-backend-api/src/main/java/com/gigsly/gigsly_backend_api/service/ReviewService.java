package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.review.ReviewRequest;
import com.gigsly.gigsly_backend_api.dto.review.ReviewResponse;
import com.gigsly.gigsly_backend_api.exception.BadRequestException;
import com.gigsly.gigsly_backend_api.exception.ConflictException;
import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.mapper.ReviewMapper;
import com.gigsly.gigsly_backend_api.model.Review;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.repository.ReviewRepository;
import com.gigsly.gigsly_backend_api.repository.TaskRepository;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public ReviewService(ReviewRepository reviewRepository,
                         TaskRepository taskRepository,
                         UserRepository userRepository,
                         CurrentUserService currentUserService) {
        this.reviewRepository = reviewRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        Long taskId = Objects.requireNonNull(request.getTaskId(), "Task id is required");
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        User reviewer = currentUserService.getCurrentUser();
        Long revieweeId = Objects.requireNonNull(request.getRevieweeId(), "Reviewee id is required");
        User reviewee = userRepository.findById(revieweeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + revieweeId));

        boolean reviewerParticipated = reviewer.getId().equals(task.getClient().getId()) ||
                (task.getAssignedProfessional() != null && reviewer.getId().equals(task.getAssignedProfessional().getId()));
        boolean revieweeParticipated = reviewee.getId().equals(task.getClient().getId()) ||
                (task.getAssignedProfessional() != null && reviewee.getId().equals(task.getAssignedProfessional().getId()));

        if (!reviewerParticipated || !revieweeParticipated) {
            throw new BadRequestException("Only participants of the task can review each other");
        }

        if (reviewer.getId().equals(reviewee.getId())) {
            throw new BadRequestException("Reviewer and reviewee cannot be the same");
        }

        if (reviewRepository.existsByTaskIdAndReviewerIdAndRevieweeId(task.getId(), reviewer.getId(), reviewee.getId())) {
            throw new ConflictException("Review already submitted for this task and user");
        }

        Review review = new Review();
        review.setTask(task);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        return ReviewMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForUser(@NonNull Long userId) {
        List<Review> reviews = reviewRepository.findByRevieweeId(userId);
        return reviews.stream()
                .map(ReviewMapper::toResponse)
                .collect(Collectors.toList());
    }
}

