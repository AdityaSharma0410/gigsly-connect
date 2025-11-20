package com.gigsly.gigsly_backend_api.controller;

import com.gigsly.gigsly_backend_api.dto.review.ReviewRequest;
import com.gigsly.gigsly_backend_api.dto.review.ReviewResponse;
import com.gigsly.gigsly_backend_api.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@Valid @RequestBody ReviewRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping
    public List<ReviewResponse> getReviews(@RequestParam("userId") @NonNull Long userId) {
        return reviewService.getReviewsForUser(userId);
    }
}

