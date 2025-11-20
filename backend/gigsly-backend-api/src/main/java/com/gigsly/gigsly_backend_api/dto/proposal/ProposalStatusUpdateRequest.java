package com.gigsly.gigsly_backend_api.dto.proposal;

import com.gigsly.gigsly_backend_api.model.ProposalStatus;
import jakarta.validation.constraints.NotNull;

public class ProposalStatusUpdateRequest {

    @NotNull(message = "Proposal status is required")
    private ProposalStatus status;

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }
}

