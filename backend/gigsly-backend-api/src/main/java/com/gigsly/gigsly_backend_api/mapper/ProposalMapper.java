package com.gigsly.gigsly_backend_api.mapper;

import com.gigsly.gigsly_backend_api.dto.proposal.ProposalResponse;
import com.gigsly.gigsly_backend_api.model.Proposal;
import com.gigsly.gigsly_backend_api.model.Task;
import com.gigsly.gigsly_backend_api.model.User;

public final class ProposalMapper {

    private ProposalMapper() {
    }

    public static ProposalResponse toResponse(Proposal proposal) {
        ProposalResponse response = new ProposalResponse();
        response.setId(proposal.getId());
        response.setMessage(proposal.getMessage());
        response.setProposedAmount(proposal.getProposedAmount());
        response.setEstimatedDuration(proposal.getEstimatedDuration());
        response.setStatus(proposal.getStatus());
        response.setCreatedAt(proposal.getCreatedAt());
        response.setUpdatedAt(proposal.getUpdatedAt());
        response.setAcceptedAt(proposal.getAcceptedAt());
        response.setRejectedAt(proposal.getRejectedAt());

        Task task = proposal.getTask();
        if (task != null) {
            response.setTaskId(task.getId());
            response.setTaskTitle(task.getTitle());
        }

        User professional = proposal.getProfessional();
        if (professional != null) {
            response.setProfessionalId(professional.getId());
            response.setProfessionalName(professional.getFullName());
        }
        return response;
    }
}

