package com.gigsly.gigsly_backend_api.dto.contact;

import com.gigsly.gigsly_backend_api.model.QueryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ContactResponseRequest {

    @NotNull(message = "Admin id is required")
    private Long adminId;

    @NotBlank(message = "Response message is required")
    private String response;

    @NotNull(message = "Status is required")
    private QueryStatus status;

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public QueryStatus getStatus() {
        return status;
    }

    public void setStatus(QueryStatus status) {
        this.status = status;
    }
}

