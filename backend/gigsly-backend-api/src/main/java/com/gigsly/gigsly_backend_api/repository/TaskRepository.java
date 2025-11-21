package com.gigsly.gigsly_backend_api.repository;

import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);

    List<Task> findByCategoryId(Long categoryId);

    List<Task> findByClientId(Long clientId);

    List<Task> findByAssignedProfessionalId(Long professionalId);

    long countByAssignedProfessionalIdAndStatus(Long professionalId, TaskStatus status);
}

