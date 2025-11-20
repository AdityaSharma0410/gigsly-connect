package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.contact.ContactQueryRequest;
import com.gigsly.gigsly_backend_api.dto.contact.ContactQueryResponse;
import com.gigsly.gigsly_backend_api.dto.contact.ContactResponseRequest;
import com.gigsly.gigsly_backend_api.exception.BadRequestException;
import com.gigsly.gigsly_backend_api.exception.ResourceNotFoundException;
import com.gigsly.gigsly_backend_api.mapper.ContactQueryMapper;
import com.gigsly.gigsly_backend_api.model.ContactQuery;
import com.gigsly.gigsly_backend_api.model.QueryStatus;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.model.UserRole;
import com.gigsly.gigsly_backend_api.repository.ContactQueryRepository;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ContactQueryService {

    private final ContactQueryRepository contactQueryRepository;
    private final UserRepository userRepository;

    public ContactQueryService(ContactQueryRepository contactQueryRepository,
                               UserRepository userRepository) {
        this.contactQueryRepository = contactQueryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ContactQueryResponse submitQuery(ContactQueryRequest request) {
        ContactQuery query = new ContactQuery();
        query.setName(request.getName());
        query.setEmail(request.getEmail());
        query.setMobile(request.getMobile());
        query.setQueryType(request.getQueryType());
        query.setMessage(request.getMessage());
        ContactQuery saved = contactQueryRepository.save(query);
        return ContactQueryMapper.toResponse(saved);
    }

    @Transactional
    public ContactQueryResponse respondToQuery(@NonNull Long queryId, ContactResponseRequest request) {
        ContactQuery query = contactQueryRepository.findById(queryId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact query not found with id " + queryId));

        if (query.getStatus() == QueryStatus.RESOLVED || query.getStatus() == QueryStatus.CLOSED) {
            throw new BadRequestException("Query already resolved or closed");
        }

        Long adminId = Objects.requireNonNull(request.getAdminId(), "Admin id is required");
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + adminId));
        if (admin.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Only admins can respond to queries");
        }

        query.setAdminResponse(request.getResponse());
        query.setStatus(request.getStatus());
        query.setRespondedAt(LocalDateTime.now());
        query.setRespondedBy(admin);
        ContactQuery saved = contactQueryRepository.save(query);
        return ContactQueryMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactQueryResponse> listQueries(QueryStatus status) {
        List<ContactQuery> queries = status == null ? contactQueryRepository.findAll() : contactQueryRepository.findByStatus(status);
        return queries.stream()
                .map(ContactQueryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContactQueryResponse getQuery(@NonNull Long id) {
        ContactQuery query = contactQueryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact query not found with id " + id));
        return ContactQueryMapper.toResponse(query);
    }
}

