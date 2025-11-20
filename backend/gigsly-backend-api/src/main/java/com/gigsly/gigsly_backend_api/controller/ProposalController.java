package com.gigsly.gigsly_backend_api.controller;

import com.gigsly.gigsly_backend_api.dto.proposal.ProposalRequest;
import com.gigsly.gigsly_backend_api.dto.proposal.ProposalResponse;
import com.gigsly.gigsly_backend_api.dto.proposal.ProposalStatusUpdateRequest;
import com.gigsly.gigsly_backend_api.service.ProposalService;
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
@RequestMapping("/api/proposals")
public class ProposalController {

    private final ProposalService proposalService;

    public ProposalController(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProposalResponse createProposal(@Valid @RequestBody ProposalRequest request) {
        return proposalService.createProposal(request);
    }

    @PostMapping("/{id}/status")
    public ProposalResponse updateStatus(@PathVariable @NonNull Long id, @Valid @RequestBody ProposalStatusUpdateRequest request) {
        return proposalService.updateStatus(id, request);
    }

    @GetMapping("/{id}")
    public ProposalResponse getProposal(@PathVariable @NonNull Long id) {
        return proposalService.getProposal(id);
    }

    @GetMapping
    public List<ProposalResponse> getProposals(@RequestParam(value = "taskId", required = false) Long taskId,
                                               @RequestParam(value = "professionalId", required = false) Long professionalId) {
        return proposalService.getProposals(taskId, professionalId);
    }
}

