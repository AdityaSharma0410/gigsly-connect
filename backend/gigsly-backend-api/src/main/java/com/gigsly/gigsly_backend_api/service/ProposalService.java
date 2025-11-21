package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.proposal.ProposalRequest;
import com.gigsly.gigsly_backend_api.dto.proposal.ProposalResponse;
import com.gigsly.gigsly_backend_api.dto.proposal.ProposalStatusUpdateRequest;
import com.gigsly.gigsly_backend_api.exception.BadRequestException;
import com.gigsly.gigsly_backend_api.exception.ConflictException;
import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.mapper.ProposalMapper;
import com.gigsly.gigsly_backend_api.model.Proposal;
import com.gigsly.gigsly_backend_api.model.ProposalStatus;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.TaskStatus;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.model.UserRole;
import com.gigsly.gigsly_backend_api.repository.ProposalRepository;
import com.gigsly.gigsly_backend_api.repository.TaskRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;

    public ProposalService(ProposalRepository proposalRepository,
                           TaskRepository taskRepository,
                           CurrentUserService currentUserService) {
        this.proposalRepository = proposalRepository;
        this.taskRepository = taskRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ProposalResponse createProposal(ProposalRequest request) {
        Long taskId = Objects.requireNonNull(request.getTaskId(), "Task id is required");
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        if (task.getStatus() != TaskStatus.OPEN) {
            throw new BadRequestException("Cannot submit proposal to task that is not open");
        }
        User professional = currentUserService.getCurrentUser();
        if (professional.getRole() != UserRole.PROFESSIONAL) {
            throw new BadRequestException("Only professionals can submit proposals");
        }
        if (task.getClient().getId().equals(professional.getId())) {
            throw new BadRequestException("Client cannot submit proposal to their own task");
        }
        if (proposalRepository.existsByTaskIdAndProfessionalId(task.getId(), professional.getId())) {
            throw new ConflictException("Proposal already exists for this task and professional");
        }

        Proposal proposal = new Proposal();
        proposal.setTask(task);
        proposal.setProfessional(professional);
        proposal.setMessage(request.getMessage());
        proposal.setProposedAmount(request.getProposedAmount());
        proposal.setEstimatedDuration(request.getEstimatedDuration());

        Proposal saved = proposalRepository.save(proposal);
        return ProposalMapper.toResponse(saved);
    }

    @Transactional
    public ProposalResponse updateStatus(@NonNull Long proposalId, ProposalStatusUpdateRequest request) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id " + proposalId));
        User current = currentUserService.getCurrentUser();
        if ((current.getRole() != UserRole.CLIENT && current.getRole() != UserRole.ADMIN)
                || (current.getRole() == UserRole.CLIENT && proposal.getTask().getClient() != null
                && !proposal.getTask().getClient().getId().equals(current.getId()))) {
            throw new BadRequestException("Only the task owner can update proposal status");
        }
        ProposalStatus newStatus = Objects.requireNonNull(request.getStatus(), "Proposal status is required");
        if (newStatus == ProposalStatus.ACCEPTED) {
            proposal.setAcceptedAt(LocalDateTime.now());
            proposal.setRejectedAt(null);
            Task task = proposal.getTask();
            task.setAssignedProfessional(proposal.getProfessional());
            task.setStatus(TaskStatus.IN_PROGRESS);
            taskRepository.save(task);
        } else if (newStatus == ProposalStatus.REJECTED) {
            proposal.setRejectedAt(LocalDateTime.now());
            proposal.setAcceptedAt(null);
        } else if (newStatus == ProposalStatus.PENDING) {
            proposal.setAcceptedAt(null);
            proposal.setRejectedAt(null);
        }
        proposal.setStatus(newStatus);
        Proposal saved = proposalRepository.save(proposal);
        return ProposalMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ProposalResponse getProposal(@NonNull Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id " + id));
        return ProposalMapper.toResponse(proposal);
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getProposals(Long taskId, Long professionalId) {
        List<Proposal> proposals;
        if (taskId != null) {
            proposals = proposalRepository.findByTaskId(taskId);
        } else if (professionalId != null) {
            proposals = proposalRepository.findByProfessionalId(professionalId);
        } else {
            proposals = proposalRepository.findAll();
        }
        return proposals.stream()
                .map(ProposalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getProposalsForCurrentUser() {
        User current = currentUserService.getCurrentUser();
        if (current.getRole() == UserRole.PROFESSIONAL) {
            return proposalRepository.findByProfessionalId(current.getId()).stream()
                    .map(ProposalMapper::toResponse)
                    .collect(Collectors.toList());
        }
        if (current.getRole() == UserRole.CLIENT || current.getRole() == UserRole.ADMIN) {
            List<Long> taskIds = taskRepository.findByClientId(current.getId()).stream()
                    .map(Task::getId)
                    .collect(Collectors.toList());
            return taskIds.stream()
                    .flatMap(taskId -> proposalRepository.findByTaskId(taskId).stream())
                    .map(ProposalMapper::toResponse)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getProposalsForTaskOwnedByCurrentUser(@NonNull Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        User current = currentUserService.getCurrentUser();
        if (current.getRole() != UserRole.ADMIN && task.getClient() != null && !task.getClient().getId().equals(current.getId())) {
            throw new BadRequestException("You are not allowed to view proposals for this task");
        }
        return proposalRepository.findByTaskId(taskId).stream()
                .map(ProposalMapper::toResponse)
                .collect(Collectors.toList());
    }
}

