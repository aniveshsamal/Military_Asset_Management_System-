package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.AuthResponse;
import com.mams.military_asset_management.dto.ProfileUpdateRequest;
import com.mams.military_asset_management.dto.UserResponse;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.UserRepository;
import com.mams.military_asset_management.security.JwtService;
import com.mams.military_asset_management.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public ProfileController(
            CurrentUserService currentUserService,
            UserRepository userRepository,
            JwtService jwtService) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public UserResponse getProfile() {
        return toUserResponse(currentUserService.getCurrentUser());
    }

    @PutMapping
    @Transactional
    public AuthResponse updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request) {
        User user = currentUserService.getCurrentUser();
        String email = request.getEmail().trim();

        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null && !existingUser.getId().equals(user.getId())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        user.setName(request.getName().trim());
        user.setEmail(email);
        userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        Long baseId = user.getBase() != null ? user.getBase().getId() : null;
        return new AuthResponse(
                jwtService.generateToken(userDetails),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                baseId);
    }

    private UserResponse toUserResponse(User user) {
        Long baseId = user.getBase() != null ? user.getBase().getId() : null;
        String baseName = user.getBase() != null ? user.getBase().getName() : null;

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                baseId,
                baseName,
                user.isActive());
    }
}