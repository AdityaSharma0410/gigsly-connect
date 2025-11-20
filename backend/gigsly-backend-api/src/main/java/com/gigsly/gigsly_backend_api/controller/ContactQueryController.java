package com.gigsly.gigsly_backend_api.controller;

import com.gigsly.gigsly_backend_api.dto.contact.ContactQueryRequest;
import com.gigsly.gigsly_backend_api.dto.contact.ContactQueryResponse;
import com.gigsly.gigsly_backend_api.dto.contact.ContactResponseRequest;
import com.gigsly.gigsly_backend_api.model.QueryStatus;
import com.gigsly.gigsly_backend_api.service.ContactQueryService;
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
@RequestMapping("/api/contact-queries")
public class ContactQueryController {

    private final ContactQueryService contactQueryService;

    public ContactQueryController(ContactQueryService contactQueryService) {
        this.contactQueryService = contactQueryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactQueryResponse submitQuery(@Valid @RequestBody ContactQueryRequest request) {
        return contactQueryService.submitQuery(request);
    }

    @PostMapping("/{id}/respond")
    public ContactQueryResponse respondToQuery(@PathVariable @NonNull Long id,
                                               @Valid @RequestBody ContactResponseRequest request) {
        return contactQueryService.respondToQuery(id, request);
    }

    @GetMapping
    public List<ContactQueryResponse> listQueries(@RequestParam(value = "status", required = false) QueryStatus status) {
        return contactQueryService.listQueries(status);
    }

    @GetMapping("/{id}")
    public ContactQueryResponse getQuery(@PathVariable @NonNull Long id) {
        return contactQueryService.getQuery(id);
    }
}

