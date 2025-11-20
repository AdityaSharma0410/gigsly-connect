package com.gigsly.gigsly_backend_api.controller;

import com.gigsly.gigsly_backend_api.dto.task.TaskRequest;
import com.gigsly.gigsly_backend_api.dto.task.TaskResponse;
import com.gigsly.gigsly_backend_api.dto.task.TaskStatusUpdateRequest;
import com.gigsly.gigsly_backend_api.model.TaskStatus;
import com.gigsly.gigsly_backend_api.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@Valid @RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    @PostMapping("/{id}/status")
    public TaskResponse updateStatus(@PathVariable @NonNull Long id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return taskService.updateStatus(id, request);
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(@PathVariable @NonNull Long id) {
        return taskService.getTask(id);
    }

    @GetMapping
    public List<TaskResponse> listTasks(@RequestParam(value = "status", required = false) TaskStatus status,
                                        @RequestParam(value = "categoryId", required = false) Long categoryId,
                                        @RequestParam(value = "clientId", required = false) Long clientId) {
        return taskService.getTasks(status, categoryId, clientId);
    }
}

