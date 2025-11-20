package com.gigsly.gigsly_backend_api.dto.task;

import com.gigsly.gigsly_backend_api.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusUpdateRequest {

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    private Long assignedProfessionalId;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Long getAssignedProfessionalId() {
        return assignedProfessionalId;
    }

    public void setAssignedProfessionalId(Long assignedProfessionalId) {
        this.assignedProfessionalId = assignedProfessionalId;
    }
}

