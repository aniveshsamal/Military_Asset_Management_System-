package com.mams.military_asset_management.service;

import com.mams.military_asset_management.dto.AuthResponse;
import com.mams.military_asset_management.dto.LoginRequest;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.UserRepository;
import com.mams.military_asset_management.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        org.springframework.security.core.userdetails.User
                userDetails =
                (org.springframework.security.core.userdetails.User)
                        org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(
                                        "ROLE_" + user.getRole().name()
                                )
                                .build();

        String token = jwtService.generateToken(userDetails);

        Long baseId = user.getBase() != null
                ? user.getBase().getId()
                : null;

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                baseId
        );
    }
}