package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.task.TaskRequest;
import com.gigsly.gigsly_backend_api.dto.task.TaskResponse;
import com.gigsly.gigsly_backend_api.dto.task.TaskStatusUpdateRequest;
import com.gigsly.gigsly_backend_api.exception.BadRequestException;
import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.mapper.TaskMapper;
import com.gigsly.gigsly_backend_api.model.Category;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.TaskStatus;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.model.UserRole;
import com.gigsly.gigsly_backend_api.repository.CategoryRepository;
import com.gigsly.gigsly_backend_api.repository.TaskRepository;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       CurrentUserService currentUserService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        validateBudgetRange(request);
        User client = currentUserService.getCurrentUser();
        if (client.getRole() != UserRole.CLIENT && client.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Only clients or admins can post tasks");
        }
        Long categoryId = Objects.requireNonNull(request.getCategoryId(), "Category id is required");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setClient(client);
        task.setCategory(category);
        task.setBudgetMin(request.getBudgetMin());
        task.setBudgetMax(request.getBudgetMax());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setRequiredSkills(request.getRequiredSkills());
        task.setLocation(request.getLocation());
        task.setIsRemote(Boolean.TRUE.equals(request.getRemote()));
        task.setEstimatedDuration(request.getEstimatedDuration());

        Long assignedProfessionalId = request.getAssignedProfessionalId();
        if (assignedProfessionalId != null) {
            User professional = validateProfessional(assignedProfessionalId);
            task.setAssignedProfessional(professional);
            task.setStatus(TaskStatus.IN_PROGRESS);
        } else {
            task.setStatus(TaskStatus.OPEN);
        }

        Task saved = taskRepository.save(task);
        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse updateStatus(@NonNull Long taskId, TaskStatusUpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        User current = currentUserService.getCurrentUser();
        boolean isClient = current.getRole() == UserRole.CLIENT || current.getRole() == UserRole.ADMIN;
        if (!isClient) {
            throw new BadRequestException("Only clients or admins can update task status");
        }
        if (current.getRole() != UserRole.ADMIN && task.getClient() != null && !task.getClient().getId().equals(current.getId())) {
            throw new BadRequestException("You are not allowed to update this task");
        }

        TaskStatus newStatus = Objects.requireNonNull(request.getStatus(), "Task status is required");
        if (newStatus == TaskStatus.IN_PROGRESS || newStatus == TaskStatus.COMPLETED) {
            Long professionalId = request.getAssignedProfessionalId();
            if (task.getAssignedProfessional() == null && professionalId == null) {
                throw new BadRequestException("Assign a professional before moving task to " + newStatus);
            }
            if (professionalId != null) {
                User professional = validateProfessional(professionalId);
                task.setAssignedProfessional(professional);
            }
            if (newStatus == TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDateTime.now());
            }
        }

        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);
        return TaskMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(@NonNull Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
        return TaskMapper.toResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(TaskStatus status, Long categoryId, Long clientId) {
        List<Task> tasks;
        if (status == null && categoryId == null && clientId == null) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findAll().stream()
                    .filter(task -> status == null || task.getStatus() == status)
                    .filter(task -> categoryId == null || (task.getCategory() != null && task.getCategory().getId().equals(categoryId)))
                    .filter(task -> clientId == null || (task.getClient() != null && task.getClient().getId().equals(clientId)))
                    .collect(Collectors.toList());
        }

        return tasks.stream()
                .map(TaskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForCurrentUser() {
        User current = currentUserService.getCurrentUser();
        List<Task> tasks;
        if (current.getRole() == UserRole.CLIENT || current.getRole() == UserRole.ADMIN) {
            tasks = taskRepository.findByClientId(current.getId());
        } else {
            tasks = taskRepository.findByAssignedProfessionalId(current.getId());
        }
        return tasks.stream()
                .map(TaskMapper::toResponse)
                .collect(Collectors.toList());
    }

    private User getUser(@NonNull Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    private User validateProfessional(@NonNull Long professionalId) {
        User professional = getUser(professionalId);
        if (professional.getRole() != UserRole.PROFESSIONAL) {
            throw new BadRequestException("User " + professionalId + " is not a professional");
        }
        return professional;
    }

    @Transactional
    public TaskResponse assignProfessional(@NonNull Long taskId, @NonNull Long professionalId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        User current = currentUserService.getCurrentUser();
        boolean isClient = current.getRole() == UserRole.CLIENT || current.getRole() == UserRole.ADMIN;
        if (!isClient) {
            throw new BadRequestException("Only clients or admins can assign professionals");
        }
        if (current.getRole() != UserRole.ADMIN && task.getClient() != null && !task.getClient().getId().equals(current.getId())) {
            throw new BadRequestException("You are not allowed to assign professionals to this task");
        }
        if (task.getStatus() == TaskStatus.COMPLETED || task.getStatus() == TaskStatus.CANCELLED) {
            throw new BadRequestException("Cannot assign professional to completed or cancelled task");
        }

        User professional = validateProfessional(professionalId);
        task.setAssignedProfessional(professional);
        if (task.getStatus() == TaskStatus.OPEN) {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }
        Task saved = taskRepository.save(task);
        return TaskMapper.toResponse(saved);
    }

    private void validateBudgetRange(TaskRequest request) {
        if (request.getBudgetMin() != null && request.getBudgetMax() != null
                && request.getBudgetMin().compareTo(request.getBudgetMax()) > 0) {
            throw new BadRequestException("Minimum budget cannot exceed maximum budget");
        }
    }
}

