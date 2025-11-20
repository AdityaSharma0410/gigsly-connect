package com.gigsly.gigsly_backend_api.repository;

import com.gigsly.gigsly_backend_api.model.ContactQuery;
import com.gigsly.gigsly_backend_api.model.QueryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {
    List<ContactQuery> findByStatus(QueryStatus status);
}

