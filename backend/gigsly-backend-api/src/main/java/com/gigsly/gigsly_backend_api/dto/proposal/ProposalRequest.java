package com.gigsly.gigsly_backend_api.dto.proposal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProposalRequest {

    @NotNull(message = "Task id is required")
    private Long taskId;

    @NotNull(message = "Professional id is required")
    private Long professionalId;

    @NotBlank(message = "Proposal message is required")
    private String message;

    @DecimalMin(value = "0.0", inclusive = false, message = "Proposed amount must be greater than zero")
    private BigDecimal proposedAmount;

    private String estimatedDuration;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getProfessionalId() {
        return professionalId;
    }

    public void setProfessionalId(Long professionalId) {
        this.professionalId = professionalId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getProposedAmount() {
        return proposedAmount;
    }

    public void setProposedAmount(BigDecimal proposedAmount) {
        this.proposedAmount = proposedAmount;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
}

