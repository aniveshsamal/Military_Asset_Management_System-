package com.mams.military_asset_management.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Long baseId;
    private String baseName;
    private boolean active;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String name,
            String email,
            String role,
            Long baseId,
            String baseName,
            boolean active
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.baseId = baseId;
        this.baseName = baseName;
        this.active = active;
    }

    public Long getId() {
        return id;
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

    public String getBaseName() {
        return baseName;
    }

    public boolean isActive() {
        return active;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}