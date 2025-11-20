package com.gigsly.gigsly_backend_api.mapper;

import com.gigsly.gigsly_backend_api.dto.contact.ContactQueryResponse;
import com.gigsly.gigsly_backend_api.model.ContactQuery;
import com.gigsly.gigsly_backend_api.model.User;

public final class ContactQueryMapper {

    private ContactQueryMapper() {
    }

    public static ContactQueryResponse toResponse(ContactQuery query) {
        ContactQueryResponse response = new ContactQueryResponse();
        response.setId(query.getId());
        response.setName(query.getName());
        response.setEmail(query.getEmail());
        response.setMobile(query.getMobile());
        response.setQueryType(query.getQueryType());
        response.setMessage(query.getMessage());
        response.setStatus(query.getStatus());
        response.setAdminResponse(query.getAdminResponse());
        response.setRespondedAt(query.getRespondedAt());
        response.setCreatedAt(query.getCreatedAt());

        User admin = query.getRespondedBy();
        if (admin != null) {
            response.setRespondedById(admin.getId());
            response.setRespondedByName(admin.getFullName());
        }

        return response;
    }
}

