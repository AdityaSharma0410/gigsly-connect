package com.gigsly.gigsly_backend_api.mapper;

import com.gigsly.gigsly_backend_api.dto.task.TaskResponse;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.User;

public final class TaskMapper {

    private TaskMapper() {
    }

    public static TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setBudgetMin(task.getBudgetMin());
        response.setBudgetMax(task.getBudgetMax());
        response.setDeadline(task.getDeadline());
        response.setRequiredSkills(task.getRequiredSkills());
        response.setLocation(task.getLocation());
        response.setRemote(task.getIsRemote());
        response.setEstimatedDuration(task.getEstimatedDuration());

        User client = task.getClient();
        if (client != null) {
            response.setClientId(client.getId());
            response.setClientName(client.getFullName());
        }

        if (task.getCategory() != null) {
            response.setCategoryId(task.getCategory().getId());
            response.setCategoryName(task.getCategory().getName());
        }

        User professional = task.getAssignedProfessional();
        if (professional != null) {
            response.setAssignedProfessionalId(professional.getId());
            response.setAssignedProfessionalName(professional.getFullName());
        }

        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }
}

