package com.gigsly.gigsly_backend_api.dto.task;

import jakarta.validation.constraints.NotNull;

public class AssignProfessionalRequest {

    @NotNull(message = "Professional id is required")
    private Long professionalId;

    public Long getProfessionalId() {
        return professionalId;
    }

    public void setProfessionalId(Long professionalId) {
        this.professionalId = professionalId;
    }
}

