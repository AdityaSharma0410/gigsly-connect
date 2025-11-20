package com.gigsly.gigsly_backend_api.dto.auth;

import com.gigsly.gigsly_backend_api.dto.user.UserResponse;

import java.time.Instant;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Instant expiresAt;
    private UserResponse user;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}

