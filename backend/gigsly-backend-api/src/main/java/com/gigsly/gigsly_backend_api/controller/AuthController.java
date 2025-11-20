package com.gigsly.gigsly_backend_api.controller;

import com.gigsly.gigsly_backend_api.dto.auth.AuthResponse;
import com.gigsly.gigsly_backend_api.dto.auth.LoginRequest;
import com.gigsly.gigsly_backend_api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@Valid @RequestBody @NonNull LoginRequest request) {
        return authService.authenticate(request);
    }
}

