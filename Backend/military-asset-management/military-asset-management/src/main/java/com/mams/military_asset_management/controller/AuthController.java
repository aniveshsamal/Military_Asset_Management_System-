package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.AuthResponse;
import com.mams.military_asset_management.dto.LoginRequest;
import com.mams.military_asset_management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}