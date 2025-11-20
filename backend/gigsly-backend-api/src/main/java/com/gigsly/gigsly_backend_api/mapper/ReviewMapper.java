package com.gigsly.gigsly_backend_api.mapper;

import com.gigsly.gigsly_backend_api.dto.review.ReviewResponse;
import com.gigsly.gigsly_backend_api.model.Review;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.User;

public final class ReviewMapper {

    private ReviewMapper() {
    }

    public static ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        Task task = review.getTask();
        if (task != null) {
            response.setTaskId(task.getId());
        }

        User reviewer = review.getReviewer();
        if (reviewer != null) {
            response.setReviewerId(reviewer.getId());
            response.setReviewerName(reviewer.getFullName());
        }

        User reviewee = review.getReviewee();
        if (reviewee != null) {
            response.setRevieweeId(reviewee.getId());
            response.setRevieweeName(reviewee.getFullName());
        }

        return response;
    }
}

