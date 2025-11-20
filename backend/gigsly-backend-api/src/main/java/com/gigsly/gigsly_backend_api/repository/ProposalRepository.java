package com.gigsly.gigsly_backend_api.repository;

import com.gigsly.gigsly_backend_api.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByTaskId(Long taskId);

    List<Proposal> findByProfessionalId(Long professionalId);

    boolean existsByTaskIdAndProfessionalId(Long taskId, Long professionalId);
}

