package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.UserResponse;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(
            @RequestBody User user
    ) {

        if (user.getName() == null ||
                user.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Name is required"
            );
        }

        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required"
            );
        }

        if (user.getRole() == null) {

            throw new IllegalArgumentException(
                    "Role is required"
            );
        }

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already exists"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    private UserResponse toUserResponse(User user) {

        Long baseId = null;
        String baseName = null;

        if (user.getBase() != null) {
            baseId = user.getBase().getId();
            baseName = user.getBase().getName();
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                baseId,
                baseName,
                user.isActive()
        );
    }
}