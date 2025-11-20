package com.gigsly.gigsly_backend_api.model;

public enum QueryStatus {
    PENDING,    // Query received, awaiting admin response
    IN_PROGRESS, // Admin is working on the query
    RESOLVED,   // Query has been resolved
    CLOSED      // Query is closed
}

