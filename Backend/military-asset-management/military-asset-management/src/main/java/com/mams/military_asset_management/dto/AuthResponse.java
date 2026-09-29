package com.mams.military_asset_management.dto;

public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private String role;
    private Long baseId;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            String name,
            String email,
            String role,
            Long baseId
    ) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.baseId = baseId;
    }

    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getBaseId() {
        return baseId;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setBaseId(Long baseId) {
        this.baseId = baseId;
    }
}