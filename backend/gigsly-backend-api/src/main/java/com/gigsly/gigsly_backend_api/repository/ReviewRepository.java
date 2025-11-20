package com.gigsly.gigsly_backend_api.repository;

import com.gigsly.gigsly_backend_api.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);

    List<Review> findByReviewerId(Long reviewerId);

    boolean existsByTaskIdAndReviewerIdAndRevieweeId(Long taskId, Long reviewerId, Long revieweeId);
}

