package com.gigsly.gigsly_backend_api.service;

import com.gigsly.gigsly_backend_api.dto.auth.AuthResponse;
import com.gigsly.gigsly_backend_api.dto.auth.LoginRequest;
import com.gigsly.gigsly_backend_api.dto.user.UserResponse;
import com.gigsly.gigsly_backend_api.mapper.UserMapper;
import com.gigsly.gigsly_backend_api.model.User;
import com.gigsly.gigsly_backend_api.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public AuthResponse authenticate(@NonNull LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        String token = jwtService.generateToken(principal);

        UserResponse userResponse = UserMapper.toResponse(user);
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setExpiresAt(jwtService.getExpirationInstant());
        response.setUser(userResponse);
        return response;
    }
}

